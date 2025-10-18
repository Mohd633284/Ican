# 📦 Android APK Build Guide

## Step-by-Step Guide to Build Your Android App

---

## 📋 Prerequisites

Before you start, ensure you have:

1. ✅ **Node.js** installed (v16 or higher)
2. ✅ **Android Studio** installed ([Download here](https://developer.android.com/studio))
3. ✅ **Java JDK** (comes with Android Studio)
4. ✅ Your project built (`npm run build`)

---

## 🚀 Quick Build Process

### Step 1: Install Dependencies

```powershell
# Install Capacitor if not already done
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Build Your Web App

```powershell
npm run build
```

This creates the `dist` folder.

### Step 3: Add Android Platform

```powershell
npx cap add android
```

This creates the `android` folder.

### Step 4: Sync Your Code

```powershell
npx cap sync android
```

### Step 5: Open in Android Studio

```powershell
npx cap open android
```

---

## 🔨 Building APK in Android Studio

### Method 1: Debug APK (Testing)

1. **Wait for Gradle Sync**
   - First time takes 5-15 minutes
   - Shows progress at bottom of Android Studio

2. **Build Debug APK**
   - Menu: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Wait for build (1-3 minutes)
   - Notification appears: "APK(s) generated successfully"

3. **Locate APK**
   - Click **"Locate"** in the notification
   - Or find at: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install on Device**
   - Copy `app-debug.apk` to your phone
   - Open and install
   - Or use `adb install app-debug.apk`

### Method 2: Release APK (Distribution)

1. **Generate Signing Key**

```powershell
cd android
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Enter details:
- Password: [Create strong password]
- First/Last name: Your name
- Organization: Golden Printer
- City, State, Country: Your location

2. **Configure Signing**

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

3. **Update build.gradle**

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            def keystoreProperties = new Properties()
            def keystorePropertiesFile = rootProject.file('key.properties')
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            }
            
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

4. **Build Release APK**

In Android Studio:
- Menu: `Build > Generate Signed Bundle / APK`
- Select **APK**
- Choose your keystore file
- Enter passwords
- Select **release** build variant
- Click **Finish**

Or via command line:

```powershell
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📱 Method 3: Command Line Build

### Debug APK:

```powershell
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK:

```powershell
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎯 Android App Bundle (AAB) for Play Store

Google Play Store requires AAB format (smaller size, better optimization):

### Build AAB:

```powershell
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### In Android Studio:

- Menu: `Build > Generate Signed Bundle / APK`
- Select **Android App Bundle**
- Choose keystore and passwords
- Select **release**
- Click **Finish**

---

## 📲 Installing APK on Device

### Method 1: USB Connection

1. Enable Developer Mode on Android:
   - Settings > About Phone
   - Tap "Build Number" 7 times

2. Enable USB Debugging:
   - Settings > Developer Options
   - Enable "USB Debugging"

3. Connect phone to computer

4. Install APK:

```powershell
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: File Transfer

1. Copy APK to phone (USB, email, cloud)
2. Open APK file on phone
3. Allow "Install from Unknown Sources" if prompted
4. Install

### Method 3: QR Code

1. Upload APK to cloud storage (Google Drive, Dropbox)
2. Generate shareable link
3. Create QR code for link
4. Scan QR on phone to download and install

---

## 🔧 Customizing Your App

### Change App Name

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">ICAN Manager</string>
    <string name="title_activity_main">ICAN Manager</string>
</resources>
```

### Change App Icon

Replace these files in `android/app/src/main/res/`:

- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Or use: `npx capacitor-assets generate`

### Change Package Name

Edit `android/app/build.gradle`:

```gradle
android {
    namespace "com.goldenprinter.ican"
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.goldenprinter.ican"
        ...
    }
}
```

Also update in `capacitor.config.json`:

```json
{
  "appId": "com.goldenprinter.ican",
  ...
}
```

### Change Version

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        ...
        versionCode 2          // Increment for each release
        versionName "1.1.0"    // Display version
    }
}
```

---

## 🧪 Testing Your APK

### On Emulator:

1. Open Android Studio
2. Menu: `Tools > Device Manager`
3. Create/Start virtual device
4. Drag APK onto emulator
5. App installs and opens

### On Real Device:

1. Connect device via USB
2. Enable USB debugging
3. Run: `adb install path/to/app.apk`
4. Or copy APK and install manually

---

## 🐛 Common Build Issues

### Issue: Gradle sync failed

**Solution:**
```powershell
cd android
./gradlew clean
./gradlew build
```

### Issue: SDK not found

**Solution:**
1. Open Android Studio
2. `File > Settings > Appearance & Behavior > System Settings > Android SDK`
3. Install missing SDK platforms and tools

### Issue: Build tools version mismatch

**Solution:**
Edit `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
    }
}
```

### Issue: Out of memory

**Solution:**
Create/edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

### Issue: APK not installing

**Solution:**
- Uninstall old version first
- Enable "Install from Unknown Sources"
- Check Android version compatibility

---

## 📊 APK Size Optimization

### Enable ProGuard (Code Shrinking)

Edit `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Use AAB Instead of APK

