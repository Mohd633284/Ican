# Firebase Functions Quick Setup Script
# Run this in PowerShell to set up and deploy Firebase Functions

Write-Host "🔥 Firebase Functions Setup Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "1️⃣  Checking Firebase CLI..." -ForegroundColor Yellow
$firebaseCli = Get-Command firebase -ErrorAction SilentlyContinue

if (-not $firebaseCli) {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm install -g firebase-tools" -ForegroundColor White
        exit 1
    }
    Write-Host "✅ Firebase CLI installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Firebase CLI is already installed" -ForegroundColor Green
    firebase --version
}

Write-Host ""

# Check if user is logged in
Write-Host "2️⃣  Checking Firebase authentication..." -ForegroundColor Yellow
$loginCheck = firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Firebase. Please login:" -ForegroundColor Red
    Write-Host ""
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed. Please try again manually." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase authentication verified" -ForegroundColor Green

Write-Host ""

# Verify project
Write-Host "3️⃣  Verifying Firebase project..." -ForegroundColor Yellow
firebase use ican-management
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set project. Please check if project exists." -ForegroundColor Red
    Write-Host "   Available projects:" -ForegroundColor White
    firebase projects:list
    exit 1
}
Write-Host "✅ Project set to: ican-management" -ForegroundColor Green

Write-Host ""

# Install function dependencies
Write-Host "4️⃣  Installing function dependencies..." -ForegroundColor Yellow
Push-Location functions
npm install
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Pop-Location
Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

Write-Host ""

# Prompt for admin secret
Write-Host "5️⃣  Setting up admin secret..." -ForegroundColor Yellow
$secret = Read-Host "Enter admin secret key (or press Enter to skip)"
if ($secret) {
    firebase functions:config:set app.dev_secret="$secret"
    Write-Host "✅ Admin secret configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipped admin secret configuration" -ForegroundColor Yellow
    Write-Host "   You can set it later with: firebase functions:config:set app.dev_secret='your-key'" -ForegroundColor White
}

Write-Host ""

# Deploy functions
Write-Host "6️⃣  Deploying functions..." -ForegroundColor Yellow
Write-Host ""
firebase deploy --only functions

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Functions deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your functions are now live at:" -ForegroundColor Cyan
    Write-Host "  https://us-central1-ican-management.cloudfunctions.net/createMember" -ForegroundColor White
    Write-Host ""
    Write-Host "View logs with: firebase functions:log" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Please check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  • Billing not enabled (Functions require Blaze plan)" -ForegroundColor White
    Write-Host "  • Node version mismatch (requires Node 18)" -ForegroundColor White
    Write-Host "  • Network/permissions issues" -ForegroundColor White
    Write-Host ""
    Write-Host "See FIREBASE_FUNCTIONS_DEPLOYMENT.md for detailed troubleshooting" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Script completed!" -ForegroundColor Cyan
