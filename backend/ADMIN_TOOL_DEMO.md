# ADMIN TOOL VISUAL DEMONSTRATION

## What You'll See When You Run the Tool

### 🎬 Starting the Tool

```
D:\GOLDEN-PRINTER\Programing-practical\Ican\backend> node admin-tool.js

╔════════════════════════════════════════════════════════════════╗
║              ICAN ADMIN CONTROL PANEL                      ║
╚════════════════════════════════════════════════════════════════╝

✓ Database connected successfully!

MAIN MENU:
─────────────────────────────────────────────────────────────────
  1. View All Users
  2. View Users by Branch
  3. View Branch Statistics
  4. Delete User Account (Safe Selection)
  5. Change Branch User Limit
  6. Enable/Disable Branch Registration
  7. View Branch Settings
  0. Exit
─────────────────────────────────────────────────────────────────

Enter your choice (0-7): _
```

---

## 📊 Option 1: View All Users

```
✓ All Users (4 total)
─────────────────────────────────────────────────────────────────

┌──────┬────────────────────────────────────────┬───────────┬──────────────────────┐
│  ID  │ Email                                  │  Branch   │ Name                 │
├──────┼────────────────────────────────────────┼───────────┼──────────────────────┤
│ 2    │ john@example.com                       │ Kaduna    │ John Doe             │
│ 3    │ abdullahikafayatsuleiman@gmail.com     │ Kaduna    │ Suleiman Abdullahi   │
│ 4    │ newtest@example.com                    │ Kaduna    │ New Test User        │
│ 5    │ suleiman2002abdullahi@gmail.com        │ Minna     │ Suleiman Abdullahi   │
└──────┴────────────────────────────────────────┴───────────┴──────────────────────┘

Total: 4 user(s)

Press Enter to continue...
```

---

## 📈 Option 3: View Branch Statistics

```
✓ Branch Registration Status
─────────────────────────────────────────────────────────────────

┌────────────┬───────────┬─────────┬────────────┬──────────────────┐
│  Branch    │  Users    │  Max    │  Available │  Status          │
├────────────┼───────────┼─────────┼────────────┼──────────────────┤
│ Kaduna     │       3   │     1   │       -2   │ ✗ OVER LIMIT!    │  <-- RED
│ Kano       │       0   │     1   │        1   │ ✓ AVAILABLE      │  <-- GREEN
│ Minna      │       1   │     1   │        0   │ ⚠ FULL           │  <-- YELLOW
│ Oyo        │       0   │     1   │        1   │ ✓ AVAILABLE      │  <-- GREEN
│ Sokoto     │       0   │     1   │        1   │ ✓ AVAILABLE      │  <-- GREEN
└────────────┴───────────┴─────────┴────────────┴──────────────────┘

Press Enter to continue...
```

---

## 🗑️ Option 4: Delete User Account (SAFE MODE)

### Step 1: Select User to Delete

```
⚠ DELETE USER ACCOUNT - SAFE SELECTION MODE
─────────────────────────────────────────────────────────────────

✓ Select User to Delete
─────────────────────────────────────────────────────────────────

┌──────┬────────────────────────────────────────┬───────────┬──────────────────────┐
│  ID  │ Email                                  │  Branch   │ Name                 │
├──────┼────────────────────────────────────────┼───────────┼──────────────────────┤
│ 2    │ john@example.com                       │ Kaduna    │ John Doe             │
│ 3    │ abdullahikafayatsuleiman@gmail.com     │ Kaduna    │ Suleiman Abdullahi   │
│ 4    │ newtest@example.com                    │ Kaduna    │ New Test User        │
│ 5    │ suleiman2002abdullahi@gmail.com        │ Minna     │ Suleiman Abdullahi   │
└──────┴────────────────────────────────────────┴───────────┴──────────────────────┘

Total: 4 user(s)

DELETE OPTIONS:
  1. Delete by ID (safer - exact match)
  2. Delete by Email
  0. Cancel and go back

Choose deletion method (0-2): 1
```

### Step 2: Enter User ID

```
Enter User ID to delete: 2
```

### Step 3: Confirmation Screen (⚠️ MOST IMPORTANT!)

```
⚠ CONFIRMATION REQUIRED
─────────────────────────────────────────────────────────────────

You are about to delete:
  ID:     2
  Name:   John Doe
  Email:  john@example.com
  Branch: Kaduna
  Phone:  08012345678

Type "DELETE" to confirm (case-sensitive): _
```

### Step 4A: If you type "DELETE" exactly:

```
✓ SUCCESS! User account deleted:
  John Doe (john@example.com) from Kaduna branch

  This user can now create a new account with a different email.

Press Enter to continue...
```

### Step 4B: If you type anything else (or press Enter):

```
✓ Deletion cancelled. Account is safe.

Press Enter to continue...
```

---

## 🔧 Option 5: Change Branch User Limit

