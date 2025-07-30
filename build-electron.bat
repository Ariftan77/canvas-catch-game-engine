@echo off
REM Naraya Rain Game - Electron Build Script for Windows
REM This script builds the game into a Windows .exe file

echo 🎮 Building Naraya Rain Game for Windows...
echo ============================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Build for Windows
echo 🏗️  Building Windows executable...
npm run build-win

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 🎉 Build completed successfully!
echo 📁 Output location: .\dist\
echo 🎮 Executable: .\dist\Naraya Rain Game Setup.exe
echo.
echo 📋 Files created:
dir dist\*.exe 2>nul
echo.
echo 🚀 Ready for deployment!
echo    Copy the .exe file to event computers and run it.
echo.
pause