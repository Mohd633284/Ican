// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// Your Firebase configuration object
// ICAN Management Firebase Project
const firebaseConfig = {
  apiKey: "AIzaSyCbKsEog8xom6pdWz3kdhUbEeBbs6DZNYU",
  authDomain: "ican-management.firebaseapp.com",
  projectId: "ican-management",
  storageBucket: "ican-management.firebasestorage.app",
  messagingSenderId: "1060896439449",
  appId: "1:1060896439449:web:885170399fc222caffcc08",
  measurementId: "G-QSHED13M75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export Firebase services
export {
  auth,
  db,
  storage,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  storageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
};

export default app;
