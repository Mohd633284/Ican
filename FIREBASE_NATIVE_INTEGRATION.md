# 🔥 Firebase + Capacitor Native Integration

## Complete Guide for Firebase Auth & Firestore with Your Password System

---

## 📱 Overview

This guide shows how to integrate Firebase Authentication and Firestore with your existing "developer-created password" system in the native Android/iOS app.

---

## 🔧 1. Install Firebase Capacitor Plugins

```powershell
# Core Firebase plugins for native apps
npm install @capacitor-firebase/authentication
npm install @capacitor-firebase/firestore
npm install @capacitor-firebase/app

# Keep your existing Firebase Web SDK
# npm install firebase (already installed)
```

---

## ⚙️ 2. Configure Firebase for Android

### Step 1: Download `google-services.json`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (⚙️ icon)
4. Scroll to **Your apps** section
5. Click **Add app** > **Android**
6. Enter package name: `com.goldenprinter.ican`
7. Download `google-services.json`

### Step 2: Place the File

Copy `google-services.json` to:
```
android/app/google-services.json
```

### Step 3: Update `build.gradle`

Edit `android/build.gradle`:

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
        classpath 'com.google.gms:google-services:4.4.0'  // Add this
    }
}
```

Edit `android/app/build.gradle`:

```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'  // Add this at the top

android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.goldenprinter.ican"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
}

dependencies {
    implementation 'com.google.firebase:firebase-auth:22.3.0'
    implementation 'com.google.firebase:firebase-firestore:24.10.0'
}
```

---

## 🍎 3. Configure Firebase for iOS (Mac Only)

### Step 1: Download `GoogleService-Info.plist`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings**
4. Scroll to **Your apps**
5. Click **Add app** > **iOS**
6. Enter bundle ID: `com.goldenprinter.ican`
7. Download `GoogleService-Info.plist`

### Step 2: Place the File

Copy `GoogleService-Info.plist` to:
```
ios/App/App/GoogleService-Info.plist
```

### Step 3: Update Podfile

Edit `ios/App/Podfile`:

```ruby
platform :ios, '13.0'
use_frameworks!

target 'App' do
  capacitor_pods
  # Add pods for desired Firebase products
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'
end
```

Then run:
```bash
cd ios/App
pod install
```

---

## 🔐 4. Authentication Strategy

Your app uses a **developer-created password** system. Here's how to integrate it with Firebase:

### Current Flow:
1. User enters password on login page
2. Password checked against Firestore `developers` collection
3. If valid, user logged in

### Enhanced Flow with Firebase Auth:
1. User enters password
2. Verify password against Firestore `developers` collection
3. If valid, **create anonymous Firebase Auth session**
4. Store user data in `authenticatedMember` localStorage
5. Use Firebase Auth for session management

---

## 🚀 5. Implementation

### Update `firebase/auth.js`:

```javascript
// src/firebase/auth.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Login with developer password
 * This maintains your existing password system while using Firebase Auth
 */
export const loginWithPassword = async (password, branch = null) => {
  try {
    // Step 1: Verify password against Firestore
    const developersRef = collection(db, 'developers');
    let q;
    
    if (branch) {
      // Branch-specific login
      q = query(
        developersRef,
        where('password', '==', password),
        where('branch', '==', branch)
      );
    } else {
      // General login
      q = query(developersRef, where('password', '==', password));
    }
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'Invalid password or branch'
      };
    }
    
    // Step 2: Get member data
    const memberDoc = querySnapshot.docs[0];
    const memberData = {
      id: memberDoc.id,
      ...memberDoc.data()
    };
    
    // Step 3: Create Firebase Auth session (anonymous)
    const userCredential = await signInAnonymously(auth);
    
    // Step 4: Store member info locally
    localStorage.setItem('authenticatedMember', JSON.stringify(memberData));
    
    return {
      success: true,
      member: memberData,
      user: userCredential.user
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      const storedMember = localStorage.getItem('authenticatedMember');
      resolve(user !== null && storedMember !== null);
    });
  });
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get current member data
 */
