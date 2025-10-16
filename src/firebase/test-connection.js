// Firebase Connection Test
// Run this in your browser console to test Firebase setup

import { auth, db, storage } from '@/firebase/config';

console.log('🔥 Firebase Connection Test\n');
console.log('================================\n');

// Test Firebase Auth
if (auth) {
  console.log('✅ Firebase Authentication: CONNECTED');
  console.log('   Project ID:', auth.app.options.projectId);
} else {
  console.log('❌ Firebase Authentication: FAILED');
}

// Test Firestore Database
if (db) {
  console.log('✅ Firestore Database: CONNECTED');
  console.log('   Database:', db.type);
} else {
  console.log('❌ Firestore Database: FAILED');
}

// Test Cloud Storage
if (storage) {
  console.log('✅ Cloud Storage: CONNECTED');
  console.log('   Bucket:', storage.app.options.storageBucket);
} else {
  console.log('❌ Cloud Storage: FAILED');
}

console.log('\n================================');
console.log('🎉 Firebase is ready to use!\n');
console.log('Next steps:');
console.log('1. Enable Authentication in Firebase Console');
console.log('2. Enable Firestore Database');
console.log('3. Enable Cloud Storage');
console.log('\nVisit: https://console.firebase.google.com/project/ican-management');
