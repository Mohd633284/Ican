<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 relative overflow-auto md:overflow-hidden">
    <!-- Enhanced Background Pattern -->
    <div class="fixed inset-0 opacity-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.35),_transparent_55%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(14,165,233,0.3),_transparent_55%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.25),_transparent_55%)]"></div>
    </div>

    <!-- Floating Elements -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200/35 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute top-40 right-20 w-32 h-32 bg-sky-200/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/25 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-7xl mx-auto">
        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

        
          
          <!-- Left Column: Enhanced Header -->
          <div class="order-1 lg:order-1 relative">
            <!-- Background Card with Gradient -->
            <div class="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-slate-900 dark:to-indigo-950 rounded-2xl p-4 lg:p-8 shadow-xl overflow-hidden">
              <!-- Decorative Elements -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

              <!-- Content -->
              <div class="relative z-10 text-center">
                <div class="flex justify-center mb-4">
                  <img src="/images/ican-web-logo.png" alt="ICAN logo" class="h-10 w-auto drop-shadow-lg" />
                </div>
                <!-- Badge -->
                <div class="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-white text-xs font-semibold uppercase tracking-wider mb-4 shadow-md">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                  Chartered Confidence
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                </div>

                <!-- Main Title -->
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                  Institute of
                  <span class="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Chartered Accountants of Nigeria
                  </span>
                
                </h1>

                <!-- Description -->
                <p class="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed mb-4 font-medium">
                  A comprehensive workspace for managing branch receipts, invoices, and member services with export-ready documentation and complete audit trails.
                </p>
              </div>
            </div>
          </div>

          

          <!-- Right Column: Enhanced Login Form -->
          <div class="order-2 lg:order-2">
            <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-5 lg:p-7 relative overflow-hidden">
              <!-- Form Background Pattern -->
              <div class="absolute inset-0 opacity-5">
                <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full -translate-y-10 translate-x-10"></div>
                <div class="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500 rounded-full translate-y-8 -translate-x-8"></div>
              </div>

              <div class="relative z-10">
                <!-- Header -->
                <div class="text-center mb-6">
                  <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-md">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Your Branch</h2>
                  <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    Sign in with your branch credentials provided by the national secretariat
                  </p>
                </div>

                <!-- Form -->
                <form class="space-y-4" @submit.prevent="handleSubmit">
                  <!-- Branch Selection -->
                  <div class="space-y-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200" for="branch-select">
                      Select Branch
                    </label>
                    <div class="relative">
                      <select
                        id="branch-select"
                        v-model="selectedBranch"
                        class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none shadow-sm"
                        :disabled="isLoadingBranches || branches.length === 0"
                      >
                        <option value="" disabled>Select your branch</option>
                        <option
                          v-for="branch in branches"
                          :key="branch"
                          :value="branch"
                          :class="{ 'text-slate-400': !isBranchAccessible(branch) }"
                        >
                          {{ branch }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <p v-if="isLoadingBranches" class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading branches...
                    </p>
                    <p v-if="selectedBranch && !isBranchAccessible(selectedBranch)" class="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2.5 py-1.5 border border-amber-200 dark:border-amber-800">
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      Branch locked - Contact administrator for access
                    </p>
                  </div>

                  <!-- Password Field -->
                  <div v-if="isPasswordStepVisible" class="space-y-3">
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5" for="branch-email">
                        Email Address
                      </label>
                      <input
                        id="branch-email"
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        placeholder="Enter your email"
                        class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5" for="branch-password">
                        Password
                      </label>
                      <div class="relative">
                        <input
                          id="branch-password"
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          autocomplete="current-password"
                          placeholder="Enter your password"
                          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        />
                        <button 
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Messages -->
                  <div class="min-h-[1rem] flex flex-col justify-center">
                    <p v-if="errorMessage" class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-2.5 py-1.5 border border-red-200 dark:border-red-800">
                      {{ errorMessage }}
                    </p>
                    <p v-if="statusMessage && !errorMessage" class="text-xs text-slate-500 dark:text-slate-400 text-center">
                      {{ statusMessage }}
                    </p>
                  </div>

                  <!-- Action Buttons -->
                  <div v-if="isPasswordStepVisible" class="space-y-2.5">
                    <BaseButton
                      type="submit"
                      :disabled="isSubmitDisabled"
                      class="w-full py-2 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      :class="{ 'opacity-50 cursor-not-allowed': isSubmitDisabled }"
                    >
                      <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
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
                      class="w-full py-2 text-sm rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                      @click="handleSignUp"
                    >
                      Sign Up for {{ selectedBranch }}
                    </BaseButton>
                  </div>
                </form>

                <!-- Help Section -->
                <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div class="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                    <p class="font-medium">Need Assistance?</p>
                    <p>Contact your branch administrator or reach out to the ICAN service desk for support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template><script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
    const showPassword = ref(false);
    const errorMessage = ref('');
    const statusMessage = ref('');
    const isSubmitting = ref(false);
    const isLoadingBranches = ref(false);

    // ====== DEVELOPER CONFIGURATION ======
    // Configure which branches are accessible here
    // Set to true to enable a branch, false to disable
    const branchAccessConfig = {
      'Minna': true,           // Always accessible
      'Abuja': false,          // Disabled - shows popup
      'Lagos': false,          // Disabled - shows popup
      'Kano': false,           // Disabled - shows popup
      'Port Harcourt': false,  // Disabled - shows popup
      'Ibadan': false,         // Disabled - shows popup
      'Enugu': false,          // Disabled - shows popup
      'Kaduna': false,         // Disabled - shows popup
      // Add more branches here as needed
    };
    // ====================================

    const isBranchAccessible = (branchName) => {
      // If branch is not in config, default to disabled
      return branchAccessConfig[branchName] === true;
    };

    watch(selectedBranch, (newBranch) => {
      email.value = '';
      password.value = '';
      errorMessage.value = '';
      statusMessage.value = '';

      // Check if branch is accessible
      if (newBranch && !isBranchAccessible(newBranch)) {
        errorMessage.value = `${newBranch} branch is temporarily unavailable. Please contact your administrator for access.`;
        statusMessage.value = '';
      }
    });

    const isPasswordStepVisible = computed(() => {
      // Only show password step if branch is selected AND accessible
      return selectedBranch.value !== '' && isBranchAccessible(selectedBranch.value);
    });
    
    const isSubmitDisabled = computed(
      () =>
        isSubmitting.value ||
        isLoadingBranches.value ||
        !selectedBranch.value ||
        !isBranchAccessible(selectedBranch.value) ||
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
      
      // Override Ionic's body styles to enable scrolling on all screen sizes
      const body = document.body;
      const html = document.documentElement;
      
      // Store original styles
      const originalBodyPosition = body.style.position;
      const originalBodyOverflow = body.style.overflow;
      const originalHtmlOverflow = html.style.overflow;
      
      // Apply scrollable styles for all screen sizes
      body.style.position = 'relative';
      body.style.overflow = 'auto';
      body.style.overflowX = 'hidden';
      html.style.overflow = 'auto';
      
      // Store in component for cleanup
      body.dataset.originalPosition = originalBodyPosition;
      body.dataset.originalOverflow = originalBodyOverflow;
      html.dataset.originalOverflow = originalHtmlOverflow;
    });

    onUnmounted(() => {
      // Restore original Ionic styles when leaving the page
      const body = document.body;
      const html = document.documentElement;
      
      if (body.dataset.originalPosition !== undefined) {
        body.style.position = body.dataset.originalPosition || '';
        body.style.overflow = body.dataset.originalOverflow || '';
        html.style.overflow = html.dataset.originalOverflow || '';
        
        delete body.dataset.originalPosition;
        delete body.dataset.originalOverflow;
        delete html.dataset.originalOverflow;
      }
    });

    const handleSubmit = async () => {
      if (!selectedBranch.value) {
        errorMessage.value = 'Please select a branch to continue.';
        return;
      }

      // Check if branch is accessible
      if (!isBranchAccessible(selectedBranch.value)) {
        errorMessage.value = `${selectedBranch.value} branch is currently unavailable. Please contact your administrator.`;
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
      showPassword,
      errorMessage,
      statusMessage,
      isPasswordStepVisible,
      isSubmitDisabled,
      isSubmitting,
      isLoadingBranches,
      isBranchAccessible,
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