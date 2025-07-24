class FallingItem {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.width = 40;
        this.height = 60;
        this.speed = CONFIG.ITEM_FALL_SPEED;
        this.type = 'normal'; // normal, golden, competitor, powerup
        this.powerUpType = null;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
        this.active = true;
    }

    spawn(canvasWidth) {
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.active = true;
        
        // Determine item type
        const rand = Math.random();
        if (rand < CONFIG.COMPETITOR_CHANCE) {
            this.type = 'competitor';
            this.width = 35;
            this.height = 55;
        } else if (rand < CONFIG.COMPETITOR_CHANCE + CONFIG.GOLDEN_CAN_CHANCE) {
            this.type = 'golden';
            this.rotationSpeed = 0.15;
        } else if (rand < CONFIG.COMPETITOR_CHANCE + CONFIG.GOLDEN_CAN_CHANCE + CONFIG.POWER_UP_CHANCE) {
            this.type = 'powerup';
            this.powerUpType = Math.random() < 0.5 ? 'speedBoost' : 'multiplyPoints';
            this.width = 35;
            this.height = 35;
            this.rotationSpeed = 0.2;
        } else {
            this.type = 'normal';
        }
    }

    update(gameState) {
        if (!this.active) return false;

        // Normal falling speed (no slow time effect)
        this.y += this.speed;
        this.rotation += this.rotationSpeed;

        // Remove if off screen
        if (this.y > 700) {
            if (this.type === 'normal' || this.type === 'golden') {
                gameState.statistics.missedCans++;
                gameState.updateCombo(false);
            }
            return false;
        }

        return true;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);

        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        switch (this.type) {
            case 'normal':
                this.drawNormalCan(ctx);
                break;
            case 'golden':
                this.drawGoldenCan(ctx);
                break;
            case 'competitor':
                this.drawCompetitorProduct(ctx);
                break;
            case 'powerup':
                this.drawPowerUp(ctx);
                break;
        }

        ctx.restore();
    }

    drawNormalCan(ctx) {
        // Naraya can - red with silver
        const gradient = ctx.createLinearGradient(-this.width/2, -this.height/2, this.width/2, this.height/2);
        gradient.addColorStop(0, '#FF4500');
        gradient.addColorStop(0.5, '#DC143C');
        gradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Can details
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, 8);
        ctx.fillRect(-this.width/2, this.height/2 - 8, this.width, 8);

        // Naraya label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NARAYA', 0, -5);
        ctx.fillText('DRINK', 0, 8);
    }

    drawGoldenCan(ctx) {
        // Golden special can
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Sparkle effect
        ctx.fillStyle = 'white';
        const sparkles = [
            [-10, -15], [8, -20], [-5, 0], [12, 5], [-8, 15]
        ];
        sparkles.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Golden label
        ctx.fillStyle = '#8B0000';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GOLDEN', 0, -5);
        ctx.fillText('NARAYA', 0, 8);
    }

    drawCompetitorProduct(ctx) {
        // Competitor product - different colors
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // X mark to indicate avoid
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-this.width/3, -this.height/3);
        ctx.lineTo(this.width/3, this.height/3);
        ctx.moveTo(this.width/3, -this.height/3);
        ctx.lineTo(-this.width/3, this.height/3);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AVOID', 0, 0);
    }

    drawPowerUp(ctx) {
        if (this.powerUpType === 'multiplyPoints') {
            // 2X Multiplier - 3D "2X" text
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
            gradient.addColorStop(0, '#FF69B4');
            gradient.addColorStop(0.7, '#FF1493');
            gradient.addColorStop(1, '#C71585');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();

            // 3D effect for "2X" text
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Shadow/depth effect
            ctx.fillStyle = '#8B0000';
            ctx.fillText('2X', 2, 2);
            ctx.fillStyle = '#4B0000';
            ctx.fillText('2X', 1, 1);
            
            // Main text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('2X', 0, 0);
            
        } else if (this.powerUpType === 'speedBoost') {
            // Speed Boost - Clock with speed indication
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
            gradient.addColorStop(0, '#00CED1');
            gradient.addColorStop(0.7, '#00BFFF');
            gradient.addColorStop(1, '#0080FF');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();

            // Clock face
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2 - 3, 0, Math.PI * 2);
            ctx.stroke();

            // Clock hands pointing to speed (like speedometer)
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            
            // Hour hand (short)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-3, -8);
            ctx.stroke();
            
            // Minute hand (long) - pointing up-right for "fast"
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(6, -10);
            ctx.stroke();

            // Speed lines around clock for motion effect
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const x1 = Math.cos(angle) * (this.width/2 + 2);
                const y1 = Math.sin(angle) * (this.width/2 + 2);
                const x2 = Math.cos(angle) * (this.width/2 + 6);
                const y2 = Math.sin(angle) * (this.width/2 + 6);
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            // Center dot
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    checkCollision(player) {
        const playerBounds = player.getBounds();
        const itemBounds = this.getBounds();

        return itemBounds.x < playerBounds.x + playerBounds.width &&
               itemBounds.x + itemBounds.width > playerBounds.x &&
               itemBounds.y < playerBounds.y + playerBounds.height &&
               itemBounds.y + itemBounds.height > playerBounds.y;
    }
}