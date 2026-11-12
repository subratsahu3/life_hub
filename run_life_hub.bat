@echo off
title Life-Hub Launcher
echo ========================================================
echo        Starting Life-Hub Unified Daily OS
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "Life-Hub Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite Frontend on http://localhost:3000 ...
start "Life-Hub Frontend" cmd /k "cd /d "%~dp0web" && npm run dev"

timeout /t 3 >nul
echo.
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo Life-Hub is now running! Keep the backend & frontend windows open.
echo To stop, simply close the opened command windows.
pause
