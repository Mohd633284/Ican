# ICAN Firebase Setup Guide

## Overview
The ICAN micro-app now has its own separate Firebase configuration, independent from the main SmartDesignPro project.

## Setup Steps

### 1. Create a New Firebase Project for ICAN

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it: **ICAN-Management** (or your preferred name)
4. Follow the setup wizard
5. Enable Firestore Database
6. Enable Authentication (Email/Password)

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register your app as "ICAN Web App"
5. Copy the firebaseConfig object

### 3. Update ICAN Firebase Config

Edit: `src/views/micro-apps/Ican/src/config/firebase.js`

Replace the placeholder values with your actual Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",  // Your actual API key
  authDomain: "ican-management.firebaseapp.com",
  projectId: "ican-management",
  storageBucket: "ican-management.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Set Up Firestore Collections

Create these collections in your ICAN Firebase project:

- `branches` - Branch management
- `users` - User accounts
- `invoices` - Invoice records
- `receipts` - Receipt records
- `counters` - Document counters
- `signatures` - Member signatures
- `activities` - Activity logs

### 5. Configure Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Branches collection
    match /branches/{branchId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Receipts collection
    match /receipts/{receiptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Other collections follow similar patterns
  }
}
```

### 6. Current ICAN Storage Mode

**Important:** The ICAN micro-app currently uses **LocalStorage mode** for offline-first functionality. This means:

- ✅ Works without internet
- ✅ Data stored locally in browser
- ❌ No multi-device sync
- ❌ No real-time collaboration

### 7. Switch to Firebase Mode (Optional)

To use Firebase instead of LocalStorage, you need to:

1. Update `src/config/firebase.js` with your credentials
2. Modify `ican-service.js` to use Firebase methods
3. Install Firebase packages if not already installed:
   ```bash
   npm install firebase
   ```

### 8. Hybrid Mode (Recommended)

For best results, implement hybrid mode:
- Primary: Firebase for cloud sync
- Fallback: LocalStorage for offline access
- Auto-sync when online

## Benefits of Separate Firebase

✅ **Independent Data** - ICAN data separate from SmartDesignPro  
✅ **Custom Security** - Different security rules for ICAN  
✅ **Scalability** - Dedicated quota and resources  
✅ **Billing Separation** - Separate billing for each project  

## Current Status

- ✅ Firebase config file created
- ⏳ Using LocalStorage mode (offline-first)
- ⏳ Firebase credentials need to be added
- ⏳ Service layer ready for Firebase integration

## Next Steps

1. Create ICAN Firebase project
2. Copy credentials to `firebase.js`
3. Test connection
4. Optionally migrate to Firebase mode
