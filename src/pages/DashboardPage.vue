<template>
  <div class="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 py-10">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.3),_transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.2),_transparent_50%)]"></div>
    </div>

    <!-- Main Content -->
    <div class="relative min-h-full py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold uppercase tracking-wide mb-4">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ branchTitle }} Branch Dashboard
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to ICAN
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Institute of Chartered Accountants of Nigeria - {{ branchTitle }} Branch Management Portal
          </p>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="max-w-7xl mx-auto mb-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Loading {{ branchTitle }} branch data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <svg class="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-800 dark:text-red-200 font-semibold">{{ error }}</p>
        </div>

        <!-- Stats Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Members -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ totalMembers }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Invoices -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Active Invoices</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ activeInvoices }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Monthly Revenue -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">₦{{ monthlyRevenue }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Tasks -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Tasks</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ pendingTasks }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Actions Grid -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Create Invoice -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleCreateInvoice">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Create Invoice</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Generate professional invoices</p>
              </div>
            </div>
          </div>

          <!-- Create Receipt -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleCreateReceipt">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Create Receipt</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Issue payment receipts</p>
              </div>
            </div>
          </div>

          <!-- View Statistics -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleViewStats">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">View Statistics</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Analyze branch performance</p>
              </div>
            </div>
          </div>

          <!-- Member Management -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleMemberManagement">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Member Directory</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Manage branch members</p>
              </div>
            </div>
          </div>

          <!-- Branch Settings -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleBranchSettings">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Branch Settings</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Configure branch preferences</p>
              </div>
            </div>
          </div>

          <!-- Reports & Analytics -->
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleReports">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Reports & Analytics</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">Generate detailed reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6">
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div class="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg class="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">New member registered</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">John Doe joined the {{ branchTitle }} branch</p>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">2 hours ago</span>
            </div>

            <div class="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">Invoice generated</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">Invoice #INV-2024-001 created for ₦150,000</p>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">4 hours ago</span>
            </div>

            <div class="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div class="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">Payment received</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">Receipt #REC-2024-001 issued for ₦75,000</p>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="max-w-7xl mx-auto text-center">
        <BaseButton variant="outline" size="lg" @click="handleGoBack" class="px-8 py-3">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Change Branch
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { API_BASE } from '../api.js';

export default defineComponent({
  name: 'DashboardPage',
  components: {
    BaseButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Branch-specific data
    const totalMembers = ref(0);
    const activeInvoices = ref(0);
    const monthlyRevenue = ref('0');
    const pendingTasks = ref(0);
    const loading = ref(true);
    const error = ref(null);

    const branchTitle = computed(() => {
      const branch = route.query.branch;
      return branch ? `${branch}` : 'ICAN Member';
    });

    const branchName = computed(() => route.query.branch || '');

    // Fetch branch-specific statistics
    const fetchBranchStats = async () => {
      if (!branchName.value) {
        error.value = 'No branch selected';
        loading.value = false;
        return;
      }

      try {
        loading.value = true;
        error.value = null;

    const response = await fetch(`${API_BASE}/dashboard/${branchName.value}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch branch statistics');
        }

        const result = await response.json();
        const stats = result.data;

        // Update dashboard stats
        totalMembers.value = stats.totalMembers;
        activeInvoices.value = stats.activeInvoices;
        monthlyRevenue.value = stats.monthlyRevenue.toLocaleString('en-NG');
        pendingTasks.value = stats.pendingTasks;

      } catch (err) {
        console.error('Error fetching branch statistics:', err);
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchBranchStats();
    });

    const handleGoBack = () => {
      router.replace({ name: 'Home' });
    };

    const handleCreateInvoice = () => {
      router.push({ name: 'Invoice', query: { branch: branchName.value } });
    };

    const handleCreateReceipt = () => {
      router.push({ name: 'Receipt', query: { branch: branchName.value } });
    };

    const handleViewStats = () => {
      router.push({ name: 'Stats', query: { branch: branchName.value } });
    };

    const handleMemberManagement = () => {
      // TODO: Implement member management page
      alert('Member management feature coming soon!');
    };

    const handleBranchSettings = () => {
      router.push({ name: 'Settings', query: { branch: branchName.value } });
    };

    const handleReports = () => {
      // TODO: Implement reports page
      alert('Reports & Analytics feature coming soon!');
    };

    return {
      branchTitle,
      branchName,
      totalMembers,
      activeInvoices,
      monthlyRevenue,
      pendingTasks,
      loading,
      error,
      handleGoBack,
      handleCreateInvoice,
      handleCreateReceipt,
      handleViewStats,
      handleMemberManagement,
      handleBranchSettings,
      handleReports,
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

/* Animation for cards */
.group:hover {
  transform: translateY(-2px);
}

/* Gradient animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
