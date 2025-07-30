#!/bin/bash

# Naraya Rain Game - Electron Build Script
# This script builds the game into a Windows .exe file

echo "🎮 Building Naraya Rain Game for Windows..."
echo "============================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Build for Windows
echo "🏗️  Building Windows executable..."
npm run build-win

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Build completed successfully!"
echo "📁 Output location: ./dist/"
echo "🎮 Executable: ./dist/Naraya Rain Game Setup.exe"
echo ""
echo "📋 Files created:"
ls -la dist/ | grep -E '\.(exe|deb|dmg|AppImage)$' || echo "   No distribution files found in dist/"
echo ""
echo "🚀 Ready for deployment!"
echo "   Copy the .exe file to event computers and run it."