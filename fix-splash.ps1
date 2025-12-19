Write-Host "🔧 ICAN Splash Screen Fix - Building APK..." -ForegroundColor Yellow
Write-Host ""

# Build the Vue app
Write-Host "Step 1: Building Vue app..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Syncing with Android..." -ForegroundColor Cyan
./node_modules/.bin/cap sync android
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Sync successful" -ForegroundColor Green
} else {
    Write-Host "❌ Sync failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Ready for testing!" -ForegroundColor Green
Write-Host ""
Write-Host "To test immediately: ./node_modules/.bin/cap run android" -ForegroundColor Yellow
Write-Host "To open in Android Studio: ./node_modules/.bin/cap open android" -ForegroundColor Yellow
Write-Host ""
Write-Host "Key fixes applied:" -ForegroundColor Cyan
Write-Host "✅ Changed splash background to white" -ForegroundColor White
Write-Host "✅ Reduced splash duration to 300ms" -ForegroundColor White
Write-Host "✅ Enabled auto-hide" -ForegroundColor White
Write-Host "✅ Simplified app initialization" -ForegroundColor White
Write-Host "✅ Multiple splash hide attempts" -ForegroundColor White