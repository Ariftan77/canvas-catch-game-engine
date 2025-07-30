// Electron preload script for enhanced security
// This file runs in the renderer process before the web content loads

const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Platform information
    platform: process.platform,
    
    // Version information
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    
    // Game-specific APIs
    game: {
        // Trigger app quit
        quit: () => ipcRenderer.invoke('app-quit'),
        
        // Show about dialog
        showAbout: () => ipcRenderer.invoke('show-about'),
        
        // Toggle fullscreen
        toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen')
    }
});

// Console log for debugging
console.log('Naraya Rain Electron preload loaded successfully');