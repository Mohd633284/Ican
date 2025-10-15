<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900 px-4 py-8">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.3),_transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.2),_transparent_50%)]"></div>
    </div>

    <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
      <!-- Logo/Header -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
          <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Member Login</h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm">{{ branch }} Branch - Access Control</p>
      </div>

      <!-- Main Card -->
      <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-bold">Member Management</h2>
              <button 
                @click="handleGoBack"
                class="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
            <p class="text-emerald-100">{{ branchName }} Branch - Manage your team members</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Add New Member Card -->
          <div v-if="members.length < 3" class="mb-6">
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-700">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-emerald-600 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Add New Member</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Fill in the details to create a new account</p>
                  </div>
                </div>

                <form @submit.prevent="handleCreateMember" class="space-y-4">
                  <!-- Full Name -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      v-model="newMember.name"
                      type="text"
                      placeholder="e.g., John Doe"
                      required
                      class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Role/Position *
                    </label>
                    <input
                      v-model="newMember.role"
                      type="text"
                      placeholder="e.g., Accountant"
                      required
                      class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <!-- Password -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <div class="relative">
                      <input
                        v-model="newMember.password"
                        :type="showNewPassword ? 'text' : 'password'"
                        placeholder="Create a strong password"
                        required
                        minlength="6"
                        class="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                      <button 
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum 6 characters</p>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password *
                    </label>
                    <div class="relative">
                      <input
                        v-model="newMember.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Re-enter your password"
                        required
                        minlength="6"
                        class="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        :class="{'border-red-500 dark:border-red-500': passwordMismatch}"
                      />
                      <button 
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                    <p v-if="passwordMismatch" class="text-xs text-red-600 dark:text-red-400 mt-1">
                      ⚠️ Passwords do not match
                    </p>
                    <p v-else class="text-xs text-slate-500 dark:text-slate-400 mt-1">Must match the password above</p>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="creatingMember"
                    class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <svg v-if="creatingMember" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{{ creatingMember ? 'Creating Account...' : 'Create Member Account' }}</span>
                  </button>
                </form>
              </div>
            </div>

            <!-- Member Limit Reached -->
            <div v-else class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-amber-800 dark:text-amber-200 font-medium">Maximum limit reached. Delete a member to add new ones.</p>
              </div>
            </div>
        </div>

        <!-- Back Button -->
        <div class="px-6 pb-4">
          <button 
            @click="handleBack"
            class="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-2 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'MemberLoginPage',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const selectedMember = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const loading = ref(false);
    const error = ref('');
    const creatingMember = ref(false);
    const activeTab = ref('login');

    // New member creation form
    const newMember = ref({
      name: '',
      role: '',
      password: '',
      confirmPassword: ''
    });

    const branch = computed(() => route.query.branch || 'ICAN');
    const targetPage = computed(() => route.query.page || 'Dashboard');

    // Check if passwords match
    const passwordMismatch = computed(() => {
      return newMember.value.password && newMember.value.confirmPassword && 
             newMember.value.password !== newMember.value.confirmPassword;
    });

    // Dynamic members array - loaded from localStorage
    const members = ref([]);

    // Load members from localStorage on component mount
    const loadMembers = () => {
      const storedMembers = localStorage.getItem('members');
      if (storedMembers) {
        members.value = JSON.parse(storedMembers);
      } else {
        // Initialize with empty array if no members exist
        members.value = [];
      }
    };

    // Save members to localStorage
    const saveMembers = () => {
      localStorage.setItem('members', JSON.stringify(members.value));
    };

    // Create new member
    const handleCreateMember = () => {
      if (members.value.length >= 3) {
        error.value = 'Maximum of 3 members allowed';
        return;
      }

      // Check if passwords match
      if (newMember.value.password !== newMember.value.confirmPassword) {
        error.value = 'Passwords do not match';
        return;
      }

      creatingMember.value = true;
      error.value = '';

      // Simulate creation delay
      setTimeout(() => {
        const member = {
          id: `member_${Date.now()}`,
          name: newMember.value.name.trim(),
          role: newMember.value.role.trim(),
          password: newMember.value.password
        };

        members.value.push(member);
        saveMembers();

        // Reset form
        newMember.value = { name: '', role: '', password: '', confirmPassword: '' };
        creatingMember.value = false;

        // Log activity
        logActivity(member.name, 'Member account created', branch.value);
      }, 500);
    };

    // Edit member (for future implementation)
    const editMember = (member) => {
      // For now, just populate the form with existing data
      newMember.value = {
        name: member.name,
        role: member.role,
        password: member.password
      };
      // In a full implementation, you'd want to track which member is being edited
      // and update the handleCreateMember to handle both create and update
    };

    // Delete member
    const deleteMember = (memberId) => {
      const member = members.value.find(m => m.id === memberId);
      if (member) {
        members.value = members.value.filter(m => m.id !== memberId);
        saveMembers();
        
        // Log activity
        logActivity(member.name, 'Member account deleted', branch.value);
      }
    };

    // Confirm delete with better UX
    const confirmDelete = (member) => {
      if (confirm(`Are you sure you want to delete ${member.name}?`)) {
        deleteMember(member.id);
      }
    };

    const handleLogin = () => {
      error.value = '';
      loading.value = true;

      // Simulate authentication delay
      setTimeout(() => {
        const member = members.value.find(m => m.id === selectedMember.value);
        
        if (!member) {
          error.value = 'Please select a member account';
          loading.value = false;
          return;
        }

        if (member.password !== password.value) {
          error.value = `Incorrect password for ${member.name}. Please try again.`;
          loading.value = false;
          password.value = ''; // Clear password field
          return;
        }

        // Store authenticated member info in localStorage
        const authData = {
          id: member.id,
          name: member.name,
          role: member.role,
          branch: branch.value,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('authenticatedMember', JSON.stringify(authData));

        // Log activity
        logActivity(member.name, 'Logged in', branch.value);

        // Redirect to target page
        const page = targetPage.value;
        loading.value = false;

        if (page === 'Invoice') {
          router.push({ name: 'Invoice', query: { branch: branch.value } });
        } else if (page === 'Receipt') {
          router.push({ name: 'Receipt', query: { branch: branch.value } });
        } else {
          router.push({ name: 'Dashboard', query: { branch: branch.value } });
        }
      }, 1000);
    };

    const logActivity = (memberName, action, branch) => {
      const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
      activities.unshift({
        id: Date.now(),
        memberName,
        action,
        branch,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
      });
      
      // Keep only last 50 activities
      if (activities.length > 50) {
        activities.splice(50);
      }
      
      localStorage.setItem('memberActivities', JSON.stringify(activities));
    };

    const handleBack = () => {
      router.push({ name: 'Dashboard', query: { branch: branch.value } });
    };

    // Load members on component mount
    onMounted(() => {
      loadMembers();
    });

    return {
      activeTab,
      selectedMember,
      password,
      showPassword,
      showNewPassword,
      showConfirmPassword,
      loading,
      error,
      creatingMember,
      newMember,
      members,
      branch,
      passwordMismatch,
      handleCreateMember,
      editMember,
      deleteMember,
      confirmDelete,
      handleLogin,
      handleBack
    };
  }
});
</script>

<style scoped>
/* Custom styling for select dropdown */
select option {
  padding: 10px;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.7);
}

/* Firefox scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) rgba(0, 0, 0, 0.1);
}
</style>
