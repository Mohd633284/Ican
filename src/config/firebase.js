/**
 * Firebase Configuration for ICAN Micro-App
 * Separate Firebase instance from main SmartDesignPro project
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ICAN Firebase Configuration
// TODO: Replace with your ICAN Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_ICAN_API_KEY",
  authDomain: "YOUR_ICAN_PROJECT.firebaseapp.com",
  projectId: "YOUR_ICAN_PROJECT_ID",
  storageBucket: "YOUR_ICAN_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize ICAN Firebase App (separate from SmartDesignPro)
const icanApp = initializeApp(firebaseConfig, 'ican-app');

// Initialize ICAN Firestore
export const db = getFirestore(icanApp);

// Initialize ICAN Auth
export const auth = getAuth(icanApp);

console.log('✅ ICAN Firebase initialized separately from SmartDesignPro');
console.log('📊 ICAN Project ID:', firebaseConfig.projectId);
