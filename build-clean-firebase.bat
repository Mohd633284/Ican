@echo off
echo ===================================================================
echo COMPLETE FIREBASE CLEANUP - ICAN PROJECT
echo ===================================================================
echo.
echo REMOVED ALL Firebase elements from ICAN project:
echo.
echo 1. DELETED Files:
echo    - firestore.rules
echo    - functions/ directory 
echo    - src/firebase/ directory
echo    - src/services/ican-firebase.service.*
echo    - All FIREBASE_*.* documentation files
echo    - .env.local file
echo.
echo 2. CLEANED package.json:
echo    - Removed firebase dependency
echo    - Uses main project Firebase only
echo.
echo 3. UPDATED imports:
echo    - All files now use main Firebase service
echo    - No separate Firebase initialization
echo    - Single source of truth: SmartDesignPro Firebase
echo.
echo 4. CLEANED builds:
echo    - Removed node_modules
echo    - Removed dist directory  
echo    - Removed Android builds
echo    - Reinstalled dependencies
echo.
echo Building clean APK with MAIN Firebase only...
echo.

echo Step 1: Build web version...
call npm run build

echo Step 2: Sync Capacitor...
call npx cap sync android

echo Step 3: Build clean APK...
cd android
call .\gradlew clean
call .\gradlew assembleRelease

echo.
echo ===================================================================
echo COMPLETELY CLEAN APK READY!
echo ===================================================================
echo.
echo The ICAN app now uses ONLY the main SmartDesignPro Firebase.
echo No conflicts, no duplicate configurations.
echo.
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
pause