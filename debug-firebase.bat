@echo off
echo ===================================================================
echo ICAN Firebase Connection Fix - Complete Rebuild
echo ===================================================================
echo.
echo Applying Firebase connection fixes:
echo 1. Added network security config for Firebase domains
echo 2. Added additional network permissions
echo 3. Enhanced error logging for debugging
echo 4. Cleartext traffic enabled for development
echo.
echo Building debug APK with detailed logging...
echo.

echo Step 1: Clean everything...
if exist android\app\build rmdir /s /q android\app\build
if exist android\build rmdir /s /q android\build

echo.
echo Step 2: Sync Capacitor with new config...
call npx cap sync android

echo.
echo Step 3: Build debug APK (with console logs)...
cd android
call .\gradlew clean
call .\gradlew assembleDebug

echo.
echo Step 4: Install debug APK and check logs...
echo Connect your phone and run:
echo   adb install app\build\outputs\apk\debug\app-debug.apk
echo   adb logcat -s "Chromium" -s "ICAN" -s "Firebase"
echo.
echo ===================================================================
echo Debug APK created with enhanced Firebase logging!
echo ===================================================================
echo.
echo When you run the app, check the console for detailed Firebase logs.
echo Look for lines starting with [ICAN] for branch loading details.
echo.
pause