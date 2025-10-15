# Member Authentication System Guide

## Overview
The Invoice and Receipt pages are now protected and require member authentication. Only registered members can access these pages.

## How It Works

### 1. **Protected Routes**
- **Invoice Page** (`/invoice`) - Requires member authentication
- **Receipt Page** (`/receipt`) - Requires member authentication

Both routes have `meta: { requiresMemberAuth: true }` in the router configuration.

### 2. **Authentication Flow**

#### When a user tries to access Invoice or Receipt:
1. Router checks if `authenticatedMember` exists in localStorage
2. If NOT authenticated:
   - User is redirected to `/member-login` page
   - The target page name is passed in the URL query (e.g., `?page=Invoice`)
   - The branch information is preserved
3. If authenticated:
   - User gains immediate access to the page

#### After Member Login:
1. Member selects their account from the list
2. Enters their password
3. On successful authentication:
   - Member data is stored in localStorage as `authenticatedMember`
   - User is redirected back to the originally requested page (Invoice or Receipt)
   - If no specific page was requested, redirects to Dashboard

### 3. **Visual Indicators**
On the Dashboard, both "Create Invoice" and "Create Receipt" cards now display:
- 🔒 **"Login Required"** badge in amber/gold color
- Lock icon to indicate authentication is needed

### 4. **localStorage Structure**

#### Authenticated Member Data:
```json
{
  "id": "member-id",
  "name": "Member Name",
  "role": "Member Role",
  "branch": "Branch Name",
  "loginTime": "2025-10-15T12:00:00.000Z"
}
```

### 5. **Security Features**

✅ **Route Guards** - Automatic redirection if not authenticated
✅ **Data Validation** - Verifies member data integrity
✅ **Session Management** - Tracks login time
✅ **Activity Logging** - Records member activities
✅ **Auto-Cleanup** - Removes invalid authentication data

### 6. **Member Management**

#### Creating Members:
- Go to Dashboard → Member Login (from top navigation)
- Switch to "Manage Members" tab
- Maximum of 3 members can be created per branch
- Each member has: Name, Role, Password

#### Member Login:
- Select account from dropdown
- Enter password
- Click login
- System redirects to requested page or Dashboard

### 7. **For Developers**

#### Router Configuration (`src/router/index.js`):
```javascript
{
  path: '/invoice',
  name: 'Invoice',
  component: InvoicePage,
  meta: { requiresMemberAuth: true }  // ← Protection enabled
}
```

#### Checking Authentication in Components:
```javascript
const authenticatedMember = localStorage.getItem('authenticatedMember');
if (authenticatedMember) {
  const memberData = JSON.parse(authenticatedMember);
  console.log('Logged in as:', memberData.name);
}
```

#### Adding New Protected Routes:
1. Add `meta: { requiresMemberAuth: true }` to route definition
2. Router guard will automatically protect it
3. Users will be redirected to MemberLogin when accessing

### 8. **User Experience**

#### Scenario 1: Accessing from Dashboard
1. User clicks "Create Invoice" card
2. System checks authentication
3. If not logged in → Redirected to Member Login page
4. After login → Redirected back to Invoice page

#### Scenario 2: Direct URL Access
1. User types `/invoice` in browser
2. System checks authentication
3. If not logged in → Redirected to Member Login page
4. After login → Redirected back to Invoice page

#### Scenario 3: Already Logged In
1. User clicks "Create Invoice" card
2. System checks authentication
3. User is already logged in → Direct access to Invoice page

### 9. **Important Notes**

⚠️ **Session Persistence**: Authentication is stored in localStorage and persists across browser sessions until manually logged out or data is cleared.

⚠️ **Branch Separation**: Members are branch-specific. Each branch has its own set of members.

⚠️ **Maximum Members**: Each branch can have a maximum of 3 members.

⚠️ **Password Visibility**: For development purposes, passwords are visible in the member management interface.

### 10. **Testing the Authentication**

1. **Test Unauthenticated Access:**
   - Clear localStorage: `localStorage.clear()`
   - Try to access `/invoice` directly
   - Should redirect to Member Login page

2. **Test Authentication:**
   - Create a member account
   - Login with credentials
   - Click "Create Invoice"
   - Should access Invoice page directly

3. **Test Invalid Data:**
   - Manually corrupt authenticatedMember data in localStorage
   - Try to access Invoice page
   - Should redirect to Member Login and clean up bad data

### 11. **Troubleshooting**

**Problem:** Can't access Invoice/Receipt after login
- **Solution:** Check localStorage for `authenticatedMember` key
- Ensure member data is valid JSON
- Try logging in again

**Problem:** Stuck in redirect loop
- **Solution:** Clear localStorage and start fresh
- Check browser console for errors

**Problem:** Member authentication not persisting
- **Solution:** Ensure localStorage is enabled in browser
- Check for browser privacy/incognito mode

## Summary

The member authentication system ensures that only authorized members can access and create invoices and receipts. This adds a layer of security and accountability to financial document creation, while maintaining a smooth user experience with automatic redirects and clear visual indicators.
