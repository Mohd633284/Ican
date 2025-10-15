# Member Authentication System Guide

## Overview
The ICAN application now has a member authentication system that requires authorized members to provide their passwords before accessing Invoice and Receipt creation pages. All member activities are tracked and displayed in the Dashboard.

## Features

### 1. **Three Pre-configured Members**
Each branch has access to 3 authorized members:

| Member Name | Role | Password |
|------------|------|----------|
| Abubakar Ibrahim | Accountant | `ican2024` |
| Fatima Yusuf | Financial Officer | `finance123` |
| Chioma Okafor | Treasurer | `treasury456` |

### 2. **Protected Pages**
- **Invoice Page**: Requires member authentication
- **Receipt Page**: Requires member authentication

### 3. **Activity Tracking**
All member activities are tracked and displayed in real-time:
- Login events
- Invoice creation (with invoice number)
- Receipt creation (with receipt number)
- Member name is displayed prominently
- Timestamp shows how long ago the activity occurred

## How It Works

### Authentication Flow

1. **User clicks "Create Invoice" or "Create Receipt"** from the Dashboard
2. **System checks for authentication**: 
   - If member is already authenticated → Direct access to page
   - If not authenticated → Redirect to Member Login Page

3. **Member Login Process**:
   - Select member from dropdown
   - Enter password
   - System validates credentials
   - On success: Stores member info in localStorage and redirects to target page
   - On failure: Shows error message

4. **Creating Documents**:
   - Once authenticated, member can create invoices/receipts
   - Each creation is automatically logged to activity feed
   - Activity includes: Member name, action, branch, and timestamp

### Recent Activity Section

The Dashboard now displays a "Recent Activity" feed showing:
- **Member Name** (highlighted in emerald color)
- **Action performed** (e.g., "Logged in", "Created Invoice #123")
- **Branch** where activity occurred
- **Time elapsed** (e.g., "Just now", "5 mins ago", "2 hours ago")
- **Color-coded icons** based on activity type:
  - 🟢 Green: Login events
  - 🔵 Blue: Invoice creation
  - 💚 Light Green: Receipt creation

### Automatic Features

1. **Session Persistence**: 
   - Once logged in, member stays authenticated until localStorage is cleared
   - Member info persists across page reloads

2. **Activity Logging**:
   - Automatic tracking on login
   - Automatic tracking when creating invoices
   - Automatic tracking when creating receipts
   - Activities stored in localStorage (last 50 activities retained)

3. **Real-time Updates**:
   - Activity feed refreshes when you return to Dashboard
   - Click refresh icon to manually reload activities

## File Structure

### New Files Created
```
src/pages/MemberLoginPage.vue  - Login interface for member authentication
```

### Modified Files
```
src/router/index.js             - Added member authentication guards
src/pages/DashboardPage.vue     - Added activity tracking display
src/pages/InvoicePage.vue       - Added activity logging
src/pages/ReceiptPage.vue       - Added activity logging
```

## Usage Examples

### For Members

**Scenario 1: Creating an Invoice**
1. Login to your branch dashboard
2. Click "Create Invoice"
3. Select your name from dropdown (e.g., "Abubakar Ibrahim - Accountant")
4. Enter your password: `ican2024`
5. Click "Login"
6. Create and export your invoice
7. Your activity appears in Dashboard: "Created Invoice #001 • Abubakar Ibrahim"

**Scenario 2: Creating a Receipt**
1. From Dashboard, click "Create Receipt"
2. Select "Fatima Yusuf - Financial Officer"
3. Enter password: `finance123`
4. Click "Login"
5. Fill receipt details and export
6. Activity logged: "Created Receipt #001 • Fatima Yusuf"

### For Administrators

**Viewing Activity History**
1. Navigate to Dashboard
2. Scroll to "Recent Activity" section
3. See all member activities with:
   - Member names
   - Actions performed
   - Time stamps
4. Click refresh icon to update feed

## Security Notes

1. **Password Storage**: For demo purposes, passwords are shown on the login page. In production, this should be removed.

2. **localStorage**: Authentication data is stored in browser localStorage
   - Key: `authenticatedMember` (contains member info)
   - Key: `memberActivities` (contains activity log)

3. **Route Guards**: Router automatically redirects unauthenticated users to login page when accessing protected routes

## Customization

### Adding More Members

Edit `src/pages/MemberLoginPage.vue`:

```javascript
const members = ref([
  {
    id: 'member1',
    name: 'Your Name',
    role: 'Your Role',
    password: 'your_password'
  },
  // Add more members...
]);
```

### Changing Password Requirements

Modify the `handleLogin` function in `MemberLoginPage.vue` to add:
- Password length requirements
- Special character requirements
- Password expiration

### Customizing Activity Messages

Edit the `logActivity` calls in:
- `InvoicePage.vue` (line ~598)
- `ReceiptPage.vue` (line ~572)

Example:
```javascript
logActivity(`Created Invoice #${receiptNumber.value} for ₦${grandTotal.value}`);
```

## Troubleshooting

**Problem**: Can't access Invoice/Receipt pages
- **Solution**: Make sure you're logged in through Member Login page

**Problem**: Activities not showing
- **Solution**: Click refresh icon in Recent Activity section

**Problem**: "Invalid password" error
- **Solution**: Check passwords in the table above or on login page

**Problem**: Activity shows wrong member name
- **Solution**: Logout and login again with correct member credentials

## API Integration

The system logs activities locally in localStorage. To integrate with backend:

1. Send activity data to API endpoint:
```javascript
await fetch(`${API_BASE}/activities`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(activityData)
});
```

2. Fetch activities from backend:
```javascript
const response = await fetch(`${API_BASE}/activities/${branchName}`);
const activities = await response.json();
```

## Benefits

✅ **Security**: Only authorized members can create financial documents
✅ **Accountability**: Every action is tracked with member identification
✅ **Transparency**: Activity history visible to all branch users
✅ **Audit Trail**: Complete log of who did what and when
✅ **Multi-user Support**: Three members can work independently
✅ **Easy Management**: Simple password-based authentication

## Future Enhancements

Possible improvements:
- Role-based permissions (e.g., only Treasurer can approve invoices)
- Activity filters (by member, by date, by action type)
- Export activity reports
- Email notifications for important activities
- Password reset functionality
- Multi-factor authentication
- Activity analytics dashboard

---

**Last Updated**: October 15, 2025
**Version**: 1.0.0
