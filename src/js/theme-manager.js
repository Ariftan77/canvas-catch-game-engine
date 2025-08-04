// Theme Management System - Senior Frontend Engineering Implementation
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = this.initializeThemes();
        this.loadThemeFromStorage();
        this.applyTheme(this.currentTheme);
    }

    initializeThemes() {
        return {
            default: {
                name: 'Classic Naraya',
                description: 'Original Naraya brand colors',
                cssClass: 'theme-default',
                colors: {
                    primary: '#DC143C',
                    secondary: '#8B0000', 
                    accent: '#FFD700',
                    background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                    gameBackground: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)',
                    text: '#FFFFFF',
                    button: '#FFD700',
                    buttonText: '#8B0000'
                },
                particles: {
                    type: 'standard',
                    colors: ['#FFD700', '#DC143C', '#FFFFFF']
                },
                effects: {
                    celebration: false,
                    patriotic: false
                },
                audio: {
                    theme: 'default'
                }
            },
            
            grandOpening: {
                name: 'Grand Opening',
                description: 'Celebration theme for store opening',
                cssClass: 'theme-grand-opening',
                colors: {
                    primary: '#DC143C',      // Naraya brand red (primary brand color)
                    secondary: '#1A1A2E',    // Deep navy (sophistication)
                    accent: '#D4AF37',       // Champagne gold (celebration, premium)
                    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F1419 100%)', // Elegant dark gradient
                    gameBackground: 'linear-gradient(180deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)', // Professional game area
                    text: '#F8F9FA',         // Pure white text (high contrast)
                    button: '#DC143C',       // Naraya red buttons (brand consistency)
                    buttonText: '#FFFFFF',   // White button text (maximum readability)
                    cardBackground: 'rgba(26, 26, 46, 0.95)', // Semi-transparent cards
                    highlight: '#FF6B6B',    // Coral highlight (energy, celebration)
                    success: '#51CF66'       // Success green (achievements)
                },
                backgroundImage: {
                    enabled: true,
                    url: 'assets/images/naraya_icon.png',
                    overlay: 'rgba(26, 26, 46, 0.92)', // Dark overlay for sophistication and readability
                    position: 'center center',
                    size: '150px 150px', // Smaller, repeating pattern
                    repeat: 'repeat',
                    opacity: 0.08 // Very subtle brand watermark effect
                },
                particles: {
                    type: 'confetti',
                    colors: ['#D4AF37', '#DC143C', '#FF6B6B', '#FFFFFF', '#FFD700', '#51CF66']
                },
                effects: {
                    celebration: true,
                    confetti: true,
                    fireworks: true,
                    patriotic: false
                },
                audio: {
                    theme: 'celebration'
                },
                specialText: {
                    title: 'GRAND OPENING',
                    subtitle: 'Celebrate with Naraya!'
                }
            },
            
            indonesia80: {
                name: 'Indonesia 80th Independence',
                description: '80 years of Indonesian independence',
                cssClass: 'theme-indonesia-80',
                colors: {
                    primary: '#FF0000',
                    secondary: '#FFFFFF',
                    accent: '#FFD700',
                    background: 'linear-gradient(180deg, #FF0000 0%, #FFFFFF 50%, #FF0000 100%)',
                    gameBackground: 'linear-gradient(180deg, #FF6B6B 0%, #FFFFFF 50%, #FF6B6B 100%)',
                    text: '#FFFFFF',
                    button: '#FF0000',
                    buttonText: '#FFFFFF'
                },
                backgroundImage: {
                    enabled: true,
                    url: 'src/assets/images/naraya_icon.png',
                    overlay: 'rgba(255, 0, 0, 0.9)', // Red overlay to maintain theme colors
                    position: 'center center',
                    size: '100px 100px',
                    repeat: 'repeat'
                },
                particles: {
                    type: 'patriotic',
                    colors: ['#FF0000', '#FFFFFF', '#FFD700']
                },
                effects: {
                    celebration: true,
                    patriotic: true,
                    flagWave: true,
                    confetti: false
                },
                audio: {
                    theme: 'patriotic'
                },
                specialText: {
                    title: '80 TAHUN MERDEKA',
                    subtitle: 'Dirgahayu Indonesia!'
                }
            }
        };
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found, using default`);
            themeName = 'default';
        }

        const theme = this.themes[themeName];
        this.currentTheme = themeName;

        // Remove all existing theme classes
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        
        // Apply new theme class
        document.body.classList.add(theme.cssClass);

        // Apply CSS custom properties
        this.applyCSSVariables(theme);

        // Apply background image if enabled
        this.applyBackgroundImage(theme);

        // Update UI text if special text exists
        this.updateSpecialText(theme);

        // Store theme preference
        localStorage.setItem('narayaGameTheme', themeName);

        // Trigger theme change event for other systems
        this.dispatchThemeChangeEvent(theme);

        console.log(`✅ Applied theme: ${theme.name}`);
    }

    applyCSSVariables(theme) {
        const root = document.documentElement;
        const colors = theme.colors;

        // Apply all color variables
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-secondary', colors.secondary);
        root.style.setProperty('--theme-accent', colors.accent);
        root.style.setProperty('--theme-background', colors.background);
        root.style.setProperty('--theme-game-background', colors.gameBackground);
        root.style.setProperty('--theme-text', colors.text);
        root.style.setProperty('--theme-button', colors.button);
        root.style.setProperty('--theme-button-text', colors.buttonText);
    }

    applyBackgroundImage(theme) {
        const body = document.body;
        
        if (theme.backgroundImage && theme.backgroundImage.enabled && theme.backgroundImage.url) {
            const bgImage = theme.backgroundImage;
            let backgroundStyle = `url("${bgImage.url}")`;
            
            // Set background properties
            body.style.backgroundImage = backgroundStyle;
            body.style.backgroundPosition = bgImage.position || 'center center';
            body.style.backgroundSize = bgImage.size || 'cover';
            body.style.backgroundRepeat = bgImage.repeat || 'no-repeat';
            body.style.backgroundAttachment = 'fixed';
            
            // Apply overlay if specified
            if (bgImage.overlay) {
                // Create or update overlay element
                let overlay = document.getElementById('theme-background-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'theme-background-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: -1;
                    `;
                    document.body.appendChild(overlay);
                }
                overlay.style.background = bgImage.overlay;
            }
        } else {
            // Remove background image and overlay
            body.style.backgroundImage = '';
            body.style.backgroundBlendMode = '';
            body.style.backgroundColor = '';
            const overlay = document.getElementById('theme-background-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    updateSpecialText(theme) {
        if (theme.specialText) {
            const titleElement = document.querySelector('.game-title');
            const subtitleElement = document.querySelector('.game-subtitle');
            
            if (titleElement && theme.specialText.title) {
                titleElement.textContent = theme.specialText.title;
            }
            
            if (subtitleElement && theme.specialText.subtitle) {
                subtitleElement.textContent = theme.specialText.subtitle;
            }
        } else {
            // Reset to default text
            const titleElement = document.querySelector('.game-title');
            const subtitleElement = document.querySelector('.game-subtitle');
            
            if (titleElement) {
                titleElement.textContent = 'NARAYA RAIN';
            }
            
            if (subtitleElement) {
                subtitleElement.textContent = 'Catch the Refreshment!';
            }
        }
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                themeName: this.currentTheme,
                theme: theme
            }
        });
        document.dispatchEvent(event);
    }

    loadThemeFromStorage() {
        const savedTheme = localStorage.getItem('narayaGameTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
    }

    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            name: this.themes[key].name,
            description: this.themes[key].description
        }));
    }

    switchTheme(themeName) {
        this.applyTheme(themeName);
        
        // If game exists, update particle system
        if (window.game && window.game.particles) {
            window.game.particles.updateTheme(this.getCurrentTheme());
        }

        return this.getCurrentTheme();
    }

    // Utility method for particle system integration
    getThemeParticleConfig() {
        return this.getCurrentTheme().particles;
    }

    // Utility method for effects integration
    getThemeEffects() {
        return this.getCurrentTheme().effects;
    }
}

// Global theme manager instance
window.themeManager = new ThemeManager();

// Theme switching functions for UI
function switchToTheme(themeName) {
    const result = window.themeManager.switchTheme(themeName);
    updateThemeButtonStates(themeName);
    return result;
}

function updateThemeButtonStates(activeTheme) {
    // Remove active class from all theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current theme button
    const activeButton = document.getElementById(`theme-${activeTheme}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function getCurrentTheme() {
    return window.themeManager.getCurrentTheme();
}

function getAvailableThemes() {
    return window.themeManager.getAvailableThemes();
}

// Initialize theme button states when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.themeManager) {
        updateThemeButtonStates(window.themeManager.currentTheme);
    }
});