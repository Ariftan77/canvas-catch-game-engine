#!/bin/bash

# Simple build without custom icons (fallback if icon issues persist)
echo "🎮 Building Naraya Rain Game (Simple Version)..."
echo "=============================================="

# Install dependencies
npm install

echo "🏗️  Building without custom icons (using default Electron icon)..."

# Temporarily remove icon references
npx electron-builder --win \
  --config.win.icon=null \
  --config.nsis.installerIcon=null \
  --config.nsis.uninstallerIcon=null \
  --config.nsis.installerHeaderIcon=null

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Simple build completed successfully!"
    echo "📁 Output location: ./dist/"
    echo "🎮 Executable: ./dist/Naraya Rain Game Setup.exe"
    echo ""
    echo "ℹ️  This version uses the default Electron icon"
    echo "   The game functionality is identical"
else
    echo "❌ Build failed"
    exit 1
fi