```
CHANGE BRANCH USER LIMIT
─────────────────────────────────────────────────────────────────

Available Branches:
  1. Kaduna
  2. Kano
  3. Minna
  4. Oyo
  5. Sokoto
  6. All branches

Enter branch number (1-6): 1

Enter new user limit (1-100): 5

✓ User limit for Kaduna set to 5.

Press Enter to continue...
```

---

## 🔄 Option 6: Enable/Disable Registration

```
ENABLE/DISABLE BRANCH REGISTRATION
─────────────────────────────────────────────────────────────────

Available Branches:
  1. Kaduna
  2. Kano
  3. Minna
  4. Oyo
  5. Sokoto

Enter branch number (1-5): 1

Action:
  1. Enable registration
  2. Disable registration

Choose action (1-2): 2

⚠ Registration DISABLED for Kaduna branch.

Press Enter to continue...
```

---

## 📋 Option 7: View Branch Settings

```
✓ Branch Settings
─────────────────────────────────────────────────────────────────

┌────────────┬─────────────┬──────────────────────┐
│  Branch    │  Max Users  │  Registration        │
├────────────┼─────────────┼──────────────────────┤
│ Kaduna     │         5   │ ✗ DISABLED           │  <-- RED
│ Kano       │         1   │ ✓ ENABLED            │  <-- GREEN
│ Minna      │         1   │ ✓ ENABLED            │  <-- GREEN
│ Oyo        │         1   │ ✓ ENABLED            │  <-- GREEN
│ Sokoto     │         1   │ ✓ ENABLED            │  <-- GREEN
└────────────┴─────────────┴──────────────────────┘

Press Enter to continue...
```

---

## 🎯 Real-World Example: User Wants to Change Email

### User Request:
> "Hi admin, I signed up with old.email@example.com but I want to change it to new.email@example.com. Can you help?"

### Your Steps:

1. **Run admin tool**
   ```powershell
   node admin-tool.js
   ```

2. **Choose option 1** to see all users
   - Verify the user exists
   - Note their ID (e.g., ID: 7)

3. **Choose option 4** to delete user
   - Select "Delete by ID"
   - Enter: 7
   - Confirmation screen shows full details
   - Type: DELETE

4. **Tell user:**
   > "✓ Done! You can now sign up with your new email address. Go to the app and create a new account with new.email@example.com"

5. **User signs up** with new email
   - System allows it because old account is deleted
   - User sets same or different password
   - ✓ Account created successfully!

---

## 🛡️ Safety Features

### ✅ What Makes This Safe:

1. **Visual Confirmation**
   - Shows ALL user details before deletion
   - ID, Name, Email, Branch, Phone

2. **Typed Confirmation**
   - Must type "DELETE" exactly (case-sensitive)
   - Typing anything else cancels
   - Pressing Enter cancels

3. **Easy to Cancel**
   - Can choose option 0 at any menu
   - Can type anything except "DELETE" to cancel
   - No accidental deletions

4. **Clear Feedback**
   - Success message shows what was deleted
   - Cancelled message confirms nothing was deleted
   - Color-coded: Green = success, Red = danger, Cyan = cancelled

---

## 💡 Pro Tips

### Tip 1: Always Check First
```
1. Run option 1 (View All Users)
2. Identify the correct user
3. Then proceed to option 4 (Delete)
```

### Tip 2: Use ID Instead of Email
```
✓ ID deletion is safer - exact numeric match
✗ Email deletion requires exact spelling
```

### Tip 3: Test with a Fake Account
```
1. Create a test user in the app
2. Practice deleting it with the admin tool
3. Get comfortable with the process
```

### Tip 4: Document Your Actions
```
Keep a log:
- Date: 2025-10-11
- Action: Deleted user john@example.com (ID: 2)
- Reason: User requested email change
- New email: newemail@example.com
```

---

## 🆘 What If Something Goes Wrong?

### "I deleted the wrong user!"
**Solution:** 
- User data is permanently deleted from database
- User needs to sign up again as a new user
- Their previous invoices/receipts are still preserved

### "Tool won't start"
```powershell
# Check you're in the right folder
cd D:\GOLDEN-PRINTER\Programing-practical\Ican\backend

# Verify admin-tool.js exists
ls admin-tool.js

# Try running with full path
node D:\GOLDEN-PRINTER\Programing-practical\Ican\backend\admin-tool.js
```

### "Can't find user to delete"
- User might already be deleted
- Check spelling of email
- Verify branch (user might be in different branch)
- Use option 1 to see current users

---

## 🎓 Summary

**The admin tool gives you:**
- ✅ Complete control over user accounts
- ✅ Safe deletion with multiple confirmations
- ✅ Easy branch management
- ✅ Clear visual feedback
- ✅ No possibility of accidental deletions

**Perfect for:**
- ✅ Helping users change emails
- ✅ Helping users who forgot passwords
- ✅ Managing branch capacity
- ✅ Cleaning up test accounts

**Made simple for admins like you! 🎉**
