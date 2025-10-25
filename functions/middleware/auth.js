const admin = require('firebase-admin');

// Middleware to verify Firebase Auth token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No authentication token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid authentication token' 
    });
  }
};

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .get();

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      error: 'Permission denied' 
    });
  }
};

module.exports = {
  authenticateUser,
  requireAdmin
};