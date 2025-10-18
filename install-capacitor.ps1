# 📱 CAPACITOR INSTALLATION SCRIPT

## Run this to install all Capacitor dependencies

Write-Host "🚀 Starting Capacitor Installation..." -ForegroundColor Green
Write-Host ""

# Core Capacitor
Write-Host "📦 Installing Capacitor Core & CLI..." -ForegroundColor Cyan
npm install @capacitor/core @capacitor/cli

# Platform Support
Write-Host "📱 Installing Platform Support (Android & iOS)..." -ForegroundColor Cyan
npm install @capacitor/android @capacitor/ios

# Native Feature Plugins
Write-Host "📸 Installing Native Feature Plugins..." -ForegroundColor Cyan
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

Write-Host ""
Write-Host "✅ All Capacitor plugins installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run build" -ForegroundColor White
Write-Host "2. Run: npx cap add android" -ForegroundColor White
Write-Host "3. Run: npx cap sync" -ForegroundColor White
Write-Host "4. Run: npx cap open android" -ForegroundColor White
Write-Host ""
Write-Host "📚 See CAPACITOR_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
