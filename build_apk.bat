@echo off
title Life-Hub APK Builder
echo ========================================================
echo          Building Life-Hub Android APK
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Building Web Production Assets...
cd web
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend bundle.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/3] Syncing distribution to Android assets...
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"
xcopy /E /I /Y "web\dist" "android\app\src\main\assets\dist"

echo.
echo [3/3] Android Project is synchronized and ready!
echo.
echo Options to generate your final APK:
echo 1. Open the 'D:\Subrat\life_hub\android' folder in Android Studio and click Build - Build APK(s).
echo 2. Or push to your GitHub repository - the GitHub Actions workflow in .github/workflows/build-apk.yml will automatically build and publish life-hub.apk for direct download!
echo 3. Or on any phone browser (Chrome/Edge), open http://<YOUR_PC_IP>:3000 and tap 'Install App' for instant native standalone app experience.
echo.
pause