export const getCurrentMember = () => {
  const storedMember = localStorage.getItem('authenticatedMember');
  return storedMember ? JSON.parse(storedMember) : null;
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('authenticatedMember');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Monitor auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    const member = getCurrentMember();
    callback(user, member);
  });
};

export { auth, db };
```

---

## 🔒 6. Update Login Page

### Update `src/pages/LoginPage.vue`:

```vue
<template>
  <div class="login-container">
    <h1>ICAN Manager Login</h1>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label>Branch</label>
        <select v-model="branch" required>
          <option value="">Select Branch</option>
          <option value="Branch A">Branch A</option>
          <option value="Branch B">Branch B</option>
          <option value="Branch C">Branch C</option>
        </select>
      </div>
      
      <div>
        <label>Password</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Enter your password"
          required 
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithPassword } from '@/firebase/auth';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const router = useRouter();
const branch = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });
    
    const result = await loginWithPassword(password.value, branch.value);
    
    if (result.success) {
      // Success haptic
      await Haptics.notification({ type: 'SUCCESS' });
      
      // Navigate to dashboard
      router.push({ 
        name: 'Dashboard',
        query: { branch: branch.value }
      });
    } else {
      // Error haptic
      await Haptics.notification({ type: 'ERROR' });
      error.value = result.error || 'Login failed';
    }
  } catch (err) {
    await Haptics.notification({ type: 'ERROR' });
    error.value = 'An error occurred during login';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>
```

---

## 🛡️ 7. Route Guard for Authentication

### Create `src/router/guards.js`:

```javascript
import { isAuthenticated } from '@/firebase/auth';

export const authGuard = async (to, from, next) => {
  const publicPages = ['Login', 'ForgotPassword'];
  const authRequired = !publicPages.includes(to.name);
  
  const authenticated = await isAuthenticated();
  
  if (authRequired && !authenticated) {
    // Redirect to login
    next({ name: 'Login' });
  } else if (!authRequired && authenticated) {
    // Already logged in, redirect to dashboard
    next({ name: 'Dashboard' });
  } else {
    next();
  }
};
```

### Update `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  // ... other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Apply auth guard
router.beforeEach(authGuard);

export default router;
```

---

## 💬 8. Firestore for Chat Messages

### Create `src/firebase/chat.js`:

```javascript
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './auth';
import { getCurrentMember } from './auth';

/**
 * Send a chat message
 */
export const sendMessage = async (branchId, message) => {
  try {
    const member = getCurrentMember();
    
    if (!member) {
      throw new Error('Not authenticated');
    }
    
    const messagesRef = collection(db, 'branches', branchId, 'messages');
    
    const docRef = await addDoc(messagesRef, {
      text: message,
      senderId: member.id,
      senderName: member.name || 'Unknown',
      senderBranch: member.branch,
      timestamp: serverTimestamp(),
      read: false
    });
    
    return { success: true, messageId: docRef.id };
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to chat messages in real-time
 */
export const listenToMessages = (branchId, callback, messageLimit = 50) => {
  const messagesRef = collection(db, 'branches', branchId, 'messages');
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(messageLimit)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(messages.reverse()); // Reverse to show oldest first
  });
};
```

### Create Chat Component:

```vue
<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        :class="['message', { 'own': msg.senderId === currentMember?.id }]"
      >
        <div class="sender">{{ msg.senderName }}</div>
        <div class="text">{{ msg.text }}</div>
        <div class="time">{{ formatTime(msg.timestamp) }}</div>
      </div>
    </div>
    
    <form @submit.prevent="sendMsg" class="input-area">
      <input 
        v-model="newMessage" 
        placeholder="Type a message..."
        :disabled="!isOnline"
      />
      <button type="submit" :disabled="!newMessage.trim() || !isOnline">
        Send
      </button>
    </form>
    
    <div v-if="!isOnline" class="offline-notice">
      ⚠️ Offline - Messages will send when connected
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { sendMessage, listenToMessages } from '@/firebase/chat';
import { getCurrentMember } from '@/firebase/auth';
import { useNetwork } from '@/composables/useNetwork';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

const props = defineProps(['branchId']);

const { isOnline } = useNetwork();
const messages = ref([]);
const newMessage = ref('');
const currentMember = getCurrentMember();
const messagesContainer = ref(null);

let unsubscribe = null;

const sendMsg = async () => {
  if (!newMessage.value.trim()) return;
  
  await Haptics.impact({ style: ImpactStyle.Light });
  
  const result = await sendMessage(props.branchId, newMessage.value);
  
  if (result.success) {
    newMessage.value = '';
    await Haptics.notification({ type: 'SUCCESS' });
    scrollToBottom();
  } else {
    await Haptics.notification({ type: 'ERROR' });
    alert('Failed to send message');
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

onMounted(() => {
  // Listen to messages
  unsubscribe = listenToMessages(props.branchId, async (msgs) => {
    const oldCount = messages.value.length;
    messages.value = msgs;
    
    // Notify on new message
    if (msgs.length > oldCount) {
      const latestMsg = msgs[msgs.length - 1];
      
      if (latestMsg.senderId !== currentMember?.id) {
        await LocalNotifications.schedule({
          notifications: [{
            title: `New message from ${latestMsg.senderName}`,
            body: latestMsg.text,
            id: Date.now()
          }]
        });
      }
    }
    
    scrollToBottom();
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
```

---

## 🔔 9. Push Notifications Integration

### Update `main.js`:

```javascript
import { PushNotifications } from '@capacitor/push-notifications';
import { getCurrentMember } from './firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/auth';

// Initialize push notifications
const initPushNotifications = async () => {
  // Request permission
  const result = await PushNotifications.requestPermissions();
  
  if (result.receive === 'granted') {
    await PushNotifications.register();
  }
  
  // Save FCM token to Firestore
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push token:', token.value);
    
    const member = getCurrentMember();
    if (member) {
      try {
        const memberRef = doc(db, 'developers', member.id);
        await updateDoc(memberRef, {
          fcmToken: token.value,
          lastTokenUpdate: new Date()
        });
      } catch (error) {
        console.error('Failed to save FCM token:', error);
      }
    }
  });
  
  // Handle received notifications
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
    // Show in-app notification
  });
  
  // Handle notification taps
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action:', notification);
    // Navigate to relevant page
  });
};

// Call when app starts
initPushNotifications();
```

---

## ✅ 10. Testing Checklist

### Authentication:
- [ ] Login with correct password works
- [ ] Login with wrong password fails
- [ ] Branch-specific login works
- [ ] Logout clears session
- [ ] App remembers login after restart

### Firestore:
- [ ] Invoices save to Firestore
- [ ] Receipts save to Firestore
- [ ] Data loads from Firestore
- [ ] Real-time updates work

### Chat:
- [ ] Messages send successfully
- [ ] Messages appear in real-time
- [ ] Offline messages queue and send when online
- [ ] Notifications trigger for new messages

### Native Features:
- [ ] Camera captures documents
- [ ] Contacts integration works
- [ ] Haptic feedback on buttons
- [ ] Network status detected
- [ ] Local notifications work

---

## 🚀 Quick Start Commands

```powershell
# 1. Install Firebase Capacitor plugins
npm install @capacitor-firebase/authentication @capacitor-firebase/firestore @capacitor-firebase/app

# 2. Build web app
npm run build

# 3. Sync to native
npx cap sync

# 4. Open Android Studio
npx cap open android

# 5. Build APK
# In Android Studio: Build > Build APK
```

---

## 📚 Additional Resources

- [Capacitor Firebase Docs](https://github.com/capawesome-team/capacitor-firebase)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Capacitor Docs](https://capacitorjs.com/docs)

---

**Your authentication system is preserved while gaining native Firebase integration! 🎉**
