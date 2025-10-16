<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
    <!-- Decorative Background -->
    <div class="fixed inset-0 opacity-5 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(16,185,129,0.25),_transparent_55%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(6,182,212,0.18),_transparent_55%)]"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <header class="mb-10">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ branchLabel }} Member Management
            </div>
            <h1 class="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Manage Branch Members</h1>
            <p class="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              View current members, filter by roles, and review recent activity across the {{ branchLabel }} branch.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshMembers"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            <button
              @click="goToMemberLogin"
              class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
              </svg>
              Open Member Console
            </button>
          </div>
        </div>
      </header>

      <!-- Branch Not Selected -->
      <div v-if="!branchName" class="bg-white/90 dark:bg-slate-800/90 border border-amber-200 dark:border-amber-700 rounded-2xl p-8 text-center shadow-xl">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">No branch selected</h2>
        <p class="text-slate-600 dark:text-slate-400">Return to the dashboard and choose a branch to manage members.</p>
        <button
          @click="goBackToDashboard"
          class="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div v-else>
        <!-- Summary Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard
            title="Total Members"
            :value="members.length"
            icon="users"
            gradient="from-emerald-500 to-teal-500"
          />
          <SummaryCard
            title="Active Roles"
            :value="uniqueRoles.length"
            icon="shield"
            gradient="from-blue-500 to-indigo-500"
          />
          <SummaryCard
            title="Last Activity"
            :value="lastActivityLabel"
            icon="clock"
            gradient="from-purple-500 to-rose-500"
          />
          <SummaryCard
            title="Pending Slots"
            :value="pendingSlots"
            icon="plus"
            gradient="from-amber-500 to-orange-500"
          />
        </section>

        <!-- Filters -->
        <section class="bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl p-6 shadow-xl mb-8">
          <div class="flex flex-col lg:flex-row lg:items-end gap-4">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Search Member</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Search by name or role"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div class="w-full lg:w-48">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Filter by Role</label>
              <select
                v-model="roleFilter"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All roles</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
            <div class="w-full lg:w-56">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sort</label>
              <select
                v-model="sortOption"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">Name (A → Z)</option>
                <option value="role">Role</option>
                <option value="recent">Recent activity</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Members Table -->
        <section class="bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl shadow-xl overflow-hidden">
          <header class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Current Members</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Showing {{ filteredMembers.length }} of {{ members.length }} members</p>
            </div>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-sm text-emerald-700 dark:text-emerald-300">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Synced with Firebase
            </span>
          </header>

          <div v-if="loadingMembers" class="py-16 text-center">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            <p class="mt-4 text-slate-500 dark:text-slate-400">Loading members from Firebase...</p>
          </div>

          <div v-else-if="error" class="py-12 text-center px-6">
            <svg class="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Unable to load members</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ error }}</p>
          </div>

          <div v-else-if="filteredMembers.length === 0" class="py-12 text-center px-6">
            <svg class="mx-auto h-14 w-14 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">No members match your filters</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Try adjusting the filters or searching for another member.</p>
          </div>

          <div v-else class="divide-y divide-slate-200 dark:divide-slate-700">
            <div
              v-for="member in filteredMembers"
              :key="member.id"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ member.name }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5-6l3 3-3 3" />
                      </svg>
                      {{ member.role || 'Unassigned' }}
                    </span>
                    <span class="text-xs uppercase tracking-wide text-slate-400">ID: {{ member.id }}</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center flex-wrap gap-3">
                <button
                  @click="selectMember(member)"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Snapshot
                </button>
                <button
                  @click="manageMember(member)"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-600/30 transition"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                  </svg>
                  Manage Member
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Member Snapshot Drawer -->
        <transition name="slide-up">
          <div v-if="selectedMember" class="fixed inset-x-0 bottom-0 z-40">
            <div class="max-w-5xl mx-auto px-4 pb-8">
              <div class="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 class="text-xl font-semibold text-slate-900 dark:text-white">{{ selectedMember.name }}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ selectedMember.role || 'Role not set' }}</p>
                  </div>
                  <button
                    @click="closeMemberDrawer"
                    class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6">
                  <div class="md:col-span-1 space-y-4">
                    <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-5 border border-emerald-200/60 dark:border-emerald-700/50">
                      <p class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Member ID</p>
                      <p class="mt-2 text-lg font-mono text-slate-900 dark:text-white">{{ selectedMember.id }}</p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-5 border border-slate-200/60 dark:border-slate-700/60">
                      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</p>
                      <p class="mt-2 text-sm text-slate-700 dark:text-slate-200">{{ formatDate(selectedMember.createdAt) }}</p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-5 border border-slate-200/60 dark:border-slate-700/60">
                      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Login</p>
                      <p class="mt-2 text-sm text-slate-700 dark:text-slate-200">{{ formatDate(recentMemberLogin) }}</p>
                    </div>
                  </div>

                  <div class="md:col-span-2">
                    <h4 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h4>
                    <div v-if="loadingActivities" class="py-8 text-center">
                      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading activity timeline...</p>
                    </div>
                    <div v-else-if="memberActivities.length === 0" class="py-8 text-center text-slate-500 dark:text-slate-400">
                      <p>No recent activity recorded for this member.</p>
                    </div>
                    <ul v-else class="space-y-3 max-h-64 overflow-y-auto pr-1">
                      <li
                        v-for="activity in memberActivities"
                        :key="activity.id"
                        class="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <div :class="['h-8 w-8 rounded-full flex items-center justify-center', activityIconClass(activity.action)]">
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="activity.action.includes('created')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            <path v-else-if="activity.action.includes('deleted')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-slate-900 dark:text-white">{{ activity.action }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatRelativeTime(activity.timestamp) }} • {{ activity.branch }} branch</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                  <button
                    @click="manageMember(selectedMember)"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-600/30 transition"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                    </svg>
                    Open in Member Console
                  </button>
                  <button
                    @click="closeMemberDrawer"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAllMembers, getMemberActivities } from '@/firebase';

