# Script to find a compatible JDK (11, 17, or 21)
Write-Host "Checking Java Installations..." -ForegroundColor Cyan

# 1. List contents of Adoptium folder to see what is actually there
$adoptiumPath = "C:\Program Files\Eclipse Adoptium"
if (Test-Path $adoptiumPath) {
    Write-Host "Listing contents of $adoptiumPath :" -ForegroundColor Yellow
    Get-ChildItem -Path $adoptiumPath | Select-Object Name, FullName | Format-Table -AutoSize
} else {
    Write-Host "$adoptiumPath does not exist." -ForegroundColor Red
}

$searchRoots = @(
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Java",
    "C:\Program Files (x86)\Java",
    "C:\Program Files\Android\Android Studio\jbr",
    "C:\Program Files\Android\Android Studio\jre"
)

$foundCandidates = @()

foreach ($root in $searchRoots) {
    if (Test-Path $root) {
        $subdirs = Get-ChildItem -Path $root -Directory
        foreach ($dir in $subdirs) {
             $javaExe = Join-Path $dir.FullName "bin\java.exe"
             if (Test-Path $javaExe) {
                 # Get version
                 $proc = Start-Process -FilePath $javaExe -ArgumentList "-version" -NoNewWindow -PassThru -RedirectStandardError "java_version_check.tmp"
                 $proc.WaitForExit()
                 
                 if (Test-Path "java_version_check.tmp") {
                    $output = Get-Content "java_version_check.tmp" | Out-String
                    if ($output -match '"(\d+)\.') {
                        $majorVersion = $matches[1]
                        $foundCandidates += @{ Version = [int]$majorVersion; Path = $dir.FullName }
                    }
                 }
             }
        }
    }
}

# cleanup temp file
if (Test-Path "java_version_check.tmp") { Remove-Item "java_version_check.tmp" }

# Selection Logic
$selected = $null

# Priority 1: Java 17
$java17 = $foundCandidates | Where-Object { $_.Version -eq 17 } | Select-Object -First 1
if ($java17) {
    $selected = $java17
    Write-Host "Found Preferred Java 17: $($java17.Path)" -ForegroundColor Green
}

# Priority 2: Java 21 (Second best for modern Android)
if (-not $selected) {
    $java21 = $foundCandidates | Where-Object { $_.Version -eq 21 } | Select-Object -First 1
    if ($java21) {
        $selected = $java21
        Write-Host "Found Java 21: $($java21.Path)" -ForegroundColor Green
    }
}

# Priority 3: Java 11 (Old reliable)
if (-not $selected) {
    $java11 = $foundCandidates | Where-Object { $_.Version -eq 11 } | Select-Object -First 1
    if ($java11) {
        $selected = $java11
        Write-Host "Found Java 11: $($java11.Path)" -ForegroundColor Green
    }
}

if ($selected) {
    Write-Host "Selected JDK: $($selected.Path)" -ForegroundColor Cyan
    $selected.Path | Out-File "selected_java_path.txt" -Encoding ascii
} else {
    Write-Host "No compatible Java (11, 17, 21) found." -ForegroundColor Red
    if ($foundCandidates.Count -gt 0) {
        $versions = $foundCandidates | ForEach-Object { $_.Version }
        Write-Host "Found versions: $($versions -join ', ')" -ForegroundColor Red
    }
}
