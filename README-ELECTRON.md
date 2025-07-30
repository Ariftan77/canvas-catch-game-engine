# Naraya Rain Game - Electron Desktop Version

Convert your HTML5 Naraya Rain game into a Windows .exe desktop application using Electron.

## 🚀 Quick Start

### Prerequisites

1. **Install Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Choose "LTS" version for stability

2. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

### Build Instructions

#### Option 1: Automatic Build (Recommended)

**On macOS/Linux:**
```bash
./build-electron.sh
```

**On Windows:**
```cmd
build-electron.bat
```

#### Option 2: Manual Build

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build for Windows**
   ```bash
   npm run build-win
   ```

3. **Find Your .exe**
   - Location: `./dist/Naraya Rain Game Setup.exe`
   - Size: ~150-200MB (includes everything needed)

## 📁 File Structure

```
canvas-catch-game-engine/
├── package.json           # Electron configuration
├── electron/             
│   ├── main.js           # Main Electron process
│   ├── preload.js        # Security preload script  
│   └── icon.png          # App icon (Naraya logo)
├── src/                  # Your game files (unchanged)
├── dist/                 # Built .exe files appear here
├── build-electron.sh     # macOS/Linux build script
└── build-electron.bat    # Windows build script
```

## 🎮 Features Added

### Desktop Integration
- ✅ **Native window** with Naraya branding
- ✅ **Custom app icon** using Naraya logo
- ✅ **Fullscreen support** (F11 key)
- ✅ **Professional installer** with desktop shortcuts

### Game Controls
- ✅ **F5** - New Game (reload)
- ✅ **F11** - Toggle Fullscreen  
- ✅ **Ctrl+Q** - Quit Game
- ✅ **Ctrl+R** - Reload Game

### Security
- ✅ **Isolated environment** - no internet access required
- ✅ **Bundled assets** - all images included
- ✅ **No external dependencies** on event computers

## 📦 Distribution

### For Events
1. **Single File Distribution**
   - Copy `Naraya Rain Game Setup.exe` to USB drive
   - Run on any Windows computer
   - Creates desktop shortcut automatically

2. **No Installation Required** (Alternative)
   - Use portable build: `npm run build-win --portable`
   - Creates folder with .exe that runs directly

### File Sizes
- **Installer**: ~50-80MB download
- **Installed**: ~150-200MB on disk
- **Portable**: ~200MB folder

## 🛠️ Customization

### Change App Details
Edit `package.json`:
```json
{
  "productName": "Your Game Name",
  "description": "Your description",
  "author": "Your Name"
}
```

### Change Window Size
Edit `electron/main.js`:
```javascript
new BrowserWindow({
    width: 1200,    // Change width
    height: 800,    // Change height
    // ...
});
```

### Change App Icon
Replace `electron/icon.png` with your icon (256x256 PNG recommended)

## 🐛 Troubleshooting

### Build Issues

**"npm not found"**
- Install Node.js from nodejs.org
- Restart terminal/command prompt

**"electron-builder failed"**
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm run build-win` again

**Large file size**
- Normal for Electron apps (includes Chrome browser)
- Consider using `--portable` for slightly smaller size

### Runtime Issues

**Game doesn't load**
- Check that all files in `src/` are present
- Verify image paths are correct
- Use Developer Tools (Ctrl+Shift+I) to check console

**Performance issues**
- Electron uses Chrome engine (should be fast)
- Check if Windows computer meets minimum requirements
- Try fullscreen mode (F11) for better performance

## 🎯 Event Deployment Checklist

- [ ] Test .exe on Windows computer before event
- [ ] Verify all images load correctly  
- [ ] Check fullscreen mode works
- [ ] Test desktop shortcut creation
- [ ] Prepare multiple USB drives with installer
- [ ] Have backup: portable version + web version

## 📞 Support

If you encounter issues:
1. Check the console output during build
2. Verify Node.js version is 16+  
3. Try deleting `node_modules` and reinstalling
4. Test on clean Windows machine

**Ready for your Naraya grand opening event! 🎉**