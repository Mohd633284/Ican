# Forgot Password Feature - Complete Guide

## 📋 Overview

The **Forgot Password** feature allows members to securely reset their account password through a 3-step verification process. This system provides password recovery without requiring email verification, using existing member data for security.

---

## 🎯 Features

### ✨ Key Highlights

- **3-Step Verification Process** - Select member → Verify security info → Reset password
- **No Email Required** - Uses name and role verification instead
- **Firebase Integration** - Updates stored in Firestore database
- **Activity Logging** - All password resets are tracked
- **Case-Sensitive Security** - Name and role must match exactly
- **Password Validation** - Minimum 6 characters with confirmation
- **Multiple Access Points** - Available from login pages and password verification modals
- **Auto-Open Support** - Query parameter `?forgot=true` opens modal automatically

### 🔒 Security Features

1. **Member Selection Required** - Prevents password guessing by requiring member selection first
2. **Exact Match Verification** - Name and role must match exactly (case-sensitive)
3. **Activity Tracking** - All password resets logged with timestamp
4. **Visual Feedback** - Clear indicators for success/error states
5. **Password Confirmation** - Must type new password twice to prevent typos

---

## 🚀 How to Use

### For Members (End Users)

#### **Step 1: Access Forgot Password**

You can access the password reset feature from two locations:

**Option A: From Password Verification Modal**
1. Navigate to Invoice or Receipt page
2. Click "Login/Sign Up" when prompted for password
3. Click the "Forgot your password?" button (amber/orange colored)
4. You'll be redirected to the Member Login page with the modal open

**Option B: From Member Login Page**
1. Navigate to Member Login page
2. Add `?forgot=true` to the URL (e.g., `/member-login?branch=ICAN&forgot=true`)
3. The Forgot Password modal will open automatically

#### **Step 2: Select Your Account**

1. Click the dropdown menu labeled "Select Your Account"
2. Find and select your member account from the list
3. Members are displayed in the format: "Name (Role)"
4. Click "Next" to proceed

**Example:**
```
Select Your Account
▼ John Doe (Manager)
  Jane Smith (Cashier)
  Bob Johnson (Supervisor)
```

#### **Step 3: Verify Security Information**

1. Enter your **Full Name** (must match exactly, case-sensitive)
2. Enter your **Role** (must match exactly, case-sensitive)
3. Click "Verify & Continue"

**Important:**
- ✅ Correct: "John Doe" matches "John Doe"
- ❌ Wrong: "john doe" does NOT match "John Doe"
- ✅ Correct: "Manager" matches "Manager"
- ❌ Wrong: "manager" does NOT match "Manager"

#### **Step 4: Reset Your Password**

1. Enter your **New Password** (minimum 6 characters)
2. Enter the same password again in **Confirm New Password**
3. Watch for the green checkmark (✓) or red X (✗) indicator
   - ✅ Green checkmark = Passwords match
   - ❌ Red X = Passwords don't match
4. Click "Reset Password" when both fields match

#### **Step 5: Success!**

- You'll see a success message with your member name
- The modal will close automatically
- You can now login with your new password

---

## 🛠️ For Developers

### File Structure

```
src/
├── components/
│   └── ForgotPasswordModal.vue     # Main password reset modal (360+ lines)
├── pages/
│   ├── MemberLoginPage.vue         # Integration point with handlers
│   ├── PasswordVerificationModal.vue # Contains "Forgot Password" link
│   └── ... (other pages)
└── firebase/
    └── memberFunctions.js          # Firebase functions for password update
```

### Components

#### **ForgotPasswordModal.vue**

**Props:**
- `isOpen` (Boolean) - Controls modal visibility

**Events:**
- `@close` - Emitted when modal is closed (cancel button or ESC)
- `@success` - Emitted when password reset succeeds
  - Payload: `{ memberName: string, memberId: string }`

**Key Functions:**

```javascript
// Load all members from Firebase
const loadMembers = async () => {
  const allMembers = await getAllMembers();
  members.value = allMembers;
};

// Advance to security verification step
const goToStep2 = () => {
  if (!selectedMember.value) {
    error.value = 'Please select a member account';
    return;
  }
  currentStep.value = 2;
  error.value = '';
};

// Verify name and role match exactly
const verifySecurityInfo = () => {
  const member = members.value.find(m => m.id === selectedMember.value);
  
  if (securityInfo.value.name !== member.name || 
      securityInfo.value.role !== member.role) {
    error.value = 'Security information does not match our records';
    return;
  }
  
  currentStep.value = 3;
  error.value = '';
};

// Update password in Firebase
const resetPassword = async () => {
  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  
  const member = members.value.find(m => m.id === selectedMember.value);
  const success = await updateMember({
    ...member,
    password: newPassword.value
  });
  
  if (success) {
    await saveMemberActivity({
      memberId: member.id,
      memberName: member.name,
      action: 'Password Reset',
      timestamp: new Date().toISOString()
    });
    
    emit('success', {
      memberName: member.name,
      memberId: member.id
    });
  }
};
```

#### **MemberLoginPage.vue Integration**

