# 🔐 License Management System - Complete Guide

## Overview

Your ICAN Management System now has a **3-month license expiration system** that automatically locks the application after 90 days until you manually renew it.

---

## 🎯 How It Works

### 1. **Installation Date Tracking**
- The system records the installation date automatically
- Default license duration: **90 days (3 months)**
- License configuration stored in: `backend/data/license.json`

### 2. **Automatic Expiration**
- After 90 days, the app shows a **full-screen lock overlay**
- Users cannot access any features
- All API requests return 403 Forbidden errors
- App requires admin renewal to unlock

### 3. **Warning System**
- **7 days before expiration**: Warning banner appears
- Users see countdown: "License expires in X days"
- Banner can be dismissed but reappears on next session

### 4. **Renewal Process**
- **Developer-only** renewal using secret key
- Can extend license for any number of days
- Renewal history tracked in `license.json`

---

## 📁 Files Created

```
backend/
  ├── data/
  │   └── license.json          # License configuration & history
  └── src/
      ├── license.js            # License management logic
      └── server.js             # Updated with license routes

src/
  ├── App.vue                    # Added LicenseChecker component
  └── components/
      └── LicenseChecker.vue    # License UI (expiration screen + warning)
```

---

## 🔧 Configuration

### License File: `backend/data/license.json`

```json
{
  "installDate": "2025-10-17T00:00:00.000Z",
  "expirationDate": "2026-01-17T23:59:59.999Z",
  "durationDays": 90,
  "isActive": true,
  "renewalHistory": [
    {
      "date": "2025-10-17T00:00:00.000Z",
      "action": "initial_installation",
      "extendedDays": 90
    }
  ],
  "contact": {
    "name": "Developer",
    "email": "your-email@example.com",
    "phone": "+234-XXX-XXX-XXXX"
  },
  "version": "1.0.0"
}
```

**Update the contact information with your details!**

---

## 🚀 API Endpoints

### 1. Check License Status
```
GET /license/status
```

**Response:**
```json
{
  "data": {
    "isValid": true,
    "isExpired": false,
    "showWarning": false,
    "daysRemaining": 85,
    "daysUsed": 5,
    "totalDays": 90,
    "installDate": "2025-10-17T00:00:00.000Z",
    "expirationDate": "2026-01-17T23:59:59.999Z",
    "contact": {...}
  }
}
```

### 2. Renew License (Developer Only)
```
POST /license/renew
Content-Type: application/json

{
  "days": 90,
  "secretKey": "ican-renewal-secret-2025"
}
```

**Response (Success):**
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

**Response (Failure):**
```json
{
  "error": "Invalid renewal key"
}
```

### 3. Deactivate License (Developer Only)
```
POST /license/deactivate
Content-Type: application/json

{
  "secretKey": "ican-renewal-secret-2025"
}
```

---

## 🔑 Renewal Secret Key

**Default Key:** `ican-renewal-secret-2025`

### Change the Secret Key:

**Option 1: Environment Variable (Recommended)**
```powershell
# Set environment variable
$env:LICENSE_SECRET="your-super-secret-key-here"

# Start backend
cd backend
npm start
```

**Option 2: Update Code**
Edit `backend/src/license.js` line 108:
```javascript
const RENEWAL_SECRET = process.env.LICENSE_SECRET || 'your-new-secret-key';
```

---

## 💻 How to Renew License

### Method 1: PowerShell Script

**Renew for 90 days:**
```powershell
$body = @{
    days = 90
    secretKey = "ican-renewal-secret-2025"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/license/renew" -Method POST -Body $body -ContentType "application/json"
```

**Renew for custom days (e.g., 180 days):**
```powershell
$body = @{
    days = 180
    secretKey = "ican-renewal-secret-2025"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/license/renew" -Method POST -Body $body -ContentType "application/json"
```

### Method 2: Using curl

```bash
curl -X POST http://localhost:4000/license/renew \
  -H "Content-Type: application/json" \
  -d '{"days": 90, "secretKey": "ican-renewal-secret-2025"}'
```

### Method 3: Postman/Insomnia

