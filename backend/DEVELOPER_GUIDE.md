# ICAN Backend - Developer Control Guide

## 🔐 Admin Password
**Default Password:** `ICANAdmin2024!`

⚠️ **IMPORTANT:** Change this password in `/backend/src/adminRoutes.js` line 15:
```javascript
const ADMIN_PASSWORD = 'ICANAdmin2024!'; // CHANGE THIS PASSWORD!
```

---

## 📋 Registration Control Features

### Default Settings
- **Max Users per Branch:** 1 user only
- **Registration Status:** Enabled by default
- **User Limit:** Each branch can only have 1 registered account

### How It Works
1. When a user tries to sign up, the system checks:
   - Is registration enabled for this branch?
   - Has the branch reached its maximum user limit?
   - Is the email already registered?

2. If the limit is reached, users see:
   > "Registration limit reached for [Branch] branch. Maximum 1 user(s) allowed. Contact developer for assistance."

3. To allow a user to create a new account:
   - You (developer) must delete their old account first
   - Then they can register again with a new email/password

---

## 🛠️ Developer API Endpoints

All admin endpoints require the `adminPassword` parameter.

### Base URL
```
http://localhost:4000/admin
```

---

## 📊 USER MANAGEMENT

### 1. List All Users
**GET** `/admin/users?adminPassword=ICANAdmin2024!`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08012345678",
      "membershipNumber": "MEM001",
      "branch": "Minna",
      "createdAt": "2024-10-11 10:30:00"
    }
  ]
}
```

---

### 2. List Users by Branch
**GET** `/admin/users/Minna?adminPassword=ICANAdmin2024!`

**Response:**
```json
{
  "success": true,
  "branch": "Minna",
  "count": 1,
  "users": [...]
}
```

---

### 3. Get Branch User Counts
**GET** `/admin/branch-counts?adminPassword=ICANAdmin2024!`

**Response:**
```json
{
  "success": true,
  "counts": {
    "Minna": 1,
    "Kaduna": 1,
    "Oyo": 0,
    "Kano": 1,
    "Sokoto": 0
  }
}
```

---

### 4. Delete User by Email (Main Use Case)
**DELETE** `/admin/user/email`

**Request Body:**
```json
{
  "adminPassword": "ICANAdmin2024!",
  "email": "olduser@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User account deleted successfully. John Doe can now create a new account.",
  "deletedUser": {
    "id": 1,
    "name": "John Doe",
    "email": "olduser@example.com",
    "branch": "Minna"
  }
}
```

**Use Case:**
> User: "I want to change my email from olduser@example.com to newuser@example.com"
> 
> Developer: 
> 1. DELETE the old account using this endpoint
> 2. Tell user they can now sign up with new email

---

### 5. Delete User by ID
**DELETE** `/admin/user/id/1`

**Request Body:**
```json
{
  "adminPassword": "ICANAdmin2024!"
}
```

**Response:** Same as delete by email

---

## ⚙️ BRANCH SETTINGS MANAGEMENT

### 6. Get All Branch Settings
**GET** `/admin/branch-settings?adminPassword=ICANAdmin2024!`

**Response:**
```json
{
  "success": true,
  "settings": [
    {
      "branch": "Minna",
      "maxUsers": 1,
      "registrationEnabled": true,
      "currentUserCount": 1,
      "spotsAvailable": 0
    },
    {
      "branch": "Kaduna",
      "maxUsers": 1,
      "registrationEnabled": true,
      "currentUserCount": 0,
      "spotsAvailable": 1
    }
  ]
}
```

---

### 7. Get Single Branch Settings
**GET** `/admin/branch-settings/Minna?adminPassword=ICANAdmin2024!`

**Response:**
```json
{
  "success": true,
  "settings": {
    "branch": "Minna",
    "maxUsers": 1,
    "registrationEnabled": true,
    "currentUserCount": 1,
    "spotsAvailable": 0
  }
}
```

---

### 8. Enable/Disable Registration for a Branch
**POST** `/admin/registration-status`

**Request Body - Disable Registration:**
```json
{
  "adminPassword": "ICANAdmin2024!",
  "branch": "Minna",
  "enabled": false
}
```

**Request Body - Enable Registration:**
```json
{
  "adminPassword": "ICANAdmin2024!",
  "branch": "Minna",
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration disabled for Minna branch",
  "result": {
    "branch": "Minna",
    "registrationEnabled": false
  }
}
```

**Use Case:**
> If you want to temporarily block ALL signups for a branch (even if they have spots available), disable registration.

---

### 9. Set Maximum Users for a Branch
**POST** `/admin/max-users`

**Request Body:**
```json
{
  "adminPassword": "ICANAdmin2024!",
  "branch": "Minna",
  "maxUsers": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Maximum users set to 5 for Minna branch",
  "result": {
    "branch": "Minna",
    "maxUsers": 5
  }
}
```

**Use Case:**
> If you want to allow more than 1 user per branch, increase the maxUsers.

---

## 🔄 Common Workflows

### Workflow 1: User Wants to Change Email/Password

**Scenario:** User registered as "old@email.com" but wants to use "new@email.com"

**Steps:**
1. User contacts you (developer)
2. You call: `DELETE /admin/user/email` with their old email
3. Tell user: "Your old account has been removed. You can now sign up with your new email."
4. User goes to app and signs up with new email and new password

---

### Workflow 2: Check Branch Status

**Scenario:** You want to see which branches have users

**Steps:**
1. Call: `GET /admin/branch-counts` to see overview
2. Call: `GET /admin/branch-settings` to see detailed settings
3. Check `spotsAvailable` to see which branches can accept new users

---

### Workflow 3: Temporarily Block Signups

**Scenario:** You want to stop all new signups for maintenance

**Steps:**
1. For each branch, call: `POST /admin/registration-status` with `enabled: false`
2. Users will see: "Registration is currently disabled for this branch. Please contact the developer."
3. When ready, call same endpoint with `enabled: true`

---

### Workflow 4: Increase User Limit for a Branch

**Scenario:** Minna branch needs 3 users instead of 1

**Steps:**
1. Call: `POST /admin/max-users` with `branch: "Minna"` and `maxUsers: 3`
2. Now Minna branch can have up to 3 registered users

---

## 🧪 Testing with PowerShell

### List All Users
```powershell
Invoke-RestMethod -Uri 'http://localhost:4000/admin/users?adminPassword=ICANAdmin2024!' -Method GET | ConvertTo-Json -Depth 10
```

### Delete User by Email
```powershell
$body = @{
    adminPassword = "ICANAdmin2024!"
    email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:4000/admin/user/email' -Method DELETE -Body $body -ContentType 'application/json' | ConvertTo-Json
```

### Get Branch Settings
```powershell
Invoke-RestMethod -Uri 'http://localhost:4000/admin/branch-settings?adminPassword=ICANAdmin2024!' -Method GET | ConvertTo-Json -Depth 10
```

### Disable Registration for a Branch
```powershell
$body = @{
    adminPassword = "ICANAdmin2024!"
    branch = "Minna"
    enabled = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:4000/admin/registration-status' -Method POST -Body $body -ContentType 'application/json' | ConvertTo-Json
```

---

## 🗄️ Database Schema

### branches table
```sql
CREATE TABLE branches (
    name TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    max_users INTEGER DEFAULT 1,              -- Maximum users allowed
    registration_enabled INTEGER DEFAULT 1,    -- 1 = enabled, 0 = disabled
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### users table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    membership_number TEXT,
    password_hash TEXT NOT NULL,
    branch TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch) REFERENCES branches(name)
)
```

---

## 🔒 Security Notes

1. **Change the Admin Password:** The default password is in the code for development. Change it before deployment!

2. **Production Recommendations:**
   - Use environment variables for the admin password
   - Implement proper JWT or session-based authentication
   - Add rate limiting to prevent brute force attacks
   - Use HTTPS in production
   - Add IP whitelisting for admin endpoints

3. **Current Protection:**
   - All admin endpoints require the admin password
   - Unauthorized requests return 403 Forbidden

---

## 📝 Summary

✅ **You now have complete control over:**
- How many users can register per branch (default: 1)
- Enable/disable registration for any branch
- Delete user accounts to allow them to create new ones
- View all users and their details
- Monitor branch registration status

✅ **Users Experience:**
- Can only create 1 account per branch (by default)
- Must contact you to change email/password (you delete old account)
- See clear error messages when limit is reached

✅ **Your Workflow:**
1. User contacts you: "I want to change my email"
2. You delete their old account via API
3. They can now create a new account

**All endpoints are working and ready to use! 🎉**
