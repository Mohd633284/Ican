<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4">
    <div class="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-10 space-y-6">
      <header class="space-y-2 text-center">
        <p class="text-sm uppercase tracking-wider text-emerald-500 font-semibold">
          Dashboard Overview
        </p>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {{ branchTitle }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-300">
          Here's your dashboard for the Institute of Chartered Accountants of Nigeria (ICAN).
        </p>
      </header>

      <section class="grid gap-4 md:grid-cols-2">
        <article class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60 p-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">Quick Links</h2>
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Member directory</li>
            <li>• Upcoming events</li>
            <li>• Financial reports</li>
          </ul>
        </article>
        <article class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60 p-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">Branch Tasks</h2>
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Submit quarterly compliance</li>
            <li>• Review member renewals</li>
            <li>• Update branch announcements</li>
          </ul>
        </article>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <BaseButton class="w-full justify-center" @click="handleCreateInvoice">
          Create Invoice
        </BaseButton>
        <BaseButton class="w-full justify-center" variant="secondary" @click="handleCreateReceipt">
          Create Receipt
        </BaseButton>
        <BaseButton class="w-full justify-center" variant="secondary" @click="handleViewStats">
          View Statistics
        </BaseButton>
      </section>

      <footer class="text-center">
        <BaseButton variant="secondary" @click="handleGoBack">
          Change Branch
        </BaseButton>
      </footer>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'DashboardPage',
  components: {
    BaseButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const branchTitle = computed(() => {
      const branch = route.query.branch;
      return branch ? `${branch}` : 'ICAN Member';
    });

    const handleGoBack = () => {
      router.replace({ name: 'Home' });
    };

    const handleCreateInvoice = () => {
      router.push({ name: 'Invoice' });
    };

    const handleCreateReceipt = () => {
      router.push({ name: 'Receipt' });
    };

    const handleViewStats = () => {
      router.push({ name: 'Stats' });
    };

    return {
      branchTitle,
      handleGoBack,
      handleCreateInvoice,
      handleCreateReceipt,
      handleViewStats,
    };
  },
});
</script>