const iconMap = {
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  plus: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
};

const SummaryCard = defineComponent({
  name: 'SummaryCard',
  props: {
    title: String,
    value: [String, Number],
    icon: String,
    gradient: {
      type: String,
      default: 'from-emerald-500 to-teal-500'
    }
  },
  setup(props) {
    const iconPath = computed(() => iconMap[props.icon] || iconMap.users);
    return { iconPath };
  },
  template: `
    <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200/70 dark:border-slate-700/70 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ title }}</p>
        <div :class="['h-11 w-11 rounded-xl flex items-center justify-center text-white', 'bg-gradient-to-br', gradient]">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
          </svg>
        </div>
      </div>
      <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ value }}</p>
    </div>
  `
});

export default defineComponent({
  name: 'MemberManagementPage',
  components: {
    SummaryCard
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const branchName = computed(() => route.query.branch || '');
    const branchLabel = computed(() => (branchName.value ? `${branchName.value} Branch` : 'ICAN'));

    const loadingMembers = ref(true);
    const loadingActivities = ref(false);
    const error = ref('');

    const members = ref([]);
    const activities = ref([]);

    const searchTerm = ref('');
    const roleFilter = ref('all');
    const sortOption = ref('name');

    const selectedMember = ref(null);

    const uniqueRoles = computed(() => {
      const roles = members.value
        .map((member) => member.role || 'Unassigned')
        .filter((role, index, array) => array.indexOf(role) === index);
      return roles.sort();
    });

    const lastActivityLabel = computed(() => {
      if (activities.value.length === 0) return 'No activity recorded';
      const sorted = [...activities.value].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      return formatRelativeTime(sorted[0].timestamp);
    });

    const pendingSlots = computed(() => Math.max(0, 3 - members.value.length));

    const filteredMembers = computed(() => {
      let list = [...members.value];

      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        list = list.filter((member) => {
          return (
            (member.name && member.name.toLowerCase().includes(term)) ||
            (member.role && member.role.toLowerCase().includes(term)) ||
            (member.id && member.id.toLowerCase().includes(term))
          );
        });
      }

      if (roleFilter.value !== 'all') {
        list = list.filter((member) => (member.role || 'Unassigned') === roleFilter.value);
      }

      if (sortOption.value === 'name') {
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (sortOption.value === 'role') {
        list.sort((a, b) => (a.role || '').localeCompare(b.role || ''));
      } else if (sortOption.value === 'recent') {
        list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      }

      return list;
    });

    const memberActivities = computed(() => {
      if (!selectedMember.value) return [];
      return activities.value
        .filter((activity) => activity.memberName === selectedMember.value.name)
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    });

    const recentMemberLogin = computed(() => {
      const entry = memberActivities.value.find((activity) => activity.action.includes('Logged in'));
      return entry ? entry.timestamp : null;
    });

    const loadMembers = async () => {
      if (!branchName.value) {
        loadingMembers.value = false;
        return;
      }

      loadingMembers.value = true;
      error.value = '';
      try {
        console.log('🔥 Loading members for management view...');
        const result = await getAllMembers(branchName.value);
        if (result.success) {
          members.value = Array.isArray(result.data) ? result.data : [];
          console.log(`✅ Loaded ${members.value.length} members for ${branchName.value}`);
        } else {
          error.value = result.error || 'Unable to load members from Firebase';
          members.value = [];
        }
      } catch (err) {
        console.error('❌ Failed to load members:', err);
        error.value = 'An error occurred while loading members';
        members.value = [];
      } finally {
        loadingMembers.value = false;
      }
    };

    const loadActivities = async () => {
      if (!branchName.value) return;
      loadingActivities.value = true;
      try {
        const result = await getMemberActivities(branchName.value, 25);
        if (result.success) {
          activities.value = Array.isArray(result.data) ? result.data : [];
        } else {
          activities.value = [];
        }
      } catch (err) {
        console.error('❌ Failed to load member activities:', err);
        activities.value = [];
      } finally {
        loadingActivities.value = false;
      }
    };

    const refreshMembers = () => {
      loadMembers();
      loadActivities();
    };

    const selectMember = (member) => {
      selectedMember.value = member;
      if (activities.value.length === 0) {
        loadActivities();
      }
    };

    const closeMemberDrawer = () => {
      selectedMember.value = null;
    };

    const manageMember = (member) => {
      router.push({
        name: 'MemberLogin',
        query: {
          branch: branchName.value,
          memberId: member?.id || '',
          page: 'Dashboard'
        }
      });
    };

    const goToMemberLogin = () => {
      router.push({ name: 'MemberLogin', query: { branch: branchName.value } });
    };

    const goBackToDashboard = () => {
      router.push({ name: 'Dashboard', query: { branch: branchName.value } });
    };

    watch(branchName, () => {
      loadMembers();
      loadActivities();
    }, { immediate: true });

    onMounted(() => {
      if (branchName.value) {
        loadMembers();
        loadActivities();
      }
    });

    return {
      branchName,
      branchLabel,
      loadingMembers,
      loadingActivities,
      error,
      members,
      activities,
      searchTerm,
      roleFilter,
      sortOption,
      uniqueRoles,
      filteredMembers,
      lastActivityLabel,
      pendingSlots,
      selectedMember,
      memberActivities,
      recentMemberLogin,
      refreshMembers,
      selectMember,
      closeMemberDrawer,
      manageMember,
      goToMemberLogin,
      goBackToDashboard,
      formatDate,
      formatRelativeTime,
      activityIconClass
    };
  }
});

function formatDate(value) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleString();
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Unknown';
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  if (Number.isNaN(diffMs)) return 'Unknown';

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function activityIconClass(action = '') {
  if (action.includes('created')) {
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
  }
  if (action.includes('deleted')) {
    return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
  }
  return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(24px);
  opacity: 0;
}
</style>
