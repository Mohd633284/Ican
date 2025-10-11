<template>
  <div
    class="min-h-screen relative flex items-center justify-center px-6 py-16 bg-cover bg-center"
    style="background-image: linear-gradient(rgba(244, 248, 250, 0.85), rgba(244, 248, 250, 0.9)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1650&q=80');"
  >
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,148,136,0.15),_transparent_55%)]"></div>
    <div class="relative w-full max-w-6xl grid gap-10 md:grid-cols-2 lg:grid-cols-[1.08fr,0.92fr] items-center">
      <!-- Left: ICAN identity -->
      <div class="flex flex-col gap-12 rounded-[32px] border border-emerald-100 bg-white/85 dark:bg-slate-900/80 shadow-2xl shadow-emerald-950/5 p-12 backdrop-blur">
        <div class="space-y-7">
          <div class="inline-flex items-center gap-3 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 text-sm font-semibold uppercase tracking-wide">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Chartered Confidence
          </div>
          <h1 class="text-emerald-700 text-4xl md:text-6xl font-black leading-tight drop-shadow-sm">
            Institute of Chartered
            <span class="mt-2 block text-slate-900 dark:text-white">Accountants of Nigeria</span>
          </h1>
          <p class="text-lg text-slate-700 dark:text-slate-200 max-w-xl">
            A single secure workspace to manage branch receipts, invoices, and members. Export-ready documents, audit trails, and offline capability — crafted for ICAN branches nationwide.
          </p>
        </div>

        <div class="grid gap-4 text-sm md:grid-cols-2">
          <div class="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-emerald-50 dark:border-slate-700 p-4">
            <p class="font-semibold text-slate-800 dark:text-white">Seamless Exports</p>
            <p class="text-slate-500 dark:text-slate-300">Instant PDF &amp; JPEG receipts matching official ICAN stationery.</p>
          </div>
          <div class="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-emerald-50 dark:border-slate-700 p-4">
            <p class="font-semibold text-slate-800 dark:text-white">Branch Analytics</p>
            <p class="text-slate-500 dark:text-slate-300">Track inflows, outstanding invoices, and performance at a glance.</p>
          </div>
        </div>
      </div>

      <!-- Right: Access card -->
      <div class="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-10 self-center">
        <div class="text-center mb-8 space-y-2">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Access Your Branch</h2>
          <p class="text-sm text-slate-500">
            Sign in with the branch credentials shared by the national secretariat.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="branch-select">Branch</label>
            <select
              id="branch-select"
              v-model="selectedBranch"
              class="w-full rounded-2xl border border-slate-300/80 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              :disabled="isLoadingBranches || branches.length === 0"
            >
              <option value="" disabled>Select your branch</option>
              <option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
            </select>
            <p v-if="isLoadingBranches" class="text-xs text-slate-500">Loading branches...</p>
          </div>

          <div v-if="isPasswordStepVisible" class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200" for="branch-password">Password</label>
            <input
              id="branch-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Branch access password"
              class="w-full rounded-2xl border border-slate-300/80 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div class="min-h-10 text-center space-y-2">
            <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
            <p v-if="statusMessage" class="text-xs text-slate-500">{{ statusMessage }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <BaseButton type="button" :disabled="isSubmitDisabled" class="w-full" @click="handleSubmit">
              <span v-if="isSubmitting">Authenticating...</span>
              <span v-else>Login</span>
            </BaseButton>
            <BaseButton variant="secondary" type="button" class="w-full" @click="handleSignIn">
              Register a branch
            </BaseButton>
          </div>
        </form>

        <div class="mt-8 text-center text-xs text-slate-400">
          <p>Need help? Contact your branch administrator or the ICAN service desk.</p>
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
    const password = ref('');
    const errorMessage = ref('');
    const statusMessage = ref('');
    const isSubmitting = ref(false);
    const isLoadingBranches = ref(false);

    watch(selectedBranch, () => {
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

      if (!password.value) {
        errorMessage.value = 'Please enter the branch password.';
        return;
      }

      if (!branches.value.includes(selectedBranch.value)) {
        errorMessage.value = 'Selected branch is not recognized. Refresh and try again.';
        return;
      }

      errorMessage.value = '';
      statusMessage.value = 'Verifying credentials...';
      isSubmitting.value = true;

      try {
        const response = await fetch(`${API_BASE}/auth/branch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ branch: selectedBranch.value, password: password.value }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Incorrect password. Please try again.');
          }
          throw new Error('Authentication failed. Please try again later.');
        }

        errorMessage.value = '';
        statusMessage.value = '';
        router.push({
          name: 'Dashboard',
          query: {
            branch: selectedBranch.value,
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

    const handleSignIn = () => {
      router.push({ name: 'Settings' });
    };

    return {
      branches,
      selectedBranch,
      password,
      errorMessage,
      statusMessage,
      isPasswordStepVisible,
      isSubmitDisabled,
      isSubmitting,
      isLoadingBranches,
      handleSubmit,
      handleSignIn,
    };
  },
});
</script>

<style scoped>
</style>