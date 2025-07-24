// Audio Manager
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.audioContext = null;
        this.createSounds();
    }

    createSounds() {
        // Initialize audio context on first user interaction
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio not supported');
                this.enabled = false;
                return;
            }
        }

        // Simple sound synthesis
        this.sounds = {
            catch: () => this.playTone(523.25, 0.1, 'square'), // C5
            goldenCatch: () => this.playTone(659.25, 0.2, 'sine'), // E5
            powerUp: () => this.playTone(783.99, 0.3, 'triangle'), // G5
            miss: () => this.playTone(196, 0.2, 'sawtooth'), // G3
            gameOver: () => this.playTone(130.81, 0.5, 'sine') // C3
        };
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio playback error:', e);
        }
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}