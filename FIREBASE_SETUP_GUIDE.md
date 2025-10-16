# Firebase Integration Guide for ICAN Project

## 🔥 Firebase Setup Instructions

### Step 1: Install Firebase Dependencies

Run this command in your project root:

```bash
npm install firebase
```

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: **ICAN-Management** (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 3: Register Your Web App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Enter app nickname: **ICAN Web App**
3. Check "Firebase Hosting" if you want to host your app
4. Click "Register app"
5. Copy the `firebaseConfig` object

### Step 4: Configure Firebase

1. Open: `src/firebase/config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX" // Optional
};
```

### Step 5: Enable Firebase Services

#### Enable Authentication:
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Google Sign-In**:
   - Click "Google"
   - Toggle "Enable"
   - Select support email
   - Click "Save"
4. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

#### Enable Firestore Database:
1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Test Mode** (change to production rules later)
4. Choose location closest to your users
5. Click "Enable"

#### Enable Storage:
1. Go to **Storage**
2. Click "Get Started"
3. Start in **Test Mode**
4. Choose same location as Firestore
5. Click "Done"

### Step 6: Configure Security Rules

#### Firestore Rules (for development):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow branch members to read/write their branch data
    match /branches/{branchId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules (for development):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /branches/{branchId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 How to Use Firebase in Your App

### 1. Authentication (PasswordVerificationModal.vue)

Update `PasswordVerificationModal.vue` to use Firebase:

```javascript
import { getAllMembers } from '@/firebase';

// Load members from Firebase instead of localStorage
const loadMembers = async () => {
  try {
    isLoadingMembers.value = true;
    const branchId = 'your-branch-id'; // Get from route or context
    const result = await getAllMembers(branchId);
    
    if (result.success) {
      availableMembers.value = result.data;
    } else {
      error.value = 'Failed to load members';
    }
  } catch (err) {
    console.error('Error loading members:', err);
    error.value = 'Failed to load members';
  } finally {
    isLoadingMembers.value = false;
  }
};
```

### 2. Save Invoices to Cloud (InvoicePage.vue)

```javascript
import { saveInvoice, uploadInvoicePDF } from '@/firebase';

const handleExportPDF = async () => {
  // ... existing PDF generation code ...
  
  // After generating PDF, upload to Firebase
  const branchId = route.query.branch || 'default';
  
  // Save invoice metadata to Firestore
  await saveInvoice(branchId, {
    number: receiptNumber.value,
    customerName: customerName.value,
    amount: grandTotal.value,
    items: items.value,
    date: date.value
  });
  
  // Upload PDF file to Storage (if you have the blob)
  // const pdfBlob = await generatePDFBlob(); // Your PDF generation
  // await uploadInvoicePDF(branchId, receiptNumber.value, pdfBlob);
};
```

### 3. Save Receipts to Cloud (ReceiptPage.vue)

```javascript
import { saveReceipt, uploadReceiptPDF } from '@/firebase';

const handleExportPDF = async () => {
  // ... existing PDF generation code ...
  
  const branchId = route.query.branch || 'default';
  
  // Save receipt metadata
  await saveReceipt(branchId, {
    number: receiptNumber.value,
    receivedFrom: receivedFrom.value,
    amount: naira.value,
    date: date.value
  });
};
```

### 4. Backup & Sync Data

```javascript
import { backupLocalStorageToCloud, restoreFromCloud } from '@/firebase';

// Backup current data
const backupData = async () => {
  const branchId = 'your-branch-id';
  const result = await backupLocalStorageToCloud(branchId);
  
  if (result.success) {
    alert('Data backed up successfully!');
  }
};

// Restore from cloud
const restoreData = async () => {
  const branchId = 'your-branch-id';
  const result = await restoreFromCloud(branchId);
  
  if (result.success) {
    alert('Data restored successfully!');
    location.reload(); // Refresh to show restored data
  }
};
```

---

## 🔐 Firebase Security Best Practices

### Production Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their branch
    match /branches/{branchId}/members/{memberId} {
      allow read: if request.auth != null && 
                    request.auth.uid == memberId;
      allow write: if request.auth != null;
    }
    
    match /branches/{branchId}/invoices/{invoiceId} {
      allow read, write: if request.auth != null;
    }
    
    match /branches/{branchId}/receipts/{receiptId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated users can upload files
    match /branches/{branchId}/{folder}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

---

## 📊 Firebase Console Monitoring

- **Authentication**: View logged-in users
- **Firestore**: View/edit database records
- **Storage**: View uploaded files
- **Usage**: Monitor quotas and costs

---

## 🚀 Quick Start Commands

```bash
# Install Firebase
npm install firebase

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Firebase File Structure

```
src/
├── firebase/
│   ├── config.js       # Firebase initialization
│   ├── auth.js         # Authentication functions
│   ├── database.js     # Firestore functions
│   ├── storage.js      # Storage functions
│   └── index.js        # Export all services
```

---

## ⚠️ Important Notes

1. **Never commit Firebase config with real credentials** - Use environment variables in production
2. **Test Mode is insecure** - Update security rules before going live
3. **Monitor usage** - Firebase has free tier limits
4. **Backup regularly** - Export Firestore data periodically

---

## 🆘 Troubleshooting

### Error: "Firebase app not initialized"
- Make sure you've replaced the config in `config.js`

### Error: "Permission denied"
- Check Firestore/Storage security rules
- Make sure user is authenticated

### Error: "Module not found: firebase"
- Run `npm install firebase`

---

## 📞 Support

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
