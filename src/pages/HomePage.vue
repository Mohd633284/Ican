<template>
  <div class="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.3),_transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.2),_transparent_50%)]"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="w-full max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-8 lg:mb-12">
          <div class="inline-flex items-center gap-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold uppercase tracking-wide mb-4">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Chartered Confidence
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            Institute of Chartered
            <span class="block text-emerald-600 dark:text-emerald-400">Accountants of Nigeria</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive workspace for managing branch receipts, invoices, and member services with export-ready documentation and complete audit trails.
          </p>
        </div>

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          <!-- Left Column: Features & Benefits -->
          <div class="order-2 lg:order-1 space-y-8">
            <!-- Feature Cards -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-emerald-100 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-2">Seamless Exports</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">Generate professional PDF and JPEG receipts matching official ICAN stationery standards.</p>
              </div>

              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-emerald-100 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-2">Branch Analytics</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">Comprehensive tracking of financial inflows, outstanding invoices, and performance metrics.</p>
              </div>
            </div>

            <!-- Additional Features -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-emerald-100 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-2">Secure Access</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">Branch-specific authentication with encrypted data storage and audit trails.</p>
              </div>

              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-emerald-100 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-2">Offline Ready</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300">Full functionality available offline with automatic synchronization when online.</p>
              </div>
            </div>

            <!-- Stats Section -->
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold">50+</div>
                  <div class="text-sm opacity-90">Branches</div>
                </div>
                <div>
                  <div class="text-2xl font-bold">10K+</div>
                  <div class="text-sm opacity-90">Transactions</div>
                </div>
                <div>
                  <div class="text-2xl font-bold">99.9%</div>
                  <div class="text-sm opacity-90">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Login Form -->
          <div class="order-1 lg:order-2">
            <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 lg:p-10">
              <div class="text-center mb-8">
                <h2 class="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">Access Your Branch</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sign in with your branch credentials provided by the national secretariat
                </p>
              </div>

              <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Branch Selection -->
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="branch-select">
                    Select Branch
                  </label>
                  <select
                    id="branch-select"
                    v-model="selectedBranch"
                    class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    :disabled="isLoadingBranches || branches.length === 0"
                  >
                    <option value="" disabled>Select your branch</option>
                    <option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
                  </select>
                  <p v-if="isLoadingBranches" class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading branches...
                  </p>
                </div>

                <!-- Password Field -->
                <div v-if="isPasswordStepVisible" class="space-y-3">
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="branch-email">
                    Email Address
                  </label>
                  <input
                    id="branch-email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="Enter your email"
                    class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 mb-3"
                  />
                  
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="branch-password">
                    Password
                  </label>
                  <input
                    id="branch-password"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Enter your password"
                    class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>

                <!-- Messages -->
                <div class="min-h-[2rem] flex flex-col justify-center">
                  <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">
                    {{ errorMessage }}
                  </p>
                  <p v-if="statusMessage && !errorMessage" class="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {{ statusMessage }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div v-if="isPasswordStepVisible" class="space-y-3">
                  <BaseButton
                    type="submit"
                    :disabled="isSubmitDisabled"
                    class="w-full py-3 text-base font-semibold"
                    :class="{ 'opacity-50 cursor-not-allowed': isSubmitDisabled }"
                  >
                    <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                    <span v-else>Login to {{ selectedBranch }}</span>
                  </BaseButton>

                  <BaseButton
                    variant="secondary"
                    type="button"
                    class="w-full py-3 text-base"
                    @click="handleSignUp"
                  >
                    Sign Up for {{ selectedBranch }}
                  </BaseButton>
                </div>
              </form>

              <!-- Help Section -->
              <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div class="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <p class="font-medium">Need Assistance?</p>
                  <p>Contact your branch administrator or reach out to the ICAN service desk for support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 lg:mt-16 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Institute of Chartered Accountants of Nigeria. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default defineComponent({
  name: 'HomePage',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const branches = ref([]);
    const selectedBranch = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const statusMessage = ref('');
    const isSubmitting = ref(false);
    const isLoadingBranches = ref(false);

    watch(selectedBranch, () => {
      email.value = '';
      password.value = '';
      errorMessage.value = '';
      statusMessage.value = '';
    });

    const isPasswordStepVisible = computed(() => selectedBranch.value !== '');
    const isSubmitDisabled = computed(
      () =>
        isSubmitting.value ||
        isLoadingBranches.value ||
        !selectedBranch.value ||
        !email.value ||
        !password.value
    );

    const loadBranches = async () => {
      isLoadingBranches.value = true;
      errorMessage.value = '';
      statusMessage.value = 'Loading branches...';
      try {
        const response = await fetch(`${API_BASE}/branches`);
        if (!response.ok) {
          throw new Error('Failed to load branches');
        }
        const payload = await response.json();
        branches.value = Array.isArray(payload.data) ? payload.data : [];
        statusMessage.value = '';
        if (branches.value.length === 0) {
          statusMessage.value = 'No branches configured. Contact an administrator.';
        }
      } catch (error) {
        console.error(error);
        errorMessage.value = 'Unable to load branch list. Please try again later.';
        statusMessage.value = '';
      } finally {
        isLoadingBranches.value = false;
      }
    };

    onMounted(() => {
      loadBranches();
    });

    const handleSubmit = async () => {
      if (!selectedBranch.value) {
        errorMessage.value = 'Please select a branch to continue.';
        return;
      }

      if (!email.value || !password.value) {
        errorMessage.value = 'Please enter your email and password.';
        return;
      }

      errorMessage.value = '';
      statusMessage.value = 'Verifying credentials...';
      isSubmitting.value = true;

      try {
        const response = await fetch(`${API_BASE}/auth/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            branch: selectedBranch.value
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw new Error('Authentication failed. Please try again later.');
        }

        const data = await response.json();
        
        // Verify user belongs to selected branch
        if (data.branch !== selectedBranch.value) {
          throw new Error(`This account is registered to ${data.branch} branch. Please select the correct branch.`);
        }
        
        errorMessage.value = '';
        statusMessage.value = '';

        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          branch: data.branch,
          userId: data.userId,
          name: data.name,
          email: data.email
        }));

        router.push({
          name: 'Dashboard',
          query: {
            branch: data.branch,
          },
        });
      } catch (error) {
        console.error(error);
        errorMessage.value = error.message || 'Authentication failed.';
        statusMessage.value = '';
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleSignUp = () => {
      router.push({
        name: 'SignUp',
        query: {
          branch: selectedBranch.value || ''
        }
      });
    };

    return {
      branches,
      selectedBranch,
      email,
      password,
      errorMessage,
      statusMessage,
      isPasswordStepVisible,
      isSubmitDisabled,
      isSubmitting,
      isLoadingBranches,
      handleSubmit,
      handleSignUp,
    };
  },
});
</script>

<style scoped>
/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.8);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.6) rgba(0, 0, 0, 0.1);
}
</style>