**New Refs:**
```javascript
const showForgotPassword = ref(false);
const forgotPasswordSuccess = ref('');
```

**Handler Functions:**
```javascript
const handleForgotPasswordSuccess = (data) => {
  showForgotPassword.value = false;
  forgotPasswordSuccess.value = `Password successfully reset for ${data.memberName}. You can now login with your new password.`;
  
  // Auto-hide after 8 seconds
  setTimeout(() => {
    forgotPasswordSuccess.value = '';
  }, 8000);
};
```

**Query Parameter Watcher:**
```javascript
watch(() => route.query.forgot, (isForgot) => {
  if (isForgot === 'true') {
    showForgotPassword.value = true;
    // Clean up URL
    router.replace({ query: { ...route.query, forgot: undefined } });
  }
}, { immediate: true });
```

**Template Usage:**
```vue
<ForgotPasswordModal 
  :is-open="showForgotPassword"
  @close="showForgotPassword = false"
  @success="handleForgotPasswordSuccess"
/>
```

#### **PasswordVerificationModal.vue Updates**

**New Function:**
```javascript
const forgotPassword = () => {
  emit('close');
  router.push({ 
    name: 'MemberLogin', 
    query: { 
      branch: route.query.branch || 'ICAN',
      forgot: 'true'
    }
  });
};
```

**New UI Element:**
```vue
<div class="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
  <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Forgot your password?</p>
  <button
    @click="forgotPassword"
    class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
  >
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
    Reset Your Password
  </button>
</div>
```

### Firebase Integration

**Required Functions:**
- `getAllMembers()` - Fetch all members from Firestore
- `updateMember(memberData)` - Update member data including password
- `saveMemberActivity(activityData)` - Log password reset activity

**Database Structure:**
```javascript
// Members Collection
{
  id: "member_123",
  name: "John Doe",
  role: "Manager",
  password: "newPassword123",
  branch: "ICAN",
  createdAt: "2024-01-01T00:00:00Z"
}

// Member Activities Collection
{
  id: "activity_456",
  memberId: "member_123",
  memberName: "John Doe",
  action: "Password Reset",
  timestamp: "2024-01-15T10:30:00Z"
}
```

---

## 🎨 UI/UX Design

### Color Scheme

- **Primary Colors:** Amber/Orange gradient (`from-amber-500 to-orange-600`)
- **Success:** Emerald green (`emerald-500`, `emerald-600`)
- **Error:** Red (`red-500`, `red-600`)
- **Neutral:** Slate grays for text and backgrounds

### Animations

- **Modal Entrance:** `animate-scale-in` - Scales from 95% to 100%
- **Success Message:** Same scale-in animation with backdrop blur
- **Button Hovers:** Smooth color transitions (`transition-all`)

### Responsive Design

- Maximum width: `max-w-2xl` (672px)
- Padding: `p-4` on mobile, `p-6` on desktop
- Scrollable content with custom scrollbar
- Touch-friendly button sizes (minimum 48px)

### Accessibility

- **Keyboard Navigation:** Full support with Tab/Shift+Tab
- **Screen Readers:** Proper ARIA labels on inputs
- **Color Contrast:** WCAG AA compliant
- **Focus States:** Visible focus rings on all interactive elements

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### **Step 1: Access Points**
- [ ] Click "Forgot Password" from PasswordVerificationModal
- [ ] Navigate to MemberLogin with `?forgot=true` query
- [ ] Modal opens automatically with query parameter
- [ ] URL is cleaned up after modal opens

#### **Step 2: Member Selection**
- [ ] Dropdown loads all members correctly
- [ ] Members display as "Name (Role)"
- [ ] Can't proceed without selecting a member
- [ ] Error message shows if trying to advance without selection

#### **Step 3: Security Verification**
- [ ] Exact name match required (case-sensitive)
- [ ] Exact role match required (case-sensitive)
- [ ] Wrong name shows error
- [ ] Wrong role shows error
- [ ] Wrong case shows error
- [ ] Correct info advances to Step 3

#### **Step 4: Password Reset**
- [ ] Password less than 6 characters shows error
- [ ] Non-matching passwords show error
- [ ] Password match indicator shows green checkmark
- [ ] Password mismatch indicator shows red X
- [ ] Valid passwords submit successfully

#### **Step 5: Success Flow**
- [ ] Success message displays member name
- [ ] Success message auto-hides after 8 seconds
- [ ] Modal closes after success
- [ ] Can login with new password
- [ ] Activity is logged in Firebase

#### **Step 6: Cancel/Close**
- [ ] Cancel button on each step works
- [ ] ESC key closes modal
- [ ] Clicking outside modal does NOT close (prevents accidental loss)
- [ ] All form data resets on close

#### **Step 7: Firebase Integration**
- [ ] getAllMembers() fetches correct data
- [ ] updateMember() updates password in Firestore
- [ ] saveMemberActivity() logs reset event
- [ ] Loading states show during API calls
- [ ] Network errors display helpful messages

### Test Cases

