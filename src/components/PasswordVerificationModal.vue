<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Password Required</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">Verify your identity to continue</p>
        </div>
      </div>

      <!-- Member Info -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Member
        </label>
        <div class="w-full max-w-full overflow-hidden">
          <select
            v-model="selectedMemberId"
            @change="onMemberChange"
            :disabled="isLoadingMembers"
            class="w-full px-2 py-2 sm:px-4 sm:py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-xs sm:text-base truncate"
          >
            <option value="" disabled>{{ isLoadingMembers ? 'Loading...' : '-- Choose member --' }}</option>
            <option v-for="member in availableMembers" :key="member.id" :value="member.id" :title="`${member.name} (${member.role})`">
              {{ truncateMemberName(member.name, member.role) }}
            </option>
          </select>
        </div>
        <p v-if="availableMembers.length === 0 && !isLoadingMembers" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
          No members found. Please create a member account first.
        </p>
      </div>

      <!-- Selected Member Info -->
      <div v-if="selectedMemberName" class="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <p class="text-sm text-slate-700 dark:text-slate-300">
          <span class="font-medium">Selected Member:</span> 
          <span class="font-bold text-emerald-700 dark:text-emerald-400">{{ selectedMemberName }}</span>
        </p>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Enter your password to access <span class="font-semibold">{{ targetPage }}</span>
        </p>
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Password
        </label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            @keyup.enter="verifyPassword"
            class="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
            autofocus
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="cancel"
          class="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="verifyPassword"
          :disabled="!password || !selectedMemberId || isVerifying"
          class="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          <span v-if="!isVerifying">Verify</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="mt-4 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
        <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">
          Don't have an account?
        </p>
        <button 
          @click="signUpAsMember"
          class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto mb-3"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Sign up as a member
        </button>

        <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">
          Forgot your password?
        </p>
        <button 
          @click="forgotPassword"
          class="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Reset password
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllMembers, saveMemberActivity } from '@/firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default {
  name: 'PasswordVerificationModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    memberName: {
      type: String,
      required: false,
      default: ''
    },
    memberId: {
      type: String,
      required: false,
      default: ''
    },
    targetPage: {
      type: String,
      default: 'this page'
    }
  },
  emits: ['verified', 'cancel'],
  setup(props, { emit }) {
    const router = useRouter();
    const password = ref('');
    const showPassword = ref(false);
    const error = ref('');
    const isVerifying = ref(false);
    const selectedMemberId = ref('');
    const selectedMemberName = ref('');
    const availableMembers = ref([]);
    const isLoadingMembers = ref(false);
    // Load members from Firebase ONLY (no localStorage fallback)
    const loadMembers = async () => {
      try {
        isLoadingMembers.value = true;
        error.value = '';

        console.log('🔥 Loading members from Firebase...');
        const branchName = localStorage.getItem('branchName') || 'default';
        const result = await getAllMembers(branchName);
        
        if (result.success) {
          availableMembers.value = result.data;
          
          if (result.data.length > 0) {
            console.log(`✅ Loaded ${result.data.length} members from Firebase`);
          } else {
            console.log('⚠️ No members found in Firebase');
            console.log('💡 Please create a member account first or run migration');
            error.value = 'No members found. Please create a member account first.';
          }
        } else {
          console.error('❌ Failed to load members from Firebase:', result.error);
          error.value = 'Failed to connect to Firebase. Please check your internet connection.';
          availableMembers.value = [];
        }
      } catch (err) {
        console.error('❌ Error loading members from Firebase:', err);
        error.value = 'An error occurred while loading members. Please try again.';
        availableMembers.value = [];
      } finally {
        isLoadingMembers.value = false;
      }
    };

    // Load members when modal opens
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        password.value = '';
        error.value = '';
        selectedMemberId.value = props.memberId || '';
        selectedMemberName.value = props.memberName || '';
        loadMembers(); // Load from Firebase only
      }
    });

    // Also load on mount if already open
    onMounted(() => {
      if (props.isOpen) {
        loadMembers();
      }
    });

    // Handle member selection change
    const onMemberChange = () => {
      const member = availableMembers.value.find(m => m.id == selectedMemberId.value);
      if (member) {
        selectedMemberName.value = member.name;
        error.value = '';
      } else {
        selectedMemberName.value = '';
      }
    };

    const verifyPassword = async () => {
      if (!selectedMemberId.value) {
        error.value = 'Please select a member';
        return;
      }

      if (!password.value) {
        error.value = 'Please enter your password';
        return;
      }

      isVerifying.value = true;
      error.value = '';

      try {
        // Find the selected member from available members
        const member = availableMembers.value.find(m => m.id == selectedMemberId.value);
        
        if (!member) {
          error.value = 'Member not found. Please select a valid member.';
          isVerifying.value = false;
          return;
        }

        // Verify password
        if (member.password !== password.value) {
          error.value = 'Incorrect password. Please try again.';
          password.value = '';
          isVerifying.value = false;
          return;
        }

        // Password is correct - log activity to Firebase
        console.log('✅ Password verified, logging activity...');
        
        const activityData = {
          memberName: selectedMemberName.value,
          memberId: selectedMemberId.value,
          action: `Password verified for ${props.targetPage}`,
          timestamp: new Date().toISOString(),
          branch: member.branch || localStorage.getItem('branchName') || 'N/A',
          page: props.targetPage
        };

        // Save activity to Firebase ONLY
        try {
          const result = await saveMemberActivity(activityData.branch, activityData);
          if (result.success) {
            console.log('✅ Activity logged to Firebase');
          } else {
            console.warn('⚠️ Failed to log activity to Firebase:', result.error);
          }
        } catch (err) {
          console.error('❌ Error saving activity to Firebase:', err);
        }

        // Emit verified event with member info
        emit('verified', { 
          memberId: selectedMemberId.value, 
          memberName: selectedMemberName.value,
          memberRole: member.role
        });
        
        // Reset form
        password.value = '';
        selectedMemberId.value = '';
        selectedMemberName.value = '';
        
      } catch (err) {
        console.error('Password verification error:', err);
        error.value = 'An error occurred. Please try again.';
      } finally {
        isVerifying.value = false;
      }
    };

    const cancel = () => {
      password.value = '';
      selectedMemberId.value = '';
      selectedMemberName.value = '';
      error.value = '';
      emit('cancel');
    };

    const signUpAsMember = () => {
      // Get current branch name from localStorage
      const branchName = localStorage.getItem('branchName') || 'default';
      
      // Cancel the modal first
      cancel();
      
      // Navigate to Member Login page for sign up
      router.push({ 
        name: 'MemberLogin', 
        query: { branch: branchName }
      });
    };

    const forgotPassword = () => {
      // Get current branch name from localStorage
      const branchName = localStorage.getItem('branchName') || 'default';
      
      // Cancel the modal first
      cancel();
      
      // Navigate to Member Login page (which will have forgot password modal)
      router.push({ 
        name: 'MemberLogin', 
        query: { branch: branchName, forgot: 'true' }
      });
    };

    // Truncate member name for mobile display
    const truncateMemberName = (name, role) => {
      const maxLength = window.innerWidth < 640 ? 20 : 35; // Shorter on mobile
      const fullText = `${name} (${role})`;
      
      if (fullText.length <= maxLength) {
        return fullText;
      }
      
      // If name is too long, truncate it and add ellipsis
      const roleLength = role.length + 3; // +3 for " ()"
      const availableNameLength = maxLength - roleLength - 3; // -3 for "..."
      
      if (availableNameLength > 0) {
        return `${name.substring(0, availableNameLength)}... (${role})`;
      } else {
        // If still too long, show just truncated name
        return fullText.substring(0, maxLength - 3) + '...';
      }
    };

    return {
      password,
      showPassword,
      error,
      isVerifying,
      selectedMemberId,
      selectedMemberName,
      availableMembers,
      isLoadingMembers,
      onMemberChange,
      verifyPassword,
      cancel,
      signUpAsMember,
      forgotPassword,
      truncateMemberName,
    };
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fixed {
  animation: fadeIn 0.2s ease-out;
}

/* Improved dropdown styling for all devices */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

/* Mobile-specific dropdown improvements */
@media (max-width: 640px) {
  select {
    font-size: 14px;
    max-width: 100%;
  }
  
  select option {
    font-size: 14px;
    padding: 8px;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

/* Desktop dropdown styling */
@media (min-width: 641px) {
  select option {
    padding: 10px;
  }
}

/* Force proper text display in options */
select option {
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  max-width: 100%;
}

/* Dark mode dropdown arrow */
.dark select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%9CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}
</style>
