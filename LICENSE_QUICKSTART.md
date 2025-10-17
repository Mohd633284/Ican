# 🚀 3-Month License System - Quick Start

## ✅ What's Done

Your ICAN app now has a **3-month license expiration system**. After 90 days, users must contact you to renew.

---

## 📋 Files Created

1. **`backend/data/license.json`** - License configuration
2. **`backend/src/license.js`** - License management logic  
3. **`src/components/LicenseChecker.vue`** - Expiration UI
4. **`LICENSE_SYSTEM_GUIDE.md`** - Complete documentation

**Files Modified:**
- `backend/src/server.js` - Added license middleware & routes
- `src/App.vue` - Added LicenseChecker component

---

## ⚡ How It Works

```
Day 1-83:   ✅ App works normally
Day 84-90:  ⚠️  Warning banner: "Expires in X days"
Day 91+:    🔒 Full-screen lock - "Contact admin to renew"
```

---

## 🔧 IMPORTANT: Update Your Contact Info

**Edit:** `backend/data/license.json`

```json
{
  "contact": {
    "name": "Your Name Here",
    "email": "your-email@example.com",
    "phone": "+234-XXX-XXX-XXXX"
  }
}
```

This info is shown to users when the license expires!

---

## 🔑 Renewal Secret Key

**Default Key:** `ican-renewal-secret-2025`

**⚠️ IMPORTANT:** Change this key for security!

**Edit:** `backend/src/license.js` (line 108):
```javascript
const RENEWAL_SECRET = process.env.LICENSE_SECRET || 'your-new-secret-here';
```

---

## 🔄 How to Renew License

When a user contacts you for renewal:

```powershell
# Renew for 90 more days
$body = @{
    days = 90
    secretKey = "ican-renewal-secret-2025"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/license/renew" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "License renewed for 90 days",
    "newExpirationDate": "2026-04-17T23:59:59.999Z",
    "daysRemaining": 180
  }
}
```

---

## 🧪 Test It Now!

### Test 1: Check Current Status
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/license/status"
```

### Test 2: Force Expiration (Testing Only)
1. Open `backend/data/license.json`
2. Change `expirationDate` to past date: `"2025-01-01T00:00:00.000Z"`
3. Restart backend: `cd backend; npm start`
4. Open app → You'll see the lock screen
5. Renew to restore access

### Test 3: Warning Banner
1. Set expiration to 5 days from now in `license.json`
2. Restart backend
3. Open app → Warning banner should appear

---

## 🎯 What Users See

### ✅ Valid License (Day 1-83)
- Normal app access
- No overlays or warnings

### ⚠️ Warning Period (Day 84-90)  
- Yellow banner at top
- "License expires in X days"
- App still works fully
- Can dismiss banner

### 🔒 Expired License (Day 91+)
- Full-screen red lock overlay
- **No app access at all**
- Shows your contact information
- "Check License Status" button
- All API calls return 403 Forbidden

---

## 🛡️ Security Features

✅ **Backend-enforced** - Users can't bypass  
✅ **Secret key required** - Only you can renew  
✅ **Tamper-proof** - License file in backend  
✅ **API-level blocking** - All requests checked  
✅ **Renewal history** - Full audit trail  

---

## 📱 Current License Details

**Install Date:** October 17, 2025  
**Expires:** January 17, 2026  
**Duration:** 90 days  
**Days Remaining:** ~90 days  

Check anytime:
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/license/status"
```

---

## 🆘 Emergency Access

If you need to quickly unlock:

**Option 1:** Renew via API (recommended)

**Option 2:** Manual file edit
```json
// backend/data/license.json
{
  "expirationDate": "2027-12-31T23:59:59.999Z",  // Far future date
  "isActive": true
}
```

**Option 3:** Disable temporarily
```javascript
// backend/src/server.js (line 33)
// Comment out:
// app.use(licenseMiddleware);
```

---

## 📝 Quick Commands

**Check status:**
```powershell
Invoke-RestMethod http://localhost:4000/license/status
```

**Renew 90 days:**
```powershell
$body=@{days=90;secretKey="ican-renewal-secret-2025"}|ConvertTo-Json
Invoke-RestMethod http://localhost:4000/license/renew -Method POST -Body $body -ContentType "application/json"
```

**Renew 180 days:**
```powershell
$body=@{days=180;secretKey="ican-renewal-secret-2025"}|ConvertTo-Json
Invoke-RestMethod http://localhost:4000/license/renew -Method POST -Body $body -ContentType "application/json"
```

---

## ✅ Next Steps

1. **Update contact info** in `license.json` ⬅️ DO THIS FIRST!
2. **Change secret key** for security
3. **Test the system** (force expiration)
4. **Test renewal** process
5. **Set calendar reminder** 2 weeks before expiration
6. **Document your secret key** securely

---

## 📚 Full Documentation

See **`LICENSE_SYSTEM_GUIDE.md`** for:
- Detailed API documentation
- Customization options
- Troubleshooting guide
- Security best practices
- Testing scenarios

---

## 🎉 You're All Set!

Your app will now automatically lock after 3 months. Users **must contact you** to renew!

**The system is active right now.** Check status:
```powershell
cd backend
npm start
# Then in another terminal:
Invoke-RestMethod http://localhost:4000/license/status
```

**Questions?** Check `LICENSE_SYSTEM_GUIDE.md` for complete documentation.
