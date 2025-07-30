#!/bin/bash

# Naraya Rain Game - Electron Development Test Script
# This script runs the Electron app in development mode for testing

echo "🧪 Testing Naraya Rain Game in Electron..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if not present
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "🚀 Starting Electron app in development mode..."
echo ""
echo "Controls:"
echo "  F5     - Reload game"
echo "  F11    - Toggle fullscreen"
echo "  Ctrl+Shift+I - Developer tools"
echo "  Ctrl+Q - Quit"
echo ""

# Run Electron in development mode
npm run electron-dev