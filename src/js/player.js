// Game Entities
class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 120;  // Larger to show the Naraya icon better
        this.height = 120; // Square to maintain icon proportions
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = CONFIG.PLAYER_SPEED;
        this.targetX = this.x;
    }

    update(input) {
        // Calculate speed with power-up
        let currentSpeed = this.speed;
        if (game && game.gameState.powerUps.speedBoost.active) {
            currentSpeed *= 2.0; // Double speed (100% increase)
        }

        // Smooth movement towards target
        const dx = this.targetX - this.x;
        if (Math.abs(dx) > 1) {
            this.x += dx * 0.15;
        } else {
            this.x = this.targetX;
        }

        // Handle input with power-up speed
        if (input.left && this.targetX > 0) {
            this.targetX -= currentSpeed;
        }
        if (input.right && this.targetX < this.canvas.width - this.width) {
            this.targetX += currentSpeed;
        }

        // Keep in bounds
        this.targetX = Math.max(0, Math.min(this.canvas.width - this.width, this.targetX));
        this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
    }

    draw(ctx, imageLoader) {
        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 3;

        // Try to get the naraya icon image
        const iconImage = imageLoader ? imageLoader.getImage('naraya_icon.png') : null;
        
        if (iconImage) {
            // Draw the Naraya icon as the player
            ctx.drawImage(
                iconImage,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // Fallback to basket drawing if image not loaded
            this.drawFallbackBasket(ctx);
        }

        ctx.shadowColor = 'transparent';
    }

    drawFallbackBasket(ctx) {
        // Basket body
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#5D4037');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Basket rim
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, 8);

        // Basket pattern
        ctx.strokeStyle = '#4A2C2A';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const lineY = this.y + (i + 1) * (this.height / 4);
            ctx.beginPath();
            ctx.moveTo(this.x + 5, lineY);
            ctx.lineTo(this.x + this.width - 5, lineY);
            ctx.stroke();
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
}