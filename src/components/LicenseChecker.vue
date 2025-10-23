<template>
  <!-- Expired/Activation Screen -->
  <div v-if="showActivationScreen" class="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full">
      <!-- Lock Icon -->
      <div class="mb-6 flex justify-center">
        <div :class="license.isExpired ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'" class="w-24 h-24 rounded-full flex items-center justify-center">
          <svg :class="license.isExpired ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        {{ license.isExpired ? 'License Expired' : 'Activation Required' }}
      </h1>

      <!-- Message -->
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        {{ license.isExpired ? 'Your license has expired. Please enter a new password to reactivate.' : 'Please enter a password to activate the application.' }}
      </p>
      
      <!-- Password Input -->
      <div class="mb-4">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Enter activation password"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          @keyup.enter="redeemPassword"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Redeem Button -->
      <button
        @click="redeemPassword"
        :disabled="isRedeeming"
        class="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg v-if="isRedeeming" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isRedeeming ? 'Activating...' : 'Activate License' }}</span>
      </button>

      <!-- Contact Info -->
       <div class="text-xs text-slate-500 dark:text-slate-400 mt-6">
        <p>Need a password? Contact the developer.</p>
        <p class="font-semibold">mohmmedabdulsalam058@gmail.com</p>
      </div>
    </div>
  </div>

  <!-- Warning Banner (7 days before expiration) -->
  <div v-else-if="showWarningBanner" class="fixed top-0 left-0 right-0 z-[9998] bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 shadow-lg">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="font-semibold">⚠️ License Expiring Soon</p>
          <p class="text-sm opacity-90">
            Your license will expire in {{ license.daysRemaining }} day{{ license.daysRemaining !== 1 ? 's' : '' }} on {{ formatDate(license.expirationDate) }}
          </p>
        </div>
      </div>
      <button
        @click="dismissWarning"
        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
      >
        Dismiss
      </button>
    </div>
  </div>

  <!-- Weekly Countdown Notification (Hidden - shows once per week) -->
  <transition name="slide-up">
    <div v-if="showWeeklyNotification" class="fixed bottom-6 right-6 z-[9997] max-w-md">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-blue-500 p-5">
        <!-- Close Button -->
        <button
          @click="dismissWeeklyNotification"
          class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Icon -->
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
              📅 License Countdown
            </h3>
            
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-2">
              Your license will expire in <strong>{{ license.daysRemaining }} days</strong>.
            </p>

            <!-- Expiration Date -->
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Expires: <span class="font-semibold text-slate-700 dark:text-slate-300">{{ formatDate(license.expirationDate) }}</span>
            </p>

            <!-- Next Reminder -->
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">
              📢 Next reminder in 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

// --- DEVELOPER CONFIGURATION ---
// Add 5 passwords here.
const VALID_PASSWORDS = [
  "ICAN-PASS-2025-Q4A",
  "ICAN-PASS-2025-Q4B",
  "ICAN-PASS-2025-Q4C",
  "ICAN-PASS-2025-Q4D",
  "ICAN-PASS-2025-Q4E",
];
const LICENSE_DURATION_DAYS = 90; // Each password is valid for 90 days.
const WARNING_DAYS = 7; // Show warning banner when 7 days are left.
// -----------------------------

export default {
  name: 'LicenseChecker',
  setup() {
    const license = ref({
      isValid: false,
      isExpired: false,
      showWarning: false,
      daysRemaining: 0,
      expirationDate: null,
    });
    const passwordInput = ref('');
    const error = ref('');
    const isRedeeming = ref(false);
    
    const warningDismissed = ref(false);
    const weeklyNotificationDismissed = ref(false);

    const showActivationScreen = computed(() => {
      return !license.value.isValid || license.value.isExpired;
    });

    const showWarningBanner = computed(() => {
      return license.value.showWarning && !warningDismissed.value;
    });

    const showWeeklyNotification = computed(() => {
      if (showActivationScreen.value || showWarningBanner.value || weeklyNotificationDismissed.value) {
        return false;
      }
      
      const lastShown = localStorage.getItem('licenseNotificationLastShown');
      if (!lastShown) return true; // Show if never shown

      const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      return daysSinceLastShown >= 7;
    });

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    const loadLicenseFromStorage = () => {
      const storedLicense = localStorage.getItem('appLicense');
      if (!storedLicense) {
        license.value.isValid = false;
        return;
      }

      try {
        const parsed = JSON.parse(storedLicense);
        const expiration = new Date(parsed.expirationDate);
        const now = new Date();

        if (expiration < now) {
          license.value = { ...license.value, isValid: false, isExpired: true };
        } else {
          const daysRemaining = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));
          license.value = {
            isValid: true,
            isExpired: false,
            expirationDate: parsed.expirationDate,
            daysRemaining: daysRemaining,
            showWarning: daysRemaining <= WARNING_DAYS,
          };
        }
      } catch (e) {
        console.error("Failed to parse license", e);
        license.value.isValid = false;
      }
    };

    const redeemPassword = () => {
      isRedeeming.value = true;
      error.value = '';

      const usedPasswords = JSON.parse(localStorage.getItem('usedAppPasswords') || '[]');
      
      if (!VALID_PASSWORDS.includes(passwordInput.value)) {
        setTimeout(() => {
          error.value = "Invalid password. Please try again.";
          isRedeeming.value = false;
        }, 500);
        return;
      }

      if (usedPasswords.includes(passwordInput.value)) {
        setTimeout(() => {
          error.value = "This password has already been used.";
          isRedeeming.value = false;
        }, 500);
        return;
      }

      // --- Success ---
      const activationDate = new Date();
      const expirationDate = new Date(activationDate);
      expirationDate.setDate(activationDate.getDate() + LICENSE_DURATION_DAYS);

      const newLicense = {
        activatedDate: activationDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        passwordUsed: passwordInput.value,
      };

      localStorage.setItem('appLicense', JSON.stringify(newLicense));
      usedPasswords.push(passwordInput.value);
      localStorage.setItem('usedAppPasswords', JSON.stringify(usedPasswords));
      
      passwordInput.value = '';
      
      setTimeout(() => {
        loadLicenseFromStorage(); // Reload to update UI
        isRedeeming.value = false;
      }, 500);
    };

    const dismissWarning = () => {
      warningDismissed.value = true;
      sessionStorage.setItem('licenseWarningDismissed', 'true');
    };

    const dismissWeeklyNotification = () => {
      weeklyNotificationDismissed.value = true;
      localStorage.setItem('licenseNotificationLastShown', Date.now().toString());
    };

    onMounted(() => {
      loadLicenseFromStorage();
      
      if (sessionStorage.getItem('licenseWarningDismissed') === 'true') {
        warningDismissed.value = true;
      }

      if (showWeeklyNotification.value) {
        // Wait 2 seconds before showing the weekly notification for better UX
        setTimeout(() => {
          if (showWeeklyNotification.value) { // re-check in case state changed
             // This will make it appear, no need to set a ref to true
          }
        }, 2000);
      }
    });

    return {
      license,
      passwordInput,
      error,
      isRedeeming,
      showActivationScreen,
      showWarningBanner,
      showWeeklyNotification,
      redeemPassword,
      formatDate,
      dismissWarning,
      dismissWeeklyNotification,
    };
  }
};
</script>

<style scoped>
/* Slide up transition for notification */
.slide-up-enter-active {
  animation: slideUp 0.5s ease-out;
}
.slide-up-leave-active {
  animation: slideDown 0.3s ease-in;
}
@keyframes slideUp {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes slideDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100px); opacity: 0; }
}
</style>