**POST** `http://localhost:4000/license/renew`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "days": 90,
  "secretKey": "ican-renewal-secret-2025"
}
```

### Method 4: Manual File Edit (Emergency)

If backend is down, manually edit `backend/data/license.json`:

```json
{
  "expirationDate": "2027-01-17T23:59:59.999Z",  // ← Update this date
  "isActive": true                                 // ← Ensure this is true
}
```

---

## 🧪 Testing the License System

### Test Expiration (Quick Test)

1. **Set expiration to past date:**
```powershell
# Edit backend/data/license.json
# Change expirationDate to: "2025-01-01T00:00:00.000Z"
```

2. **Restart backend:**
```powershell
cd backend
npm start
```

3. **Open app** - You should see the expiration screen

4. **Renew license** to restore access

### Test Warning Banner

1. **Set expiration to 5 days from now:**
```json
// Calculate: Today + 5 days
"expirationDate": "2025-10-22T23:59:59.999Z"
```

2. **Refresh app** - Warning banner should appear

---

## 🛡️ Security Features

### 1. Backend-Side Enforcement
- License check happens on every API request
- Frontend can't bypass license check
- Users can't modify license in browser

### 2. Secret Key Protection
- Renewal requires secret key
- Key stored server-side only
- Users cannot renew without key

### 3. Tamper Protection
- License file in backend (not accessible from frontend)
- File changes require server restart
- Renewal history tracked for auditing

---

## 📊 License Information Display

### Expiration Screen Shows:
- 🔒 **Lock icon** and "License Expired" message
- 📅 **Expiration date** with days expired count
- 👤 **Your contact information** (name, email, phone)
- 📍 **Installation date** and version
- 🔄 **"Check License Status"** button

### Warning Banner Shows:
- ⚠️ **Warning icon** and countdown
- 📅 **Days remaining** until expiration
- ✖️ **Dismiss button** (reappears next session)

---

## 🔄 Renewal History Tracking

Every renewal/action is logged in `license.json`:

```json
"renewalHistory": [
  {
    "date": "2025-10-17T00:00:00.000Z",
    "action": "initial_installation",
    "extendedDays": 90
  },
  {
    "date": "2026-01-15T10:30:00.000Z",
    "action": "manual_renewal",
    "extendedDays": 90,
    "previousExpiration": "2026-01-17T23:59:59.999Z",
    "newExpiration": "2026-04-17T23:59:59.999Z"
  }
]
```

View renewal history by checking the `license.json` file.

---

## 🎛️ Customization Options

### Change License Duration

**Edit:** `backend/data/license.json`
```json
{
  "durationDays": 180  // Change from 90 to any number
}
```

### Change Warning Threshold

**Edit:** `backend/src/license.js` line 72:
```javascript
const warningThreshold = 7;  // Change from 7 to any number of days
```

### Change Contact Information

**Edit:** `backend/data/license.json`
```json
{
  "contact": {
    "name": "Your Name",
    "email": "your-real-email@example.com",
    "phone": "+234-XXX-XXX-XXXX"
  }
}
```

### Disable License System (Emergency)

**Edit:** `backend/src/server.js` line 33:
```javascript
// Comment out this line:
// app.use(licenseMiddleware);
```

---

## 📱 User Experience

### When License is Valid:
- ✅ App works normally
- ✅ No overlays or banners
- ✅ Full access to all features

### 7 Days Before Expiration:
- ⚠️ Yellow warning banner at top
- ⚠️ Countdown shows days remaining
- ✅ App still fully functional
- ✅ Banner can be dismissed (returns next session)

### After Expiration:
- 🔒 Full-screen lock overlay
- ❌ No access to any features
- ❌ All API calls blocked (403 Forbidden)
- 📞 Contact information displayed prominently
- 🔄 "Check License Status" button to verify renewal

---

## 🆘 Troubleshooting

### License always shows as expired
**Solution:** Check system date/time is correct

### Can't renew license
**Solution:** Verify secret key matches exactly (case-sensitive)

### Backend not checking license
**Solution:** Ensure `licenseMiddleware` is added in `server.js`

### Users bypass license check
**Solution:** This is not possible - all checks are backend-side

### Need emergency access
**Solution:** Manually edit `license.json` or disable middleware temporarily

---

## 📝 Quick Reference Commands

**Check license status:**
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/license/status"
```

**Renew for 90 days:**
```powershell
$body = @{days=90; secretKey="ican-renewal-secret-2025"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:4000/license/renew" -Method POST -Body $body -ContentType "application/json"
```

**View license file:**
```powershell
Get-Content backend/data/license.json
```

---

## ✅ Final Checklist

- [ ] Update contact information in `license.json`
- [ ] Change default secret key (recommended)
- [ ] Test expiration screen
- [ ] Test warning banner
- [ ] Test renewal process
- [ ] Document your secret key securely
- [ ] Set calendar reminder for renewal

---

## 🎉 Summary

**Your app now has automatic license expiration!**

- ✅ Locks after 90 days automatically
- ✅ Shows warning 7 days before expiration
- ✅ Requires your secret key to renew
- ✅ Backend-enforced (cannot be bypassed)
- ✅ User-friendly expiration screen with contact info
- ✅ Full renewal history tracking

**Users must contact you to renew the license after 3 months!** 🔐
