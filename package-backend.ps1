$workspace = "C:\Users\User\eclipse-workspace\Mca-MiniProject-Backend"
$projectName = "miniproject.backend"
$aiPath = "C:\eclipse-for-ai"
$sourcePath = "C:\java full stack\Next\bus ticket booking\backend"
$eclipseDestPath = "$workspace\$projectName\$projectName"
$aiDestPath = "$aiPath\$projectName"
$zipPath = "$aiPath\$projectName.zip"

Write-Host "Starting backend packaging..."

# 1. Copy our modified backend to AI Path
Write-Host "Copying backend to $aiDestPath..."
if (Test-Path $aiDestPath) {
    Remove-Item -Recurse -Force $aiDestPath
}
New-Item -ItemType Directory -Path $aiDestPath | Out-Null
Copy-Item -Path "$sourcePath\*" -Destination $aiDestPath -Recurse -Force

# We also copy back to Eclipse just in case the user wants it there
Write-Host "Syncing changes back to Eclipse workspace..."
if (Test-Path $eclipseDestPath) {
    # Delete old contents except .git if any
    Get-ChildItem -Path $eclipseDestPath | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $eclipseDestPath | Out-Null
}
Copy-Item -Path "$sourcePath\*" -Destination $eclipseDestPath -Recurse -Force

Set-Location $aiDestPath

# 2. Use Maven Wrapper to clean and package
Write-Host "Running Maven build..."
if (Test-Path "mvnw.cmd") {
    $mvn = ".\mvnw.cmd"
} else {
    Write-Host "Error: mvnw.cmd not found. Please ensure Maven wrapper is installed."
    exit 1
}

& $mvn clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven clean failed!"
    exit 1
}

& $mvn package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven package failed! Stopping."
    exit 1
}

# 6. Remove unnecessary build artifacts if required (optional, we keep target for jar)
# We can remove node_modules if it existed, but it's a spring boot app.

# 7. Create the ZIP only after successful build
Write-Host "Creating ZIP archive..."
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}
Compress-Archive -Path "$aiDestPath\*" -DestinationPath $zipPath

# 8. Verifies the ZIP
if (Test-Path $zipPath) {
    Write-Host "ZIP file successfully created."
    # 9. Prints the final ZIP path
    Write-Host "Final ZIP path: $zipPath"
} else {
    Write-Host "Failed to create ZIP archive."
    exit 1
}

Write-Host "Done!"
