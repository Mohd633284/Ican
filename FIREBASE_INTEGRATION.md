# ICAN Firebase Integration

## ✅ Completed: Main SmartDesignPro Firebase Integration

The ICAN micro-app now uses the **main SmartDesignPro Firebase** project for all authentication and data storage operations.

### Changes Made

1. **Removed Separate Firebase Instance**
   - Deprecated: `src/views/micro-apps/Ican/src/config/firebase.js`
   - This file had placeholder credentials (`YOUR_ICAN_PROJECT_ID`)
   - Now redirects to main config for backward compatibility

2. **Updated Service Layer**
   - `ican-service.js` now imports from `@/config/firebase`
   - Uses main SmartDesignPro Firebase credentials from `.env`
   - All ICAN collections prefixed with `ican_` to separate data

3. **Enforced Online-Only Access**
   - Internet connection required for all operations
   - No offline localStorage caching
   - SessionStorage used for temporary session data (clears on close)

### Firebase Collections

All ICAN data is stored in the main SmartDesignPro Firestore with these collections:

- `ican_branches` - Branch information (37 Nigerian states)
- `ican_users` - User accounts and authentication
- `ican_activities` - **NEW** Activity logs for monitoring
- `ican_invoices` - Invoice records
- `ican_receipts` - Receipt records
- `ican_counters` - Document ID counters
- `ican_signatures` - Signature images

### Activity Tracking

The system now logs all user activities to `ican_activities` collection:

**Tracked Events:**
- `LOGIN_SUCCESS` - Successful authentication
- `LOGIN_FAILED` - Failed login attempts (with reason)
- `FIRST_LOGIN` - First-time user registration
- `USER_CREATED` - New user account created
- `PASSWORD_RESET` - Password changes
- `INVOICE_CREATED` - Invoice generation/export
- `RECEIPT_CREATED` - Receipt generation/export
- `AUTH_ERROR` - Authentication errors

**Activity Data Structure:**
```javascript
{
  userId: "user_id",
  type: "LOGIN_SUCCESS",
  timestamp: Firestore.serverTimestamp(),
  details: {
    email: "user@example.com",
    branch: "Niger State",
    branchId: "branch_27"
  },
  deviceInfo: {
    userAgent: "...",
    platform: "...",
    online: true
  }
}
```

### How to Monitor Activities

**Firebase Console:**
1. Go to: https://console.firebase.google.com
2. Select your SmartDesignPro project
3. Navigate to Firestore Database
4. Open `ican_activities` collection

**Query Examples:**
```javascript
// Get all activities for a user
const activities = await ICANUserService.getUserActivities(userId, 50);

// Get all recent activities (admin)
const allActivities = await ICANUserService.getAllActivities(100);

// Filter by activity type
const logins = activities.filter(a => a.type === 'LOGIN_SUCCESS');
```

### Environment Variables Required

Make sure your `.env` file has the main Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Online-Only Features

**Connection Monitoring:**
- Detects `navigator.onLine` status
- Shows error when offline: "⚠️ No internet connection"
- Listens for `online`/`offline` events
- Blocks all operations without internet

**Session Management:**
- Uses `sessionStorage` (clears when browser/app closes)
- No localStorage caching (prevents offline access)
- Session expires after 24 hours
- Re-authentication required after session ends

**Error Handling:**
- All service methods throw errors if offline
- User sees clear error messages
- Failed operations logged to Firebase

### Security Benefits

1. **No Offline Access**: App requires internet, preventing unauthorized offline use
2. **Full Activity Audit**: Every action logged with timestamp and user info
3. **Centralized Control**: Single Firebase project for easy monitoring
4. **Session Expiry**: Automatic logout after 24 hours
5. **Real-time Monitoring**: Track users and activities in Firebase Console

### Testing

**Test Online Requirement:**
1. Open ICAN app
2. Turn off internet connection
3. Should see: "⚠️ No internet connection"
4. Login should be blocked

**Test Activity Logging:**
1. Log in to ICAN app
2. Create/export an invoice or receipt
3. Check Firebase Console > `ican_activities`
4. Should see logged activities with timestamps

**Test Session Expiry:**
1. Log in to ICAN app
2. Close browser/app
3. Reopen app
4. Should require re-authentication (session cleared)

### Migration Notes

**For Developers:**
- Replace any imports from `../config/firebase.js` with `@/config/firebase`
- Remove any localStorage caching logic
- Use `sessionStorage` for temporary data only
- Always check `navigator.onLine` before operations

**For Administrators:**
- Monitor `ican_activities` collection regularly
- Set up Firebase security rules for ICAN collections
- Consider Firebase Functions for automated monitoring/alerts
- Review user activities for suspicious patterns

### Support

If you encounter issues:
1. Check `.env` file has correct Firebase credentials
2. Verify internet connection is active
3. Check Firebase Console for error logs
4. Review browser console for detailed error messages

---

**Last Updated**: December 20, 2025
**Status**: ✅ Production Ready
**Firebase Project**: Main SmartDesignPro Firebase
