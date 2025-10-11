# ADMIN CONTROL TOOL - QUICK START GUIDE

## 🚀 How to Use the Safe Admin Tool

### Starting the Tool

```powershell
cd D:\GOLDEN-PRINTER\Programing-practical\Ican\backend
node admin-tool.js
```

---

## 📋 Features

### 1. **View All Users**
- Shows complete list of all registered users
- Displays: ID, Email, Branch, Name
- **Use this to see who's registered before deleting anyone**

### 2. **View Users by Branch**
- Filter users by specific branch
- Helps you manage branch-specific accounts

### 3. **View Branch Statistics**
- See how many users per branch
- Check available slots
- Monitor which branches are full or over limit

### 4. **Delete User Account (SAFE MODE)** ⭐ MAIN FEATURE
- **Two deletion methods:**
  - **By ID** (Safer - exact numeric match)
  - **By Email** (Search by email address)

- **Safety Features:**
  - Shows you EXACTLY who you're about to delete
  - Requires typing "DELETE" to confirm (case-sensitive)
  - Cancel anytime before confirmation
  - Shows full user details before deletion

### 5. **Change Branch User Limit**
- Increase/decrease max users per branch
- Can set limit for all branches at once
- Default is 1 user per branch

### 6. **Enable/Disable Branch Registration**
- Temporarily stop registrations for a branch
- Useful for maintenance or special events

### 7. **View Branch Settings**
- Check current configuration for each branch
- See max users and registration status

---

## 🛡️ Safe Deletion Process

### Example: User wants to change email

**Step 1:** User contacts you
- "I want to change my email from old@example.com to new@example.com"

**Step 2:** Run admin tool
```powershell
node admin-tool.js
```

**Step 3:** Choose option 4 (Delete User Account)

**Step 4:** Tool shows all users:
```
┌──────┬────────────────────────────────────────┬───────────┬──────────────────────┐
│  ID  │ Email                                  │  Branch   │ Name                 │
├──────┼────────────────────────────────────────┼───────────┼──────────────────────┤
│ 1    │ old@example.com                        │ Kaduna    │ John Doe             │
│ 2    │ another@example.com                    │ Minna     │ Jane Smith           │
└──────┴────────────────────────────────────────┴───────────┴──────────────────────┘
```

**Step 5:** Choose deletion method (1 or 2)
- Option 1: Delete by ID (type `1`)
- Option 2: Delete by Email (type `2`)

**Step 6:** Enter ID or Email
- If using ID: `Enter User ID to delete: 1`
- If using Email: `Enter Email to delete: old@example.com`

**Step 7:** Confirmation screen shows:
```
⚠ CONFIRMATION REQUIRED
─────────────────────────────────────────────────────────────────

You are about to delete:
  ID:     1
  Name:   John Doe
  Email:  old@example.com
  Branch: Kaduna
  Phone:  +2348012345678

Type "DELETE" to confirm (case-sensitive): _
```

**Step 8:** Type exactly: `DELETE` (all caps)
- If you type anything else, deletion is cancelled
- Account remains safe

**Step 9:** Success!
```
✓ SUCCESS! User account deleted:
  John Doe (old@example.com) from Kaduna branch

  This user can now create a new account with a different email.
```

**Step 10:** Tell user they can now sign up with new email
- User goes to app
- Signs up with new@example.com
- Uses same or different password

---

## 🎯 Best Practices

### Before Deleting ANY Account:

1. **Always verify** - Use option 1 or 2 to see current users first
2. **Double-check** - Make sure you have the correct email/ID
3. **Communicate** - Confirm with the user before deleting
4. **Document** - Keep a log of who requested account changes

### User Limit Management:

- **Default:** 1 user per branch (enforced by system)
- **To allow more:** Use option 5 to increase limit
- **To restrict:** Use option 6 to disable registration

---

## ⚠️ Important Notes

### What happens when you delete a user?

✅ **Deleted:**
- User account is removed
- Email becomes available again
- User data is permanently deleted

✅ **NOT Deleted:**
- Invoices created by that user (preserved for records)
- Receipts issued (preserved for records)
- Branch settings

### Can user sign up again?

✅ **YES!** After deletion:
- Same email can be used to create new account
- User can use same or different branch
- User can set new password

---

## 🔒 Security

- Tool runs locally on your machine
- No internet connection needed
- Direct database access (file-based)
- No password required (since you have physical access to server)

---

## 📞 Common Scenarios

### Scenario 1: User forgot password
**Solution:** Delete account → User creates new account with new password

### Scenario 2: User wants different email
**Solution:** Delete old account → User signs up with new email

### Scenario 3: User signed up to wrong branch
**Solution:** Delete account → User signs up to correct branch

### Scenario 4: Branch is full
**Solution:** 
- Option A: Delete unused accounts
- Option B: Increase branch limit (option 5)

### Scenario 5: Prevent new signups temporarily
**Solution:** Disable registration for that branch (option 6)

---

## 🆘 Troubleshooting

### "User ID not found"
- Check the user list (option 1) for correct ID
- User might have been already deleted

### "Email not found"
- Check spelling and case
- User might be in different branch

### Tool won't start
```powershell
# Make sure you're in backend folder
cd D:\GOLDEN-PRINTER\Programing-practical\Ican\backend

# Check if database file exists
ls data/app.db
```

---

## 💡 Tips

1. **Use ID deletion** when possible - it's more precise
2. **Always read confirmation screen** before typing DELETE
3. **Keep backup** of database file (data/app.db) before mass deletions
4. **Test first** - Try deleting a test account to get familiar

---

## 🎓 Quick Command Reference

```powershell
# Start admin tool
node admin-tool.js

# Inside the tool:
1 - See all users
2 - Filter by branch  
3 - Check statistics
4 - Delete account (SAFE)
5 - Change user limits
6 - Toggle registration
7 - View settings
0 - Exit
```

---

**Made with ❤️ for ICAN Branch Management**
