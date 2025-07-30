#!/bin/bash

# Build portable version (no installer, just run the .exe)
echo "🎮 Building Naraya Rain Game - Portable Version..."
echo "================================================="

# Install dependencies
npm install

# Build portable Windows version
npx electron-builder --win --config.win.target=portable

echo ""
echo "🎉 Portable build completed!"
echo "📁 Find your game at: ./dist/Naraya Rain Game.exe"
echo "💼 This .exe can run directly without installation"
echo "📂 Just copy the entire 'dist' folder to event computers"