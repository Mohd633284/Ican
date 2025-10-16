<!-- FIREBASE INTEGRATION EXAMPLE FOR PasswordVerificationModal.vue -->
<!-- 
  This is an example showing how to integrate Firebase into PasswordVerificationModal.vue
  You can replace the existing script section with this code after setting up Firebase
-->

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { getAllMembers, saveMember } from '@/firebase'; // Import Firebase functions

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
    const availableMembers = ref([]);
    const isLoadingMembers = ref(false);

    // Get branch ID from localStorage or route
    const getBranchId = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.branch || 'default';
    };

    // Load members from Firebase Firestore instead of localStorage
    const loadMembersFromFirebase = async () => {
      try {
        isLoadingMembers.value = true;
        error.value = '';
        
        const branchId = getBranchId();
        const result = await getAllMembers(branchId);
        
        if (result.success) {
          availableMembers.value = result.data;
          
          // Optionally sync with localStorage as backup
          localStorage.setItem('members', JSON.stringify(result.data));
        } else {
          // Fallback to localStorage if Firebase fails
          const localMembers = localStorage.getItem('members');
          if (localMembers) {
            availableMembers.value = JSON.parse(localMembers);
          } else {
            error.value = 'Failed to load members from cloud';
          }
        }
      } catch (err) {
        console.error('Error loading members from Firebase:', err);
        // Fallback to localStorage
        const localMembers = localStorage.getItem('members');
        if (localMembers) {
          availableMembers.value = JSON.parse(localMembers);
        } else {
          error.value = 'Failed to load members';
        }
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
        
        // FIREBASE: Load from cloud
        loadMembersFromFirebase();
      }
    });

    // Also load on mount if already open
    onMounted(() => {
      if (props.isOpen) {
        loadMembersFromFirebase();
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
        // Find the selected member
        const member = availableMembers.value.find(m => m.id == selectedMemberId.value);
        
        if (!member) {
          error.value = 'Member not found. Please select a valid member.';
          isVerifying.value = false;
          return;
        }

        // Verify password against member data
        if (member.password !== password.value) {
          error.value = 'Incorrect password. Please try again.';
          password.value = '';
          isVerifying.value = false;
          return;
        }

        // Password is correct - log activity to Firebase
        const activities = JSON.parse(localStorage.getItem('memberActivities') || '[]');
        activities.push({
          memberName: selectedMemberName.value,
          action: `Password verified for ${props.targetPage}`,
          timestamp: new Date().toISOString(),
          branch: member.branch || 'N/A',
          id: Date.now()
        });
        localStorage.setItem('memberActivities', JSON.stringify(activities));

        // TODO: Also save activity to Firebase if needed
        // await saveActivity(getBranchId(), activityData);

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
      isLoadingMembers,
      onMemberChange,
      verifyPassword,
      cancel,
      forgotPassword,
    };
  },
};
</script>
