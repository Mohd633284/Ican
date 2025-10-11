<template>
  <div class="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.3),_transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.2),_transparent_50%)]"></div>
    </div>

    <!-- Main Content -->
    <div class="relative flex items-center justify-center min-h-full px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold uppercase tracking-wide mb-4">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Join ICAN
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Sign Up for {{ selectedBranch || 'Branch' }}
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Create your account to access the branch dashboard
          </p>
        </div>

        <!-- Sign Up Form -->
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 p-8">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Full Name -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="full-name">
                Full Name
              </label>
              <input
                id="full-name"
                v-model="formData.name"
                type="text"
                autocomplete="name"
                placeholder="Enter your full name"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                required
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="email">
                Email Address
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                autocomplete="email"
                placeholder="Enter your email address"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                required
              />
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="phone">
                Phone Number
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                autocomplete="tel"
                placeholder="Enter your phone number"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                required
              />
            </div>

            <!-- ICAN Membership Number (Optional) -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="membership-number">
                ICAN Membership Number <span class="text-xs text-slate-500">(Optional)</span>
              </label>
              <input
                id="membership-number"
                v-model="formData.membershipNumber"
                type="text"
                placeholder="Enter your membership number"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              />
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="password">
                Create Password
              </label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                autocomplete="new-password"
                placeholder="Create a strong password"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                required
                minlength="6"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400">Password must be at least 6 characters long</p>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200" for="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                type="password"
                autocomplete="new-password"
                placeholder="Confirm your password"
                class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                required
              />
            </div>

            <!-- Messages -->
            <div class="min-h-[2rem] flex flex-col justify-center">
              <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">
                {{ errorMessage }}
              </p>
              <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 border border-green-200 dark:border-green-800">
                {{ successMessage }}
              </p>
            </div>

            <!-- Submit Button -->
            <div class="space-y-3">
              <BaseButton
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 text-base font-semibold"
                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
                <span v-else>Create Account</span>
              </BaseButton>

              <BaseButton
                variant="outline"
                type="button"
                class="w-full py-3 text-base"
                @click="goBack"
              >
                Back to Home
              </BaseButton>
            </div>
          </form>

          <!-- Terms -->
          <div class="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>By signing up, you agree to ICAN's terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default defineComponent({
  name: 'SignUp',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const selectedBranch = ref(route.query.branch || '');
    const isSubmitting = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const formData = ref({
      name: '',
      email: '',
      phone: '',
      membershipNumber: '',
      password: '',
      confirmPassword: ''
    });

    const isFormValid = computed(() => {
      return formData.value.name.trim() &&
             formData.value.email.trim() &&
             formData.value.phone.trim() &&
             formData.value.password.length >= 6 &&
             formData.value.password === formData.value.confirmPassword;
    });

    const handleSubmit = async () => {
      if (!isFormValid.value) {
        errorMessage.value = 'Please fill in all required fields correctly.';
        return;
      }

      if (!selectedBranch.value) {
        errorMessage.value = 'No branch selected. Please go back and select a branch.';
        return;
      }

      errorMessage.value = '';
      successMessage.value = '';
      isSubmitting.value = true;

      try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData.value,
            branch: selectedBranch.value
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create account.');
        }

        const data = await response.json();
        successMessage.value = 'Account created successfully! Redirecting to login...';

        // Store user info temporarily
        localStorage.setItem('signupSuccess', JSON.stringify({
          branch: selectedBranch.value,
          email: formData.value.email
        }));

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push({
            name: 'Home',
            query: { branch: selectedBranch.value }
          });
        }, 2000);

      } catch (error) {
        console.error(error);
        errorMessage.value = error.message || 'Failed to create account. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };

    const goBack = () => {
      router.push({ name: 'Home' });
    };

    onMounted(() => {
      if (!selectedBranch.value) {
        errorMessage.value = 'No branch selected. Please select a branch first.';
      }
    });

    return {
      selectedBranch,
      formData,
      isSubmitting,
      errorMessage,
      successMessage,
      isFormValid,
      handleSubmit,
      goBack,
    };
  },
});
</script>

<style scoped>
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
</style>