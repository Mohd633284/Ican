# 🍎 iOS Build Guide (Mac Only)

## Complete Guide to Build Your iOS App

---

## ⚠️ Requirements

iOS app development requires:

1. ✅ **Mac Computer** (MacBook, iMac, Mac Mini, Mac Studio)
2. ✅ **Xcode** (free from Mac App Store)
3. ✅ **Apple Developer Account** ($99/year for App Store distribution)
4. ✅ **iOS Device or Simulator** for testing

**Note:** You cannot build iOS apps on Windows. You need a Mac.

---

## 🚀 Quick Build Process

### Step 1: Install Xcode

1. Open **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **"Get"** or **"Install"**
4. Wait for download (12+ GB)
5. Open Xcode and accept license

### Step 2: Install Xcode Command Line Tools

```bash
xcode-select --install
```

### Step 3: Install CocoaPods

```bash
sudo gem install cocoapods
```

### Step 4: Add iOS Platform

In your project directory:

```bash
# Build web app first
npm run build

# Add iOS platform
npx cap add ios
```

This creates the `ios` folder.

### Step 5: Install Pods

```bash
cd ios/App
pod install
cd ../..
```

### Step 6: Sync Your Code

```bash
npx cap sync ios
```

### Step 7: Open in Xcode

```bash
npx cap open ios
```

---

## 🔨 Building in Xcode

### For Simulator (Testing)

1. **Select Simulator**
   - Top toolbar: Click device selector
   - Choose "iPhone 14 Pro" or any simulator

2. **Build and Run**
   - Click ▶️ Play button (or `Cmd + R`)
   - Wait for build (1-3 minutes first time)
   - Simulator launches with your app

### For Real Device (Testing)

1. **Connect iPhone/iPad**
   - Connect via USB cable
   - Unlock device
   - Trust computer if prompted

2. **Select Your Device**
   - Top toolbar: Click device selector
   - Choose your connected device

3. **Configure Signing**
   - Select **"App"** project in left sidebar
   - Go to **"Signing & Capabilities"** tab
   - **Team**: Select your Apple Developer account
   - **Bundle Identifier**: `com.goldenprinter.ican`
   - Xcode auto-generates provisioning profile

4. **Build and Run**
   - Click ▶️ Play button (or `Cmd + R`)
   - First time: On device, go to Settings > General > VPN & Device Management
   - Trust your developer certificate
   - Return to app and run

---

## 📦 Creating Archive for App Store

### Step 1: Configure for Release

1. **Update Version**
   - Select **"App"** project
   - **General** tab
   - Update **Version** (e.g., 1.0.0)
   - Update **Build** (e.g., 1)

2. **Set Display Name**
   - **General** tab
   - **Display Name**: "ICAN Manager"

3. **Configure App Icon**
   - Place 1024x1024 PNG in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Or use: `npx capacitor-assets generate`

### Step 2: Select Target

- Top toolbar: Change from simulator to **"Any iOS Device (arm64)"**

### Step 3: Create Archive

1. Menu: **Product > Archive**
2. Wait for build (2-5 minutes)
3. Archive Organizer window opens

### Step 4: Distribute to App Store

1. Select your archive
2. Click **"Distribute App"**
3. Choose **"App Store Connect"**
4. Click **"Upload"**
5. Select **"Automatically manage signing"**
6. Click **"Upload"**
7. Wait for upload to complete

---

## 🏪 App Store Submission

### Prerequisites:

1. **Apple Developer Account**
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Pay $99/year fee

2. **App Store Connect**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Create new app

### Create App in App Store Connect:

1. **Click "My Apps" > "+" > "New App"**

2. **Enter Details:**
   - **Platform**: iOS
   - **Name**: ICAN Manager
   - **Primary Language**: English
   - **Bundle ID**: com.goldenprinter.ican
   - **SKU**: ican-manager-001

3. **Fill App Information:**
   - **Subtitle**: Branch Management System
   - **Description**: Manage invoices, receipts, and transactions...
   - **Keywords**: invoice, receipt, business, management
   - **Support URL**: Your website
   - **Marketing URL**: (optional)

