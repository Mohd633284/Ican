# 🔥 FIREBASE INTEGRATION - QUICK START

## ✅ What You Get

Your ICAN project now has Firebase integration for:

1. **Authentication** - Google login, Email/Password login
2. **Cloud Database** - Firestore for members, invoices, receipts
3. **File Storage** - Cloud storage for PDFs, images, documents
4. **Backup & Sync** - Automatic cloud backup of your data

---

## 📦 Step 1: Install Firebase

Run this command:

```bash
npm install firebase
```

---

## 🔧 Step 2: Setup Firebase Project

1. Visit: https://console.firebase.google.com/
2. Click "Add Project"
3. Name it: **ICAN-Management**
4. Follow the wizard, disable Analytics
5. Click on Web icon (</>) to register your app
6. Copy the config object

---

## ⚙️ Step 3: Configure Your App

1. Open: `src/firebase/config.js`
2. Replace this section:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Replace with your values
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔐 Step 4: Enable Firebase Services

### Enable Authentication:
1. Go to Authentication → Get Started
2. Enable **Google** sign-in
3. Enable **Email/Password** sign-in

### Enable Firestore:
1. Go to Firestore Database → Create Database
2. Start in **Test Mode**
3. Choose your region

### Enable Storage:
1. Go to Storage → Get Started
2. Start in **Test Mode**
3. Choose same region

---

## 🚀 Step 5: Use Firebase in Your Components

### Load Members from Cloud (PasswordVerificationModal):

```javascript
import { getAllMembers } from '@/firebase';

const loadMembers = async () => {
  const branchId = 'lagos'; // Your branch ID
  const result = await getAllMembers(branchId);
  
  if (result.success) {
    availableMembers.value = result.data;
  }
};
```

### Save Invoice to Cloud:

```javascript
import { saveInvoice } from '@/firebase';

const saveToCloud = async () => {
  await saveInvoice('lagos', {
    number: 123,
    customer: 'John Doe',
    amount: 50000,
    items: [...]
  });
};
```

### Upload Files:

```javascript
import { uploadInvoicePDF } from '@/firebase';

const uploadPDF = async (file) => {
  const result = await uploadInvoicePDF(
    'lagos',      // branchId
    123,          // invoice number
    file,         // PDF file blob
    (progress) => console.log(`${progress}% uploaded`)
  );
  
  if (result.success) {
    console.log('File URL:', result.url);
  }
};
```

---

## 📁 Firebase Files Created

```
src/firebase/
├── config.js      ✅ Firebase initialization
├── auth.js        ✅ Authentication functions
├── database.js    ✅ Firestore database functions
├── storage.js     ✅ File upload functions
└── index.js       ✅ Main export file
```

---

## 📋 Available Functions

### Authentication (auth.js)
- `signInWithGoogle()` - Google login
- `signUpWithEmail(email, password, name)` - Email signup
- `signInWithEmail(email, password)` - Email login
- `signOut()` - Logout
- `resetPassword(email)` - Password reset
- `getCurrentUser()` - Get logged-in user
- `onAuthChange(callback)` - Listen to auth changes

### Database (database.js)
- `saveMember(branchId, memberId, data)` - Save member
- `getMember(branchId, memberId)` - Get member
- `getAllMembers(branchId)` - Get all members
- `updateMember(branchId, memberId, updates)` - Update member
- `deleteMember(branchId, memberId)` - Delete member
- `saveInvoice(branchId, data)` - Save invoice
- `saveReceipt(branchId, data)` - Save receipt
- `getRecentInvoices(branchId, limit)` - Get invoices
- `getRecentReceipts(branchId, limit)` - Get receipts
- `backupLocalStorageToCloud(branchId)` - Backup data
- `restoreFromCloud(branchId)` - Restore data

### Storage (storage.js)
- `uploadInvoicePDF(branchId, number, file, onProgress)` - Upload invoice PDF
- `uploadReceiptPDF(branchId, number, file, onProgress)` - Upload receipt PDF
- `uploadInvoiceJPEG(branchId, number, file, onProgress)` - Upload invoice image
- `uploadReceiptJPEG(branchId, number, file, onProgress)` - Upload receipt image
- `uploadFile(branchId, folder, file, onProgress)` - Upload any file
- `deleteFile(filePath)` - Delete file

---

## ⚠️ Important Notes

1. **Replace Config**: Update `src/firebase/config.js` with your actual Firebase credentials
2. **Security Rules**: Change from Test Mode to Production rules before going live
3. **Free Tier**: Firebase has generous free tier, but monitor usage
4. **Backup**: Keep local backups in addition to cloud storage

---

## 📖 Full Documentation

See `FIREBASE_SETUP_GUIDE.md` for detailed instructions.

---

## ✅ Test Your Setup

```javascript
// Test Firebase connection (run in browser console)
import { db } from '@/firebase/config';
console.log('Firebase connected:', db ? 'Yes' : 'No');
```

---

## 🆘 Getting Help

- Firebase Docs: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Stack Overflow: Search "firebase [your question]"

---

**Happy coding! 🚀**
