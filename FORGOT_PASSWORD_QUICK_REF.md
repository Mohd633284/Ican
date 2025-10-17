# Forgot Password - Quick Reference

## 🚀 Quick Start (For Users)

### How to Reset Your Password

1. **Access the Feature**
   - From Invoice/Receipt page: Click "Login/Sign Up" → "Forgot your password?"
   - Direct link: Add `?forgot=true` to Member Login URL

2. **3-Step Process**
   - **Step 1:** Select your account from dropdown
   - **Step 2:** Verify your name and role (case-sensitive!)
   - **Step 3:** Enter new password (minimum 6 characters)

3. **Success!**
   - You'll see a confirmation message
   - Login with your new password

---

## 💻 Quick Reference (For Developers)

### Files Modified/Created

```
✅ NEW: src/components/ForgotPasswordModal.vue (360+ lines)
✅ UPDATED: src/pages/MemberLoginPage.vue
✅ UPDATED: src/components/PasswordVerificationModal.vue
✅ DOCS: FORGOT_PASSWORD_GUIDE.md (Complete guide)
✅ DOCS: FORGOT_PASSWORD_QUICK_REF.md (This file)
```

### Component Usage

```vue
<!-- In MemberLoginPage.vue -->
<ForgotPasswordModal 
  :is-open="showForgotPassword"
  @close="showForgotPassword = false"
  @success="handleForgotPasswordSuccess"
/>
```

### Key Functions

```javascript
// Load members from Firebase
const loadMembers = async () => {
  const allMembers = await getAllMembers();
  members.value = allMembers;
};

// Reset password
const resetPassword = async () => {
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
  }
};
```

### Query Parameter Flow

```javascript
// Auto-open modal with ?forgot=true
watch(() => route.query.forgot, (isForgot) => {
  if (isForgot === 'true') {
    showForgotPassword.value = true;
    router.replace({ query: { ...route.query, forgot: undefined } });
  }
}, { immediate: true });
```

---

## 🎨 Color Scheme

- **Primary:** Amber/Orange (`from-amber-500 to-orange-600`)
- **Success:** Emerald (`emerald-500`, `emerald-600`)
- **Error:** Red (`red-500`, `red-600`)
- **Text:** Slate gray (`slate-600`, `slate-900`)

---

## 🔒 Security Features

✅ **Member Selection Required** - Can't guess passwords  
✅ **Case-Sensitive Verification** - Name and role must match exactly  
✅ **Password Confirmation** - Prevent typos  
✅ **Activity Logging** - All resets tracked in Firebase  
✅ **Minimum Password Length** - 6 characters required  

---

## 🧪 Testing Checklist

- [ ] Open modal from PasswordVerificationModal
- [ ] Open modal with `?forgot=true` query parameter
- [ ] Select member from dropdown
- [ ] Verify with correct name/role (case-sensitive)
- [ ] Test wrong name/role (should error)
- [ ] Enter password less than 6 characters (should error)
- [ ] Enter non-matching passwords (should error)
- [ ] Complete successful password reset
- [ ] Verify success message displays
- [ ] Login with new password
- [ ] Check Firebase activity log

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "Select a member account" | Choose from dropdown first |
| "Security info doesn't match" | Check capitalization (case-sensitive!) |
| "Passwords don't match" | Type same password in both fields |
| "Password too short" | Use 6+ characters |
| Modal won't open | Check query parameter format |

---

## 📊 Firebase Structure

```javascript
// Member Document
{
  id: "member_123",
  name: "John Doe",
  role: "Manager",
  password: "password123",
  branch: "ICAN"
}

// Activity Log
{
  memberId: "member_123",
  memberName: "John Doe",
  action: "Password Reset",
  timestamp: "2024-01-15T10:30:00Z"
}
```

---

## 🔮 Future Enhancements

- Email verification option
- Custom security questions
- Password strength meter
- Password history (prevent reuse)
- Account lockout after failed attempts
- Two-factor authentication (2FA)

---

## 📞 Support

**Need Help?**
1. Check [FORGOT_PASSWORD_GUIDE.md](./FORGOT_PASSWORD_GUIDE.md) for detailed documentation
2. Review browser console for errors
3. Check Firebase logs for backend issues
4. Contact development team

---

**Status:** ✅ Complete and Ready to Use  
**Version:** 1.0.0  
**Last Updated:** January 2024
