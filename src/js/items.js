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
        this.type = 'normal';
        this.productConfig = null;
        this.powerUpType = null;
        this.rotation = 0;
        this.rotationSpeed = 0.2;
        this.active = true;
    }

    getResponsiveDimensions(canvasWidth, canvasHeight) {
        // Base dimensions from product config
        const baseWidth = this.productConfig?.width || 40;
        const baseHeight = this.productConfig?.height || 60;
        
        // Scale items to match square bucket scaling for consistent gameplay
        const isVertical = canvasHeight > canvasWidth;
        const isMobile = canvasWidth < 768;
        
        let scaleFactor = 1.0;
        
        if (isVertical && isMobile) {
            // Mobile portrait - scale down to match 72px square bucket
            scaleFactor = 72 / 108; // ~0.67
        } else if (isMobile) {
            // Mobile landscape - scale down to match 90px square bucket  
            scaleFactor = 90 / 108; // ~0.83
        } else {
            // Desktop - full size to match 108px square bucket
            scaleFactor = 1.0;
        }
        
        return {
            width: Math.round(baseWidth * scaleFactor),
            height: Math.round(baseHeight * scaleFactor)
        };
    }

    spawn(canvasWidth, canvasHeight) {
        this.active = true;
        
        // Get random product from weighted configuration
        this.productConfig = PRODUCT_CONFIG.getRandomProduct();
        this.type = this.productConfig.type;
        
        // Set responsive dimensions based on screen size
        const responsiveDimensions = this.getResponsiveDimensions(canvasWidth, canvasHeight);
        this.width = responsiveDimensions.width;
        this.height = responsiveDimensions.height;
        
        // Position randomly across canvas width
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        
        // Set rotation speed based on type (disabled for better product visibility)
        switch (this.type) {
            case 'golden':
                this.rotationSpeed = 0; // Disabled - keep products upright
                break;
            case 'powerup':
                this.powerUpType = this.productConfig.id;
                this.rotationSpeed = 0.1; // Keep slight rotation for power-ups to distinguish them
                break;
            case 'premium':
                this.rotationSpeed = 0.05; // Disabled - keep products upright
                break;
            default:
                this.rotationSpeed = 0.05; // Disabled - keep products upright
                break;
        }
    }

    update(gameState) {
        if (!this.active) return false;

        // Normal falling speed (no slow time effect)
        this.y += this.speed;
        this.rotation += this.rotationSpeed;

        // Remove if off screen - use dynamic canvas height instead of hardcoded 700
        const canvas = document.getElementById('gameCanvas');
        const canvasHeight = canvas ? canvas.height : 700;
        
        if (this.y > canvasHeight + 50) { // Add 50px buffer to ensure items reach bottom
            if (this.type === 'normal' || this.type === 'golden' || this.type === 'premium') {
                gameState.statistics.missedCans++;
                gameState.updateCombo(false);
            }
            return false;
        }

        return true;
    }

    draw(ctx, imageLoader) {
        if (!this.active || !this.productConfig) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);

        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        if (this.type === 'powerup') {
            this.drawPowerUp(ctx);
        } else {
            this.drawProductImage(ctx, imageLoader);
        }

        ctx.restore();
    }

    drawProductImage(ctx, imageLoader) {
        const image = imageLoader.getImage(this.productConfig.image);
        
        if (image) {
            // Draw the actual product image
            ctx.drawImage(
                image,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
            
            // Add special effects for golden items
            if (this.type === 'golden') {
                this.addGoldenEffect(ctx);
            }
        } else {
            // Fallback to colored rectangle if image fails
            this.drawFallbackProduct(ctx);
        }
    }

    addGoldenEffect(ctx) {
        // Golden glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Sparkle effect
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        const sparkles = [
            [-this.width/3, -this.height/3],
            [this.width/4, -this.height/4],
            [-this.width/4, this.height/4],
            [this.width/3, this.height/3]
        ];
        sparkles.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawFallbackProduct(ctx) {
        // Fallback colored rectangle based on product type
        const colors = {
            'normal': '#DC143C',
            'premium': '#8B0000',
            'golden': '#FFD700'
        };
        
        ctx.fillStyle = colors[this.type] || '#DC143C';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Product name - responsive font size
        ctx.fillStyle = 'white';
        const fontSize = Math.max(6, Math.min(8, this.width * 0.2));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.productConfig.id.slice(0, 8), 0, 0);
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

        // Naraya label - responsive font size
        ctx.fillStyle = 'white';
        const fontSize = Math.max(6, Math.min(10, this.width * 0.25));
        ctx.font = `bold ${fontSize}px Arial`;
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

        // Golden label - responsive font size
        ctx.fillStyle = '#8B0000';
        const fontSize = Math.max(6, Math.min(9, this.width * 0.225));
        ctx.font = `bold ${fontSize}px Arial`;
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
        const fontSize = Math.max(6, Math.min(8, this.width * 0.2));
        ctx.font = `bold ${fontSize}px Arial`;
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

            // 3D effect for "2X" text - responsive font size
            const fontSize = Math.max(12, Math.min(18, this.width * 0.45));
            ctx.font = `bold ${fontSize}px Arial`;
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

        // Simple AABB collision detection with minimal tolerance
        const tolerance = 5; // Fixed 5px tolerance for all screen sizes
        
        return (itemBounds.x + tolerance < playerBounds.x + playerBounds.width &&
                itemBounds.x + itemBounds.width - tolerance > playerBounds.x &&
                itemBounds.y + tolerance < playerBounds.y + playerBounds.height &&
                itemBounds.y + itemBounds.height - tolerance > playerBounds.y);
    }
}