#### **Test Case 1: Successful Password Reset**
```
1. Open Forgot Password modal
2. Select "John Doe (Manager)"
3. Enter name: "John Doe"
4. Enter role: "Manager"
5. Click "Verify & Continue"
6. Enter new password: "newpass123"
7. Enter confirm password: "newpass123"
8. Click "Reset Password"
9. Verify success message appears
10. Close modal and login with new password
Expected: Login successful
```

#### **Test Case 2: Wrong Security Info**
```
1. Open Forgot Password modal
2. Select "John Doe (Manager)"
3. Enter name: "john doe" (lowercase)
4. Enter role: "Manager"
5. Click "Verify & Continue"
Expected: Error "Security information does not match our records"
```

#### **Test Case 3: Password Mismatch**
```
1. Complete Steps 1-2 successfully
2. Enter new password: "password123"
3. Enter confirm password: "password456"
4. Observe visual indicator shows red X
5. Click "Reset Password"
Expected: Error "Passwords do not match"
```

#### **Test Case 4: Short Password**
```
1. Complete Steps 1-2 successfully
2. Enter new password: "pass"
3. Enter confirm password: "pass"
4. Click "Reset Password"
Expected: Error "Password must be at least 6 characters"
```

---

## 📊 Activity Logging

All password resets are automatically logged to Firebase:

```javascript
{
  memberId: "member_123",
  memberName: "John Doe",
  action: "Password Reset",
  timestamp: "2024-01-15T10:30:45.123Z"
}
```

### Viewing Logs

1. Navigate to Firebase Console
2. Go to Firestore Database
3. Open `memberActivities` collection
4. Filter by `action: "Password Reset"`
5. Review timestamp and member details

---

## ❓ Troubleshooting

### Common Issues

#### **Issue: "Please select a member account"**
- **Cause:** No member selected in dropdown
- **Solution:** Select a member from the dropdown before clicking "Next"

#### **Issue: "Security information does not match our records"**
- **Cause:** Name or role entered incorrectly (case mismatch)
- **Solution:** 
  - Check capitalization matches exactly
  - Verify spelling is correct
  - No extra spaces before/after

#### **Issue: "Passwords do not match"**
- **Cause:** New password and confirm password fields differ
- **Solution:** Type the exact same password in both fields

#### **Issue: "Password must be at least 6 characters"**
- **Cause:** Password too short
- **Solution:** Use a password with 6 or more characters

#### **Issue: Modal won't open with ?forgot=true**
- **Cause:** Query parameter watcher not triggered
- **Solution:** 
  - Check route query is properly formatted
  - Verify MemberLoginPage is rendered
  - Clear browser cache and reload

#### **Issue: Firebase update fails**
- **Cause:** Network error or permission issue
- **Solution:**
  - Check internet connection
  - Verify Firestore rules allow member updates
  - Check browser console for specific error

### Debug Mode

Enable console logging by uncommenting debug statements:

```javascript
// In ForgotPasswordModal.vue
const resetPassword = async () => {
  console.log('Resetting password for:', selectedMember.value);
  console.log('New password length:', newPassword.value.length);
  
  // ... rest of function
};
```

---

## 🔮 Future Enhancements

### Planned Features

1. **Email Verification Option**
   - Add email field to member accounts
   - Send verification code via email
   - Alternative to security question verification

2. **Custom Security Questions**
   - Allow members to set their own questions
   - Store answers securely (hashed)
   - Multiple question options

3. **Password Strength Meter**
   - Visual indicator of password strength
   - Suggestions for stronger passwords
   - Enforce complexity requirements

4. **Password History**
   - Store last 5 passwords (hashed)
   - Prevent password reuse
   - Better security compliance

5. **Account Lockout**
   - Lock account after 5 failed attempts
   - Admin unlock required
   - Timed auto-unlock (30 minutes)

6. **Two-Factor Authentication (2FA)**
   - SMS or authenticator app codes
   - Backup codes for recovery
   - Enhanced security for sensitive accounts

7. **Password Expiration**
   - Force password change every 90 days
   - Notification before expiration
   - Grace period for renewal

---

## 📝 Change Log

### Version 1.0.0 (Initial Release)

**Added:**
- ForgotPasswordModal component with 3-step process
- Integration with MemberLoginPage
- PasswordVerificationModal "Forgot Password" link
- Query parameter support (?forgot=true)
- Firebase updateMember integration
- Activity logging for password resets
- Success message with auto-hide
- Comprehensive error handling

**Security:**
- Case-sensitive name/role verification
- Password confirmation requirement
- Minimum 6 character password length
- Activity tracking for audit trail

**UI/UX:**
- Amber/orange gradient theme
- Animated modal entrance
- Visual password match indicators
- Responsive design for all screen sizes
- Custom scrollbars with theme colors

---

## 🤝 Support

For issues or questions:

1. **Check this guide** - Most common issues are covered
2. **Review Firebase logs** - Check for backend errors
3. **Browser console** - Look for JavaScript errors
4. **Contact development team** - For persistent issues

---

## 📄 License

This feature is part of the ICAN Invoice Management System. All rights reserved.

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Author:** Development Team