4. **Upload Screenshots:**
   - **6.5" Display** (iPhone 14 Pro Max): 1290 x 2796
   - **5.5" Display** (iPhone 8 Plus): 1242 x 2208
   - Take screenshots in simulator: `Cmd + S`

5. **App Icon:**
   - 1024 x 1024 PNG (no transparency)

6. **Build:**
   - Select the build you uploaded from Xcode
   - Add "What's New" description

7. **Pricing:**
   - Free or Paid
   - Select countries

8. **Privacy:**
   - Privacy policy URL (required)
   - Data collection details

9. **Submit for Review:**
   - Click "Submit for Review"
   - Wait 24-48 hours for approval

---

## 🔧 Customizing Your iOS App

### Change App Name

Edit `ios/App/App/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>ICAN Manager</string>
```

### Change Bundle Identifier

In Xcode:
- Select **App** project
- **General** tab
- **Bundle Identifier**: `com.goldenprinter.ican`

### Add Permissions

Edit `ios/App/App/Info.plist`:

```xml
<!-- Camera -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture documents and receipts</string>

<!-- Photo Library -->
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save and retrieve documents</string>

<!-- Contacts -->
<key>NSContactsUsageDescription</key>
<string>We need contacts access to autofill customer information</string>

<!-- Location -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location to tag transactions</string>

<!-- Notifications -->
<key>NSUserNotificationsUsageDescription</key>
<string>We send notifications for payment reminders and updates</string>
```

### Configure App Icon

1. Create 1024x1024 PNG icon
2. Place in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
3. Or use automatic generator:

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --ios
```

### Configure Splash Screen

1. Create 2732x2732 PNG splash image
2. Place in: `ios/App/App/Assets.xcassets/Splash.imageset/`
3. Or use generator (same as above)

---

## 🧪 Testing Your iOS App

### Using Simulator:

```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 14 Pro"

# Run app
npx cap run ios
```

### Using TestFlight (Beta Testing):

1. Upload build to App Store Connect (see above)
2. Go to **TestFlight** tab in App Store Connect
3. Add **Internal Testers** (up to 100)
4. Add **External Testers** (up to 10,000, needs review)
5. Testers receive email with TestFlight link
6. They download TestFlight app and install your app

---

## 🐛 Common Build Issues

### Issue: "No signing certificate found"

**Solution:**
1. In Xcode: **Preferences > Accounts**
2. Add Apple ID
3. Download manual certificates
4. Or use "Automatically manage signing"

### Issue: "Provisioning profile doesn't match"

**Solution:**
1. Select **App** project
2. **Signing & Capabilities**
3. Uncheck "Automatically manage signing"
4. Then re-check it (forces regeneration)

### Issue: "CocoaPods not installed"

**Solution:**
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

### Issue: "Module not found"

**Solution:**
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
npx cap sync ios
```

### Issue: Build fails with "ld: library not found"

**Solution:**
1. Clean build folder: `Product > Clean Build Folder` (Shift + Cmd + K)
2. Delete `ios/App/Pods` folder
3. Run: `cd ios/App && pod install`
4. Rebuild

---

## 📱 Enterprise Distribution (Without App Store)

If you have **Apple Developer Enterprise account** ($299/year):

1. **Create Archive** (same as above)

2. **Distribute App**
   - Select **"Enterprise"**
   - Select distribution certificate
   - Click **"Export"**

3. **Install via MDM or OTA**
   - Upload .ipa to internal server
   - Create manifest.plist
   - Distribute link to employees

---

## 🔒 Code Signing

### Automatic Signing (Recommended):

In Xcode:
- **Signing & Capabilities**
- Check **"Automatically manage signing"**
- Select your **Team**
- Done! Xcode handles everything

### Manual Signing (Advanced):

