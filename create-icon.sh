#!/bin/bash

# Create proper Windows .ico file from PNG
echo "🎨 Creating Windows .ico file from Naraya icon..."

# Create different sizes needed for .ico
sips -z 16 16 electron/icon.png --out electron/icon-16.png
sips -z 32 32 electron/icon.png --out electron/icon-32.png
sips -z 48 48 electron/icon.png --out electron/icon-48.png
sips -z 64 64 electron/icon.png --out electron/icon-64.png
sips -z 128 128 electron/icon.png --out electron/icon-128.png
sips -z 256 256 electron/icon.png --out electron/icon-256.png

# Check if ImageMagick is available for better ico creation
if command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick to create high-quality .ico file"
    convert electron/icon-16.png electron/icon-32.png electron/icon-48.png electron/icon-64.png electron/icon-128.png electron/icon-256.png electron/icon.ico
else
    echo "⚠️  ImageMagick not found, using sips (may have lower quality)"
    # Fallback to sips
    sips -s format ico electron/icon-256.png --out electron/icon.ico
fi

# Clean up temporary files
rm -f electron/icon-16.png electron/icon-32.png electron/icon-48.png electron/icon-64.png electron/icon-128.png electron/icon-256.png

echo "✅ Icon created: electron/icon.ico"