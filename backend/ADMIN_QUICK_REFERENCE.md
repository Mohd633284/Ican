# 🎯 ADMIN QUICK REFERENCE CARD
*Keep this handy for quick access!*

---

## 🚀 START THE TOOL

```powershell
cd D:\GOLDEN-PRINTER\Programing-practical\Ican\backend
node admin-tool.js
```

---

## 📋 MENU OPTIONS

| Option | What It Does | When to Use |
|--------|--------------|-------------|
| **1** | View All Users | Before deleting anyone |
| **2** | View Users by Branch | Check specific branch |
| **3** | Branch Statistics | See who's full/available |
| **4** | 🗑️ Delete User | User wants email change |
| **5** | Change User Limit | Allow more users |
| **6** | Toggle Registration | Enable/disable signups |
| **7** | View Settings | Check current config |
| **0** | Exit | Done for now |

---

## 🗑️ SAFE DELETION STEPS

### ✅ When User Wants to Change Email/Password:

1. **Start tool:** `node admin-tool.js`
2. **Choose:** `4` (Delete User Account)
3. **Method:** `1` (Delete by ID) ← SAFER
4. **Enter ID:** e.g., `7`
5. **Confirm:** Type `DELETE` exactly
6. **Done!** Tell user to sign up again

### ⚠️ REMEMBER:
- Tool shows FULL user details before deletion
- Must type "DELETE" (case-sensitive)
- Anything else = cancelled
- User can immediately create new account

---

## 🎬 REAL EXAMPLE

**User says:** *"I want to change my email from old@example.com to new@example.com"*

**You do:**
```
1. Run: node admin-tool.js
2. Press: 1 (to see all users)
3. Note: User ID (e.g., 7)
4. Press: 4 (delete user)
5. Choose: 1 (by ID)
6. Enter: 7
7. Confirm: DELETE
```

**You reply:** *"✓ Done! You can now sign up with new@example.com"*

---

## 🔐 SAFETY FEATURES

✅ **Shows before deleting:**
- ID
- Name
- Email
- Branch
- Phone

✅ **Must type:** `DELETE` (exact, case-sensitive)

✅ **Cancel anytime:** Type anything else or press Enter

✅ **Colors:**
- 🟢 Green = Safe/Success
- 🟡 Yellow = Warning/Action needed
- 🔴 Red = Danger/Over limit
- 🔵 Cyan = Info/Cancelled

---

## 📊 BRANCH STATUS GUIDE

| Status | Meaning | Action Needed |
|--------|---------|---------------|
| ✓ AVAILABLE | Has space | None - accepting signups |
| ⚠ FULL | At limit | Delete users OR increase limit |
| ✗ OVER LIMIT! | Too many users | Delete excess users |
| ✗ DISABLED | Registration off | Enable if needed |

---

## 💡 QUICK TIPS

### ✅ DO:
- Always check user list first (option 1)
- Use ID deletion (more accurate)
- Read confirmation screen carefully
- Keep a log of deletions
- Test with fake account first

### ❌ DON'T:
- Rush through confirmation
- Delete without verifying
- Type anything except "DELETE" if you mean it
- Forget to tell user they can sign up again

---

## 🆘 COMMON PROBLEMS

### "User can't login after signup"
→ They might be over branch limit
→ Use option 3 to check
→ Delete excess users or increase limit

### "User forgot password"
→ Delete their account (option 4)
→ They create new account with new password

### "User wants different branch"
→ Delete their account
→ They sign up to correct branch

### "Branch is full"
→ Option A: Delete inactive accounts
→ Option B: Increase limit (option 5)

---

## 📞 USER CONVERSATION TEMPLATE

**User:** "I need help with my account"

**You:** "What would you like to do?"

**User:** "Change my email/password/branch"

**You:** 
1. "What's your current email?"
2. [Run admin tool, option 4, delete account]
3. "✓ Done! You can now sign up again with your new details"

**User:** "Thank you!"

---

## 🎓 REMEMBER

| What | How Long |
|------|----------|
| **User limit per branch** | Default: 1, can change |
| **Deletion time** | Instant |
| **User can re-signup** | Immediately after deletion |
| **Invoices/receipts** | Preserved (not deleted) |
| **Account recovery** | Not possible - permanent deletion |

---

## 🔢 KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| `1-7` | Select menu option |
| `0` | Exit/Cancel |
| `DELETE` | Confirm deletion (must type exactly) |
| `Enter` | Cancel/Continue |

---

## 📱 ADMIN CONTACT

**Your Role:** System Administrator  
**Your Access:** Full admin control  
**Your Tool:** admin-tool.js  
**Your Documentation:** ADMIN_TOOL_GUIDE.md

---

**🎯 ONE-MINUTE PROCESS:**
1. Start tool → 2. View users → 3. Delete by ID → 4. Confirm → 5. Done!

**🛡️ YOU CAN'T MESS UP:** Requires "DELETE" confirmation, shows full details first!

---

*Made with ❤️ for ICAN Branch Management*  
*Print this card and keep it near your computer!*
