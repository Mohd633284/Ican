import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase configuration here
  // You can get this from Firebase Console -> Project Settings -> General -> Your Apps
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code == 'unimplemented') {
    console.error('The current browser doesn\'t support persistence.');
  }
});

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Initialize Storage
const storage = getStorage(app);

// Example using the new Firebase Functions API
const API_BASE = 'https://[your-region]-[your-project-id].cloudfunctions.net/api';

async function getMembers() {
  const response = await fetch(`${API_BASE}/members`);
  return response.json();
}

async function createMember(memberData) {
  const response = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData)
  });
  return response.json();
}

export { app, db, auth, storage, getMembers, createMember };
