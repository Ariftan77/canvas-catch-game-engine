// Game Entities
class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.updateSize();
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = CONFIG.PLAYER_SPEED;
        this.targetX = this.x;
    }

    updateSize() {
        // Responsive sizing based on screen dimensions (10% smaller than before)
        const isVertical = this.canvas.height > this.canvas.width;
        const isMobile = this.canvas.width < 768;
        
        if (isVertical && isMobile) {
            // Mobile portrait - smaller bucket (was 80, now 72)
            this.width = 72;
            this.height = 72;
        } else if (isMobile) {
            // Mobile landscape - medium bucket (was 100, now 90)
            this.width = 90;
            this.height = 90;
        } else {
            // Desktop - full size bucket (was 120, now 108)
            this.width = 108;
            this.height = 108;
        }
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

        // Try to get the naraya bucket image based on score
        const currentScore = game && game.gameState ? game.gameState.score : 0;
        const bucketImage = currentScore >= 300 ? 'naraya_bucket_300.png' : 'naraya_bucket.png';
        const iconImage = imageLoader ? imageLoader.getImage(bucketImage) : null;
        
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