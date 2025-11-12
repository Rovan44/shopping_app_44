# Spring Boot Backend Startup Script
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Starting Shopify Backend Server   " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables from system
$env:JAVA_HOME = [System.Environment]::GetEnvironmentVariable('JAVA_HOME', [System.EnvironmentVariableTarget]::User)
if (-not $env:JAVA_HOME) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
}
$env:Path = "C:\Program Files\Java\jdk-17\bin;" + $env:Path

Write-Host "✓ Java Version:" -ForegroundColor Green
java -version

Write-Host "`n✓ Starting Spring Boot Application..." -ForegroundColor Green
Write-Host "  Backend will be available at: http://localhost:8080" -ForegroundColor Yellow
Write-Host "  API endpoints at: http://localhost:8080/api" -ForegroundColor Yellow
Write-Host "`n  Press Ctrl+C to stop the server`n" -ForegroundColor Magenta

# Start the application
.\mvnw.cmd spring-boot:run
