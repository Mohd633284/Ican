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
        <select
          v-model="selectedMemberId"
          @change="onMemberChange"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
          <option value="">-- Choose a member --</option>
          <option v-for="member in availableMembers" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
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

      <!-- Forgot Password Link -->
      <div class="mt-4 text-center">
        <button 
          @click="forgotPassword"
          class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Forgot your password?
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

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
    const password = ref('');
    const showPassword = ref(false);
    const error = ref('');
    const isVerifying = ref(false);
    const selectedMemberId = ref('');
    const selectedMemberName = ref('');

    // Get all members from localStorage filtered by current branch
    const availableMembers = computed(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const currentBranch = user.branch;
      const members = JSON.parse(localStorage.getItem('members') || '[]');
      return members.filter(m => m.branch === currentBranch);
    });

    // Handle member selection change
    const onMemberChange = () => {
      const member = availableMembers.value.find(m => m.id === selectedMemberId.value);
      if (member) {
        selectedMemberName.value = member.name;
        error.value = '';
      } else {
        selectedMemberName.value = '';
      }
    };

    // Reset form when modal opens/closes
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        password.value = '';
        error.value = '';
        selectedMemberId.value = props.memberId || '';
        selectedMemberName.value = props.memberName || '';
      }
    });

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
        // Get all members from localStorage
        const members = JSON.parse(localStorage.getItem('members') || '[]');
        
        // Find the selected member
        const member = members.find(m => m.id === selectedMemberId.value);
        
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

        // Password is correct - log activity
        const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
        activities.push({
          memberName: selectedMemberName.value,
          action: `Password verified for ${props.targetPage}`,
          timestamp: new Date().toISOString(),
          branch: member.branch,
          id: Date.now()
        });
        localStorage.setItem('memberActivities', JSON.stringify(activities));

        // Emit verified event with member info
        emit('verified', { memberId: selectedMemberId.value, memberName: selectedMemberName.value });
        
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

    const forgotPassword = () => {
      alert('Please contact your branch administrator to reset your password.');
    };

    return {
      password,
      showPassword,
      error,
      isVerifying,
      selectedMemberId,
      selectedMemberName,
      availableMembers,
      onMemberChange,
      verifyPassword,
      cancel,
      forgotPassword
    };
  }
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
</style>
