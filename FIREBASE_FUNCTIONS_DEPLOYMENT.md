# 🔥 Firebase Functions Deployment Guide

## Prerequisites Setup

### 1. Install Firebase CLI
```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

### 2. Login to Firebase
```powershell
# Login with your Google account
firebase login

# List your projects
firebase projects:list
```

### 3. Verify Project Connection
```powershell
# Check current project
firebase use

# Should show: ican-management
```

---

## Functions Setup

### 1. Install Function Dependencies
```powershell
# Navigate to functions folder
cd functions

# Install dependencies
npm install

# Go back to root
cd ..
```

### 2. Set Function Configuration (Optional)
```powershell
# Set admin secret for createMember function
firebase functions:config:set app.dev_secret="your-secret-key-here"

# View current config
firebase functions:config:get
```

---

## Deployment Steps

### Option 1: Deploy All Functions
```powershell
firebase deploy --only functions
```

### Option 2: Deploy Specific Functions
```powershell
# Deploy only createMember function
firebase deploy --only functions:createMember

# Deploy only onUserDelete function
firebase deploy --only functions:onUserDelete

# Deploy both
firebase deploy --only functions:createMember,functions:onUserDelete
```

### Option 3: Use npm Script (from functions folder)
```powershell
cd functions
npm run deploy
cd ..
```

---

## Testing Functions

### 1. Test Locally with Emulator
```powershell
# Start Firebase emulators
firebase emulators:start

# Functions will be available at:
# http://localhost:5001/ican-management/us-central1/createMember
```

### 2. Test createMember Function
```powershell
# Using PowerShell
$body = @{
    email = "test@example.com"
    password = "testpass123"
    displayName = "Test User"
    secretKey = "your-secret-key-here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://us-central1-ican-management.cloudfunctions.net/createMember" -Method POST -Body $body -ContentType "application/json"
```

### 3. View Function Logs
```powershell
# View logs for all functions
firebase functions:log

# View logs for specific function
firebase functions:log --only createMember

# Follow logs in real-time
firebase functions:log --follow
```

---

## Troubleshooting

### Error: "firebase: command not found"
**Solution:**
```powershell
npm install -g firebase-tools
```

### Error: "Failed to authenticate"
**Solution:**
```powershell
firebase logout
firebase login
```

### Error: "Project not found"
**Solution:**
```powershell
# Check if you're using the right project
firebase use ican-management

# List available projects
firebase projects:list
```

### Error: "Node version mismatch"
**Solution:**
The functions require Node.js 18. Check your version:
```powershell
node --version

# If not 18.x, install Node.js 18 from nodejs.org
```

### Error: "Billing not enabled"
Firebase Functions require the Blaze (pay-as-you-go) plan.
**Solution:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project (ican-management)
3. Click "Upgrade" and enable billing

---

## Function URLs (After Deployment)

Once deployed, your functions will be available at:

**createMember:**
```
https://us-central1-ican-management.cloudfunctions.net/createMember
```

**onUserDelete:**
```
(Automatically triggers when a user is deleted from Authentication)
```

---

## Security Configuration

### Update CORS for Production
Edit `functions/index.js`:

```javascript
// Change this line (Line 22)
res.set('Access-Control-Allow-Origin', '*');

// To this (replace with your domain)
res.set('Access-Control-Allow-Origin', 'https://your-production-domain.com');
```

### Set Admin Secret
```powershell
# Set a strong secret key
firebase functions:config:set app.dev_secret="your-very-secure-secret-key-12345"

# Redeploy after setting
firebase deploy --only functions
```

---

## Quick Deployment Checklist

- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Project verified (`firebase use`)
- [ ] Function dependencies installed (`cd functions && npm install`)
- [ ] Billing enabled (Blaze plan required)
- [ ] Admin secret configured (`firebase functions:config:set app.dev_secret="..."`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] Functions tested (check logs)

---

## Cost Estimate

Firebase Functions pricing (Blaze plan):
- **Free Tier:** 2M invocations/month
- **After free tier:** $0.40 per million invocations
- **Typical usage for this app:** Well within free tier

**Note:** Your current usage will likely stay within the free tier unless you have very high traffic.

---

## Alternative: Skip Cloud Functions

If you don't need cloud functions, the app works perfectly without them because:
- Member management uses the Express backend (`backend/src/server.js`)
- Authentication is handled locally
- Data is stored in SQLite + localStorage

**You can safely skip Firebase Functions deployment if:**
- You're only running locally
- You don't need server-side member creation
- You use the existing Express backend for all operations

---

## Need Help?

Check the Firebase documentation:
- Functions docs: https://firebase.google.com/docs/functions
- CLI reference: https://firebase.google.com/docs/cli

Or review the function code:
- `functions/index.js` - Function definitions
- `functions/README.md` - Additional notes