1. **Create Certificates:**
   - Go to [developer.apple.com/account/resources/certificates](https://developer.apple.com/account/resources/certificates)
   - Create "iOS Distribution" certificate
   - Download and install

2. **Create App ID:**
   - Go to Identifiers section
   - Create App ID: `com.goldenprinter.ican`
   - Enable capabilities (Push Notifications, etc.)

3. **Create Provisioning Profile:**
   - Go to Profiles section
   - Create "App Store" profile
   - Select App ID and certificate
   - Download and install

4. **Configure in Xcode:**
   - Uncheck "Automatically manage signing"
   - Select manual provisioning profile

---

## 📊 App Size Optimization

### Enable Bitcode:

In Xcode:
- Select **App** target
- **Build Settings**
- Search "Bitcode"
- **Enable Bitcode**: Yes

### Strip Debug Symbols:

In Xcode:
- **Build Settings**
- **Strip Debug Symbols During Copy**: Yes (Release only)
- **Strip Linked Product**: Yes (Release only)

### App Thinning:

Apple automatically optimizes your app per-device when you upload to App Store.

---

## 🔄 Update Workflow

Every time you make changes:

```bash
# 1. Make changes to Vue code

# 2. Build web app
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Open Xcode
npx cap open ios

# 5. Build and run
# Click ▶️ in Xcode
```

---

## 📤 Exporting IPA File

### For Ad Hoc Distribution:

1. **Archive:** `Product > Archive`

2. **Export:**
   - Click **"Distribute App"**
   - Select **"Ad Hoc"**
   - Select devices (registered in developer portal)
   - Export

3. **Install:**
   - Use Xcode: `Window > Devices and Simulators`
   - Drag .ipa onto device
   - Or use iTunes, Apple Configurator, or TestFlight

---

## ✅ Pre-Submission Checklist

Before submitting to App Store:

- [ ] Test on real device (iPhone/iPad)
- [ ] Update version and build numbers
- [ ] Configure app icon (1024x1024)
- [ ] Add all required screenshots
- [ ] Write app description and keywords
- [ ] Create privacy policy
- [ ] Test all native features (camera, contacts, etc.)
- [ ] Remove console.log statements
- [ ] Enable production Firebase config
- [ ] Test offline mode
- [ ] Test network error handling
- [ ] Verify all links work
- [ ] Test on multiple iOS versions
- [ ] Check accessibility features
- [ ] Proofread all text for typos

---

## 🎯 Quick Reference Commands

```bash
# Add iOS platform
npx cap add ios

# Install pods
cd ios/App && pod install && cd ../..

# Sync code to iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# Run on simulator
npx cap run ios

# Update pods
cd ios/App && pod update && cd ../..

# Clean and rebuild
cd ios/App && pod deintegrate && pod install && cd ../..

# Check iOS version
xcrun --show-sdk-version

# List simulators
xcrun simctl list devices
```

---

## 📱 Minimum iOS Version

Your app currently targets iOS 13.0+. To change:

Edit `ios/App/App.xcodeproj/project.pbxproj`:

Search for `IPHONEOS_DEPLOYMENT_TARGET` and set to desired version:

```
IPHONEOS_DEPLOYMENT_TARGET = 14.0;
```

Or in Xcode:
- Select **App** project
- **Build Settings** tab
- Search "Deployment Target"
- Set **iOS Deployment Target**

---

## 🌍 Localization (Multiple Languages)

To add languages:

1. In Xcode: Select **App** project
2. **Info** tab
3. **Localizations** section
4. Click **+** to add languages
5. Create `.strings` files for translations

---

## 🔐 Important Notes

1. **Keep Your Certificates Safe!**
   - Backup certificates and provisioning profiles
   - Store in secure location (password manager, encrypted drive)

2. **TestFlight for Beta Testing**
   - Free and easy
   - Up to 10,000 external testers
   - Get feedback before App Store release

3. **App Store Review**
   - First review takes 24-48 hours
   - Updates usually reviewed within 24 hours
   - Follow [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

4. **Annual Fee**
   - Apple Developer membership costs $99/year
   - Required for App Store distribution
   - Includes TestFlight access

---

**You're ready to build your iOS app! 🚀**

**Note:** This requires a Mac computer. For Android only, see `ANDROID_BUILD_GUIDE.md`
