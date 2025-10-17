const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Config: collection and counter doc path
const MEMBERS_COLLECTION = 'members';
const COUNTER_DOC = 'metadata/member_count';

// Helper to get current member count
async function getMemberCount(tx) {
  const ref = db.doc(COUNTER_DOC);
  const doc = await tx.get(ref);
  if (!doc.exists) return 0;
  return doc.data().count || 0;
}

// HTTP function to create a member (developer-only)
exports.createMember = functions.https.onRequest(async (req, res) => {
  // Allow CORS for your frontend domain during development (restrict in prod)
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).send('');

  try {
    const { email, password, displayName, secretKey } = req.body || {};
    if (!email || !password || !secretKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: replace this with a secure server-side secret check (env var)
    const ADMIN_SECRET = functions.config().app ? functions.config().app.dev_secret : null;
    if (!ADMIN_SECRET || secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Perform transaction: read and increment counter, create auth user and member doc
    const result = await db.runTransaction(async (tx) => {
      const counterRef = db.doc(COUNTER_DOC);
      const counterDoc = await tx.get(counterRef);
      const current = counterDoc.exists ? (counterDoc.data().count || 0) : 0;
      if (current >= 3) {
        throw new functions.https.HttpsError('failed-precondition', 'Maximum number of members reached');
      }

      // Create Auth user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: displayName || null,
      });

      // Create member document
      const memberRef = db.collection(MEMBERS_COLLECTION).doc(userRecord.uid);
      tx.set(memberRef, {
        email,
        displayName: displayName || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update counter
      tx.set(counterRef, { count: current + 1 }, { merge: true });

      return { uid: userRecord.uid };
    });

    return res.json({ success: true, uid: result.uid });
  } catch (err) {
    console.error('createMember error', err);
    if (err instanceof functions.https.HttpsError) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// Auth user deletion handler to decrement counter and remove member doc
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const memberRef = db.collection(MEMBERS_COLLECTION).doc(uid);
  const counterRef = db.doc(COUNTER_DOC);

  try {
    await db.runTransaction(async (tx) => {
      tx.delete(memberRef);
      const counterDoc = await tx.get(counterRef);
      const current = counterDoc.exists ? (counterDoc.data().count || 0) : 0;
      const next = Math.max(0, current - 1);
      tx.set(counterRef, { count: next }, { merge: true });
    });
  } catch (err) {
    console.error('onUserDelete error', err);
  }
});