// Particle System for Visual Effects
class ParticleSystem {
    constructor() {
        this.particles = [];
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
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}