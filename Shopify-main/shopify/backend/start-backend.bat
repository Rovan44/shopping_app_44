@echo off
REM Spring Boot Backend Startup Script (Batch File)
echo =====================================
echo   Starting Shopify Backend Server   
echo =====================================
echo.

REM Set JAVA_HOME to JDK 17
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo Checking Java Version:
java -version
echo.

echo Starting Spring Boot Application...
echo Backend will be available at: http://localhost:8080
echo API endpoints at: http://localhost:8080/api
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the application
mvnw.cmd spring-boot:runcd2
