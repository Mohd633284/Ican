# 📱 Capacitor Mobile App Setup Guide

## Complete Guide to Convert Your Project to Android + iOS App

---

## 🚀 Step 1: Install Capacitor & Plugins

Run these commands in your project directory:

```powershell
# Install Capacitor Core & CLI
npm install @capacitor/core @capacitor/cli

# Install Platform Support
npm install @capacitor/android @capacitor/ios

# Install Native Feature Plugins
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
npm install @capacitor/contacts
npm install @capacitor/haptics
npm install @capacitor/network
npm install @capacitor/app
npm install @capacitor/splash-screen
npm install @capacitor/status-bar

# Install Firebase Capacitor Plugin (Optional - for better native integration)
npm install @capacitor-firebase/authentication
npm install @capacitor-firebase/firestore
```

---

## ⚙️ Step 2: Configure Capacitor

Your `capacitor.config.json` should be updated to:

```json
{
  "appId": "com.goldenprinter.ican",
  "appName": "ICAN Manager",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#10b981",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "spinnerColor": "#ffffff"
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  },
  "server": {
    "androidScheme": "https"
  }
}
```

---

## 🏗️ Step 3: Build Your Web App

Before creating native apps, build your web project:

```powershell
npm run build
```

This creates the `dist` folder that Capacitor will use.

---

## 📱 Step 4: Add Native Platforms

### Add Android:
```powershell
npx cap add android
```

### Add iOS (Mac only):
```powershell
npx cap add ios
```

This creates `android/` and `ios/` folders in your project.

---

## 🔄 Step 5: Sync Your Code

After every web build, sync to native projects:

```powershell
npm run build
npx cap sync
```

Or sync individually:
```powershell
npx cap sync android
npx cap sync ios
```

---

## 🛠️ Step 6: Open Native IDEs

### For Android (Android Studio):
```powershell
npx cap open android
```

### For iOS (Xcode - Mac only):
```powershell
npx cap open ios
```

---

## 📦 Step 7: Build APK for Android

### Method 1: Using Android Studio (Recommended)

1. **Open Android Studio**
   ```powershell
   npx cap open android
   ```

2. **Wait for Gradle Sync** (first time takes 5-10 minutes)

3. **Build APK**
   - Go to: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Wait for build to complete
   - Click **"Locate"** to find your APK file

4. **APK Location:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Method 2: Using Command Line

```powershell
cd android
./gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK (for distribution):

```powershell
cd android
./gradlew assembleRelease
```

---

## 🍎 Step 8: Build for iOS (Mac Only)

1. **Open Xcode**
   ```bash
   npx cap open ios
   ```

2. **Select Target Device/Simulator**
   - Choose a physical device OR simulator

3. **Configure Signing**
   - Select your project
   - Go to "Signing & Capabilities"
   - Select your Team (Apple Developer Account required)

4. **Build & Run**
   - Click Play button or `Cmd + R`
   - For real device: `Product > Archive`

---

## 🔧 Step 9: Configure Android Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <!-- Your activities here -->
    </application>
</manifest>
```

---

## 🔧 Step 10: Configure iOS Permissions

Edit `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture documents and receipts</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save and retrieve documents</string>

<key>NSContactsUsageDescription</key>
<string>We need contacts access to autofill customer information</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location to tag transactions</string>
```

---

## 🔄 Update Workflow

Every time you make changes:

```powershell
# 1. Make changes to your Vue code
# 2. Build web app
npm run build

# 3. Sync to native projects
npx cap sync

# 4. Open and rebuild native app
npx cap open android
# OR
npx cap open ios
```

---

## 📝 Quick Reference Commands

```powershell
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Add platforms
npx cap add android
npx cap add ios

# Build web app
npm run build

# Sync to native
npx cap sync

# Open native IDEs
npx cap open android
npx cap open ios

# Update native projects after code changes
npm run build && npx cap sync

# Run on device/emulator
npx cap run android
npx cap run ios
```

---

## 🎨 Customize App Icons & Splash Screens

### Using Capacitor Assets Generator:

```powershell
npm install -g @capacitor/assets

# Place your icon and splash images in:
# - resources/icon.png (1024x1024)
# - resources/splash.png (2732x2732)

npx capacitor-assets generate
```

---

## 🐛 Troubleshooting

### Android Build Fails:
1. Make sure you have Android Studio installed
2. Update Gradle: `cd android && ./gradlew wrapper --gradle-version=8.0`
3. Clear cache: `cd android && ./gradlew clean`

### iOS Build Fails:
1. Update CocoaPods: `sudo gem install cocoapods`
2. Install pods: `cd ios/App && pod install`
3. Update pods: `cd ios/App && pod update`

### App doesn't reflect changes:
```powershell
npm run build && npx cap sync && npx cap copy
```

---

## ✅ Testing on Real Devices

### Android:
1. Enable Developer Mode on your Android device
2. Connect via USB
3. In Android Studio, select your device
4. Click Run

### iOS:
1. Connect iPhone/iPad to Mac
2. In Xcode, select your device
3. Trust developer certificate on device
4. Click Run

---

## 📤 Distribution

### Android (Google Play Store):
1. Build signed APK or AAB
2. Create Google Play Developer Account ($25 one-time)
3. Upload to Play Console

### iOS (App Store):
1. Build archive in Xcode
2. Create Apple Developer Account ($99/year)
3. Submit via App Store Connect

---

## 🎯 Next Steps

1. ✅ Install all Capacitor dependencies
2. ✅ Configure capacitor.config.json
3. ✅ Build your web app (`npm run build`)
4. ✅ Add platforms (`npx cap add android`)
5. ✅ Open Android Studio (`npx cap open android`)
6. ✅ Build APK
7. ✅ Test on device
8. ✅ Integrate native features (see NATIVE_FEATURES_GUIDE.md)

---

**Need Help?** Check the official docs: https://capacitorjs.com/docs
