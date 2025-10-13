# Branch Access Control Guide

## Overview
This system allows you (the developer) to control which branches are accessible to users. By default, only the **Minna** branch is enabled, and all other branches will show a "locked" message.

## How to Enable/Disable Branches

### Step 1: Open the Configuration File
Navigate to: `src/pages/HomePage.vue`

### Step 2: Find the Developer Configuration Section
Look for this section in the code (around line 220):

```javascript
// ====== DEVELOPER CONFIGURATION ======
// Configure which branches are accessible here
// Set to true to enable a branch, false to disable
const branchAccessConfig = {
  'Minna': true,           // Always accessible
  'Abuja': false,          // Disabled - shows popup
  'Lagos': false,          // Disabled - shows popup
  'Kano': false,           // Disabled - shows popup
  'Port Harcourt': false,  // Disabled - shows popup
  'Ibadan': false,         // Disabled - shows popup
  'Enugu': false,          // Disabled - shows popup
  'Kaduna': false,         // Disabled - shows popup
  // Add more branches here as needed
};
// ====================================
```

### Step 3: Enable or Disable Branches
- Set to `true` to **ENABLE** a branch (users can access it)
- Set to `false` to **DISABLE** a branch (users see locked message)

#### Example: Enable Lagos and Abuja
```javascript
const branchAccessConfig = {
  'Minna': true,           // Enabled ✅
  'Abuja': true,           // Enabled ✅
  'Lagos': true,           // Enabled ✅
  'Kano': false,           // Disabled 🔒
  'Port Harcourt': false,  // Disabled 🔒
  'Ibadan': false,         // Disabled 🔒
  'Enugu': false,          // Disabled 🔒
  'Kaduna': false,         // Disabled 🔒
};
```

#### Example: Disable All Except Minna
```javascript
const branchAccessConfig = {
  'Minna': true,           // Only Minna is accessible
  'Abuja': false,
  'Lagos': false,
  'Kano': false,
  'Port Harcourt': false,
  'Ibadan': false,
  'Enugu': false,
  'Kaduna': false,
};
```

### Step 4: Add New Branches
If you add new branches to the system, add them to this configuration:

```javascript
const branchAccessConfig = {
  'Minna': true,
  'Abuja': false,
  'NewBranchName': false,  // Add new branch here
  // ... other branches
};
```

## User Experience

### When a Branch is Enabled (true)
- ✅ User can select the branch
- ✅ Email and password fields appear
- ✅ User can login normally

### When a Branch is Disabled (false)
- 🔒 User can select the branch from dropdown
- 🔒 Branch name shows with a lock icon (🔒)
- 🔒 Error message appears: **"[Branch Name] branch is temporarily unavailable. Please contact your administrator for access."**
- 🔒 Email and password fields do NOT appear
- 🔒 User cannot proceed with login

## Visual Indicators

Locked branches display:
1. **Lock icon** (🔒) next to the branch name in the dropdown
2. **Warning banner** with amber background below the dropdown
3. **Error message** explaining the branch is unavailable

## Testing

After making changes:
1. Save the file
2. Refresh the browser (the app will hot-reload)
3. Try selecting different branches to verify the access control works

## Quick Reference

| Action | Code Change |
|--------|-------------|
| Enable a branch | Set value to `true` |
| Disable a branch | Set value to `false` |
| Add new branch | Add new line: `'BranchName': false,` |

## Default Configuration

By default, **ONLY Minna** is accessible. All other branches require manual activation by changing their value to `true`.

## Security Note

⚠️ This is **client-side access control** for UX purposes. Make sure your backend API also validates branch access for proper security!
