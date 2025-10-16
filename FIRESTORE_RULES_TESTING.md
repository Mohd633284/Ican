# 🔥 FIREBASE SECURITY RULES - TESTING MODE

## ⚠️ IMPORTANT: These rules are for TESTING ONLY!
## Copy and paste these rules into your Firebase Console → Firestore Database → Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 🧪 TESTING MODE: Allow all read/write operations
    // ⚠️ WARNING: Do NOT use this in production!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

## 📝 HOW TO UPDATE:
1. Go to Firebase Console: https://console.firebase.google.com/project/ican-management
2. Click "Firestore Database" in left sidebar
3. Click "Rules" tab at the top
4. Replace ALL existing rules with the rules above
5. Click "Publish" button

## ✅ After Publishing:
- Your app will be able to read/write to Firebase without authentication
- This is perfect for testing and development
- You can add authentication later for production

## 🔐 PRODUCTION RULES (Use Later):
When ready for production, use these rules with authentication:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Branch data - require authentication
    match /branches/{branchId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

---
Created: Testing rules for Firebase integration
Status: Ready to publish
