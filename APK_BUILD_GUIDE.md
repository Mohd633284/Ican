# ICAN APK Build Guide

## Quick APK Build Instructions

### Prerequisites ✅
- Node.js installed
- Android SDK installed
- Java JDK 8+ installed

### Build Steps:

1. **Build Vue Project:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Build APK:**
   - Open Android Studio: `npx cap open android`
   - Or use command line: `./gradlew assembleDebug` (from android directory)

### APK Location:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### App Information:
- **App Name:** ICAN Invoice & Receipt
- **Package ID:** com.goldenprinter.ican
- **Platform:** Android
- **Framework:** Ionic Vue + Capacitor

### Features Included:
✅ Invoice Creation (IcanInvoice.vue)
✅ Receipt Generation (IcanReceipt.vue) 
✅ Document Preview
✅ Export functionality
✅ Mobile-optimized UI
✅ Offline capability

### Next Steps:
1. Test APK on Android device
2. Generate signed APK for Play Store (if needed)
3. Configure app permissions in AndroidManifest.xml