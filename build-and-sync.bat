@echo off
echo.
echo ========================================
echo   Building ICAN App for Android
echo ========================================
echo.

cd /d "D:\GOLDEN-PRINTER\Programing-practical\SmartDesignPro\src\views\micro-apps\Ican"

echo [1/2] Building app...
call npm run build

echo.
echo [2/2] Syncing to Android...
call npx cap sync android

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open Android Studio
echo 2. Open the 'android' folder from this directory
echo 3. Build -^> Build Bundle(s)/APK(s) -^> Build APK(s)
echo.
pause
