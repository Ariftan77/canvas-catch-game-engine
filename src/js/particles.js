// Enhanced Particle System for Visual Effects with Theme Support
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.backgroundParticles = [];
        this.currentTheme = null;
        this.lastBackgroundSpawn = 0;
        this.updateTheme();
    }

    updateTheme(theme = null) {
        this.currentTheme = theme || (window.themeManager ? window.themeManager.getCurrentTheme() : null);
        
        // Clear existing background particles when theme changes
        this.backgroundParticles = [];
    }

    createExplosion(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 4 + 2
            });
        }
    }

    update() {
        // Update regular particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // gravity
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update background particles
        this.updateBackgroundParticles();
        
        // Spawn themed background particles
        this.spawnBackgroundParticles();
    }

    updateBackgroundParticles() {
        for (let i = this.backgroundParticles.length - 1; i >= 0; i--) {
            const particle = this.backgroundParticles[i];
            
            if (particle.type === 'confetti') {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.15; // lighter gravity for confetti
                particle.rotation += particle.rotationSpeed;
                particle.life -= particle.decay;
            } else if (particle.type === 'patriotic') {
                particle.y += particle.vy;
                particle.x += Math.sin(particle.y * 0.01) * 0.5; // gentle wave motion
                particle.life -= particle.decay;
            }

            if (particle.life <= 0 || particle.y > window.innerHeight + 50) {
                this.backgroundParticles.splice(i, 1);
            }
        }
    }

    spawnBackgroundParticles() {
        if (!this.currentTheme || !this.currentTheme.effects) return;
        
        const now = Date.now();
        if (now - this.lastBackgroundSpawn < 500) return; // Spawn every 500ms
        
        this.lastBackgroundSpawn = now;

        if (this.currentTheme.effects.confetti) {
            this.createConfettiParticle();
        }
        
        if (this.currentTheme.effects.patriotic) {
            this.createPatrioticParticle();
        }
    }

    createConfettiParticle() {
        const colors = this.currentTheme.particles.colors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.backgroundParticles.push({
            type: 'confetti',
            x: Math.random() * window.innerWidth,
            y: -20,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            color: color,
            life: 1.0,
            decay: 0.003,
            size: Math.random() * 8 + 4,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }

    createPatrioticParticle() {
        const colors = ['#FF0000', '#FFFFFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.backgroundParticles.push({
            type: 'patriotic',
            x: Math.random() * window.innerWidth,
            y: -20,
            vy: Math.random() * 1 + 0.5,
            color: color,
            life: 1.0,
            decay: 0.002,
            size: Math.random() * 6 + 3
        });
    }

    draw(ctx) {
        ctx.save();
        
        // Draw background particles first
        this.backgroundParticles.forEach(particle => {
            ctx.globalAlpha = particle.life * 0.7; // More transparent for background
            ctx.fillStyle = particle.color;
            
            if (particle.type === 'confetti') {
                // Draw rectangular confetti with rotation
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillRect(-particle.size/2, -particle.size/4, particle.size, particle.size/2);
                ctx.restore();
            } else {
                // Draw circular particles
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw regular explosion particles
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }

    // Enhanced explosion for themed effects
    createThemedExplosion(x, y, count = 8) {
        if (!this.currentTheme) {
            this.createExplosion(x, y, '#FFD700', count);
            return;
        }

        const colors = this.currentTheme.particles.colors;
        
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                color: color,
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 5 + 3
            });
        }

        // Special effects for themes
        if (this.currentTheme.effects.celebration) {
            this.createCelebrationBurst(x, y);
        }
    }

    createCelebrationBurst(x, y) {
        // Create a burst of sparkles
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(i * Math.PI / 3) * 8,
                vy: Math.sin(i * Math.PI / 3) * 8,
                color: '#FFD700',
                life: 1.2,
                decay: 0.015,
                size: 4
            });
        }
    }

    // Fireworks effect for special moments
    createFireworks(x, y) {
        const colors = this.currentTheme ? this.currentTheme.particles.colors : ['#FFD700', '#FF0000', '#FFFFFF'];
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = Math.random() * 6 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 1.5,
                decay: 0.01,
                size: Math.random() * 4 + 2
            });
        }
    }
}