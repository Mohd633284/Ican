// Quick Firebase Auto-Authentication Setup
// Add this to src/App.vue to automatically sign in users

import { auth } from '@/firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Auto sign-in function
export const initializeFirebaseAuth = async () => {
  return new Promise((resolve, reject) => {
    // Check if already signed in
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        console.log('✅ Firebase: User already authenticated', user.uid);
        resolve(user);
      } else {
        // User is not signed in, sign in anonymously
        try {
          console.log('🔄 Firebase: Signing in anonymously...');
          const result = await signInAnonymously(auth);
          console.log('✅ Firebase: Signed in successfully', result.user.uid);
          resolve(result.user);
        } catch (error) {
          console.error('❌ Firebase: Authentication failed', error);
          reject(error);
        }
      }
    });
  });
};

// Usage in App.vue:
/*
<script setup>
import { onMounted } from 'vue';
import { initializeFirebaseAuth } from './firebase-auth-init';

onMounted(async () => {
  try {
    await initializeFirebaseAuth();
    console.log('🎉 Firebase is ready to use!');
  } catch (error) {
    console.warn('⚠️ Firebase authentication failed, using localStorage fallback');
  }
});
</script>
*/