AAB is 15-30% smaller and optimized per-device.

### Remove Unused Languages

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        ...
        resConfigs "en"  // Keep only English
    }
}
```

---

## 📤 Sharing Your APK

### Via Cloud Storage:

1. Upload APK to Google Drive/Dropbox
2. Generate shareable link
3. Share link with testers

### Via Email:

APK files are typically 10-50 MB, safe to email.

### Via GitHub Releases:

1. Create GitHub release
2. Attach APK file
3. Share release URL

### Via Firebase App Distribution:

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups "testers"
```

---

## 🏪 Publishing to Google Play Store

### Prerequisites:

1. Google Play Developer Account ($25 one-time fee)
2. Signed AAB file
3. App assets (icon, screenshots, description)
4. Privacy policy URL

### Steps:

1. **Go to [Play Console](https://play.google.com/console)**

2. **Create App**
   - Click "Create app"
   - Enter app details
   - Complete questionnaire

3. **Prepare Store Listing**
   - Upload screenshots (phone, tablet)
   - Add app icon (512x512)
   - Write description
   - Set category
   - Add privacy policy URL

4. **Upload AAB**
   - Go to "Release > Production"
   - Click "Create new release"
   - Upload your AAB file
   - Add release notes

5. **Complete Content Rating**
   - Fill out questionnaire
   - Get rating certificate

6. **Set Pricing & Distribution**
   - Choose countries
   - Set price (free or paid)

7. **Review and Publish**
   - Review all sections
   - Click "Send for review"
   - Wait 1-3 days for approval

---

## ✅ Build Checklist

Before building final APK:

- [ ] Test all features work
- [ ] Update version number
- [ ] Update app name and icon
- [ ] Configure Firebase properly
- [ ] Test on multiple devices
- [ ] Remove debug logs
- [ ] Enable ProGuard for release
- [ ] Sign with release keystore
- [ ] Test release APK thoroughly
- [ ] Backup keystore file (IMPORTANT!)

---

## 🎯 Quick Reference

```powershell
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Build debug APK (command line)
cd android && ./gradlew assembleDebug

# Build release APK (command line)
cd android && ./gradlew assembleRelease

# Build AAB for Play Store
cd android && ./gradlew bundleRelease

# Install on connected device
adb install app-debug.apk

# List connected devices
adb devices

# Uninstall app
adb uninstall com.goldenprinter.ican
```

---

## 🔐 Important: Backup Your Keystore!

**CRITICAL:** If you lose your release keystore file, you can NEVER update your app on Play Store!

Backup locations:
1. External hard drive
2. Cloud storage (encrypted)
3. USB drive (in safe place)

---

**You're ready to build your Android app! 🚀**

Next: See `IOS_BUILD_GUIDE.md` for iOS instructions (Mac only)
