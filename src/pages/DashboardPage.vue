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
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" @click="handleMemberLogin">
            <div class="flex flex-col gap-4">
              <!-- Top Row: Icon -->
              <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p>
                <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ totalMembers }}</p>
              </div>

                <div class="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              
              
              <!-- Bottom: Action Text -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">→ Register New Member</p>
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
                <span class="text-2xl font-bold text-green-600 dark:text-green-400">₦</span>
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
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative" @click="handleCreateInvoice">
            <!-- Member Auth Required Badge -->
            <div class="absolute top-3 right-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Login Required</span>
            </div>
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
          <div class="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative" @click="handleCreateReceipt">
            <!-- Member Auth Required Badge -->
            <div class="absolute top-3 right-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Login Required</span>
            </div>
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
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            <button @click="refreshActivities" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div v-if="recentActivities.length === 0" class="text-center py-8 text-slate-500 dark:text-slate-400">
            <svg class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No recent activities</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="activity in displayedActivities" :key="activity.id" class="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div :class="getActivityIconClass(activity.action)">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="activity.action.includes('Login')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="activity.action.includes('Invoice')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path v-else-if="activity.action.includes('Receipt')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ activity.action }}</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ activity.memberName }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ activity.branch }} branch</span>
                </p>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ formatTimeAgo(activity.timestamp) }}</span>
            </div>
          </div>

          <!-- See More Button -->
          <div v-if="recentActivities.length > 3" class="mt-4 text-center">
            <button 
              @click="showAllActivities = !showAllActivities"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors duration-200"
            >
              <span>{{ showAllActivities ? 'Show Less' : `See More (${recentActivities.length - 3} more)` }}</span>
              <svg 
                class="h-4 w-4 transition-transform duration-200" 
                :class="{ 'rotate-180': showAllActivities }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
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
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { API_BASE } from '../api.js';
import { getAllMembers, getMemberActivities } from '@/firebase';

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
    const recentActivities = ref([]);
    const showAllActivities = ref(false);

    const branchTitle = computed(() => {
      const branch = route.query.branch;
      return branch ? `${branch}` : 'ICAN Member';
    });

    const branchName = computed(() => route.query.branch || '');

    // Computed property for displaying limited activities
    const displayedActivities = computed(() => {
      return showAllActivities.value ? recentActivities.value : recentActivities.value.slice(0, 3);
    });

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

        // Get member count from Firebase (updated to use Firebase instead of localStorage)
        console.log('🔥 Loading member count from Firebase...');
        const membersResult = await getAllMembers(branchName.value);
        if (membersResult.success) {
          totalMembers.value = membersResult.data.length;
          console.log(`✅ Loaded ${totalMembers.value} members from Firebase`);
        } else {
          console.warn('⚠️ Failed to load members from Firebase:', membersResult.error);
          totalMembers.value = 0;
        }

        // Get other stats from backend
        const response = await fetch(`${API_BASE}/dashboard/${branchName.value}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch branch statistics');
        }

        const result = await response.json();
        const stats = result.data;

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
      loadActivities();
    });

    const loadActivities = async () => {
      // Load activities from Firebase (updated to use Firebase instead of localStorage)
      console.log('🔥 Loading activities from Firebase...');
      try {
        const result = await getMemberActivities(branchName.value, 10);
        if (result.success) {
          recentActivities.value = result.data;
          console.log(`✅ Loaded ${result.data.length} activities from Firebase`);
        } else {
          console.warn('⚠️ Failed to load activities from Firebase:', result.error);
          recentActivities.value = [];
        }
      } catch (err) {
        console.error('❌ Error loading activities:', err);
        recentActivities.value = [];
      }
    };

    const refreshActivities = () => {
      loadActivities();
    };

    const formatTimeAgo = (timestamp) => {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getActivityIconClass = (action) => {
      const baseClass = 'h-8 w-8 rounded-full flex items-center justify-center';
      if (action.includes('Login')) {
        return `${baseClass} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400`;
      } else if (action.includes('Invoice')) {
        return `${baseClass} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`;
      } else if (action.includes('Receipt')) {
        return `${baseClass} bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`;
      } else {
        return `${baseClass} bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400`;
      }
    };

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
      router.push({ name: 'MemberManagement', query: { branch: branchName.value } });
    };

    const handleMemberLogin = () => {
      router.push({ name: 'MemberLogin', query: { branch: branchName.value } });
    };

    const handleBranchSettings = () => {
      router.push({ name: 'Settings', query: { branch: branchName.value } });
    };

    const handleReports = () => {
      router.push({ name: 'Reports', query: { branch: branchName.value } });
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
      recentActivities,
      showAllActivities,
      displayedActivities,
      handleGoBack,
      handleCreateInvoice,
      handleCreateReceipt,
      handleViewStats,
      handleMemberManagement,
      handleMemberLogin,
      handleBranchSettings,
      handleReports,
      refreshActivities,
      formatTimeAgo,
      getActivityIconClass,
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
