# PowerShell script to build Android APK for ICAN project
Write-Host "Building ICAN Android APK..." -ForegroundColor Green

# Step 1: Build the Vue.js project
Write-Host "Step 1: Building Vue.js project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vue build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Sync with Capacitor
Write-Host "Step 2: Syncing with Capacitor..." -ForegroundColor Yellow
./node_modules/.bin/cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Capacitor sync failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Build Android APK
Write-Host "Step 3: Building Android APK..." -ForegroundColor Yellow
Set-Location android
& cmd /c "gradlew.bat assembleDebug"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Android build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Step 4: Check for APK file
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
    Write-Host "APK Location: $apkPath" -ForegroundColor Cyan
    
    # Show file size
    $fileSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "APK Size: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ APK not found at expected location" -ForegroundColor Red
    Write-Host "Checking build directory..." -ForegroundColor Yellow
    Get-ChildItem -Recurse -Filter "*.apk" android\app\build\ | Format-Table Name, Length, FullName
}

Write-Host "Build process completed!" -ForegroundColor Green