<template>
  <div v-if="showExpiredScreen" class="fixed inset-0 z-[9999] bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
      <!-- Lock Icon -->
      <div class="mb-6 flex justify-center">
        <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        License Expired
      </h1>

      <!-- Message -->
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        This application's license has expired on
        <span class="font-semibold text-red-600 dark:text-red-400">
          {{ formatDate(licenseStatus.expirationDate) }}
        </span>
      </p>

      <!-- Days Expired -->
      <div class="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
        <p class="text-sm text-red-800 dark:text-red-300 font-medium">
          Expired {{ Math.abs(licenseStatus.daysRemaining) }} day{{ Math.abs(licenseStatus.daysRemaining) !== 1 ? 's' : '' }} ago
        </p>
      </div>

      <!-- Contact Information -->
      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          To Renew Your License, Contact:
        </h2>
        <div class="space-y-3 text-left">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ licenseStatus.contact?.name || 'Developer' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400">Email</p>
              <a :href="`mailto:${licenseStatus.contact?.email}`" class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                {{ licenseStatus.contact?.email || 'your-email@example.com' }}
              </a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400">Phone</p>
              <a :href="`tel:${licenseStatus.contact?.phone}`" class="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                {{ licenseStatus.contact?.phone || '+234-XXX-XXX-XXXX' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Installation Info -->
      <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>Installed: {{ formatDate(licenseStatus.installDate) }}</p>
        <p>Version: {{ licenseStatus.version || '1.0.0' }}</p>
      </div>

      <!-- Refresh Button -->
      <button
        @click="checkLicense"
        :disabled="checking"
        class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
      >
        <svg v-if="checking" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ checking ? 'Checking...' : 'Check License Status' }}</span>
      </button>
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
            Your license will expire in {{ licenseStatus.daysRemaining }} day{{ licenseStatus.daysRemaining !== 1 ? 's' : '' }} on {{ formatDate(licenseStatus.expirationDate) }}
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
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-blue-500 p-5 animate-bounce-once">
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
            
            <!-- Countdown Display -->
            <div class="mb-3">
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Time remaining until license expiration:
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <div class="bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ countdown.days }}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-400">Days</p>
                </div>
                <span class="text-slate-400">:</span>
                <div class="bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ countdown.hours }}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-400">Hours</p>
                </div>
                <span class="text-slate-400">:</span>
                <div class="bg-pink-50 dark:bg-pink-900/30 px-3 py-2 rounded-lg">
                  <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">{{ countdown.minutes }}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-400">Minutes</p>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-3">
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                {{ progressPercentage }}% of license period remaining
              </p>
            </div>

            <!-- Expiration Date -->
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Expires: <span class="font-semibold text-slate-700 dark:text-slate-300">{{ formatDate(licenseStatus.expirationDate) }}</span>
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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { API_BASE } from '../api.js';

export default {
  name: 'LicenseChecker',
  setup() {
    const licenseStatus = ref({
      isValid: true,
      isExpired: false,
      showWarning: false,
      daysRemaining: 90,
      expirationDate: null,
      installDate: null,
      contact: {}
    });
    const checking = ref(false);
    const warningDismissed = ref(false);
    const showWeeklyNotification = ref(false);
    const countdown = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    let countdownInterval = null;

    const showExpiredScreen = computed(() => {
      return licenseStatus.value.isExpired || !licenseStatus.value.isValid;
    });

    const showWarningBanner = computed(() => {
      return !showExpiredScreen.value && 
             licenseStatus.value.showWarning && 
             !warningDismissed.value;
    });

    const progressPercentage = computed(() => {
      if (!licenseStatus.value.daysRemaining || !licenseStatus.value.totalDays) {
        return 0;
      }
      const percentage = (licenseStatus.value.daysRemaining / licenseStatus.value.totalDays) * 100;
      return Math.max(0, Math.min(100, Math.round(percentage)));
    });

    const updateCountdown = () => {
      if (!licenseStatus.value.expirationDate) return;
      
      const now = new Date().getTime();
      const expiration = new Date(licenseStatus.value.expirationDate).getTime();
      const distance = expiration - now;

      if (distance < 0) {
        countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return;
      }

      countdown.value = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    };

    const shouldShowWeeklyNotification = () => {
      // Don't show if license is expired or in warning period
      if (showExpiredScreen.value || showWarningBanner.value) {
        return false;
      }

      // Check last shown timestamp from localStorage
      const lastShown = localStorage.getItem('licenseNotificationLastShown');
      
      if (!lastShown) {
        return true; // First time, show it
      }

      const lastShownDate = new Date(parseInt(lastShown));
      const now = new Date();
      const daysSinceLastShown = Math.floor((now - lastShownDate) / (1000 * 60 * 60 * 24));

      // Show if it's been 7 or more days
      return daysSinceLastShown >= 7;
    };

    const checkAndShowWeeklyNotification = () => {
      if (shouldShowWeeklyNotification()) {
        // Wait 2 seconds after page load for better UX
        setTimeout(() => {
          showWeeklyNotification.value = true;
          // Update last shown timestamp
          localStorage.setItem('licenseNotificationLastShown', Date.now().toString());
        }, 2000);
      }
    };

    const dismissWeeklyNotification = () => {
      showWeeklyNotification.value = false;
    };

    const checkLicense = async () => {
      checking.value = true;
      try {
        const response = await fetch(`${API_BASE}/license/status`);
        const result = await response.json();
        
        if (result.data) {
          licenseStatus.value = result.data;
          updateCountdown();
          checkAndShowWeeklyNotification();
        }
      } catch (error) {
        console.error('Failed to check license:', error);
        // If we can't check license, assume it's expired for security
        licenseStatus.value.isExpired = true;
        licenseStatus.value.isValid = false;
      } finally {
        checking.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const dismissWarning = () => {
      warningDismissed.value = true;
      // Store dismissal in session storage (resets on app restart)
      sessionStorage.setItem('licenseWarningDismissed', 'true');
    };

    onMounted(() => {
      // Check if warning was previously dismissed in this session
      const dismissed = sessionStorage.getItem('licenseWarningDismissed');
      if (dismissed === 'true') {
        warningDismissed.value = true;
      }

      // Check license on mount
      checkLicense();

      // Start countdown timer (updates every minute for performance)
      countdownInterval = setInterval(updateCountdown, 60000);

      // Recheck license every hour
      setInterval(checkLicense, 60 * 60 * 1000);
    });

    onBeforeUnmount(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    return {
      licenseStatus,
      checking,
      showExpiredScreen,
      showWarningBanner,
      showWeeklyNotification,
      countdown,
      progressPercentage,
      checkLicense,
      formatDate,
      dismissWarning,
      dismissWeeklyNotification
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
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100px);
    opacity: 0;
  }
}

/* Bounce once animation */
@keyframes bounceOnce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-5px);
  }
}

.animate-bounce-once {
  animation: bounceOnce 1s ease-in-out;
}
</style>

