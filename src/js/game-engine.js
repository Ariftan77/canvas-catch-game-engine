// Game State Management
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.isPlaying = false;
        this.isPaused = false;
        this.combo = 0;
        this.maxCombo = 0;
        this.powerUps = {
            speedBoost: { active: false, endTime: 0 },
            multiplyPoints: { active: false, endTime: 0 }
        };
        this.statistics = {
            cansHit: 0,
            goldenCansHit: 0,
            competitorHits: 0,
            missedCans: 0
        };
    }

    updatePowerUps(currentTime) {
        Object.keys(this.powerUps).forEach(powerUp => {
            if (this.powerUps[powerUp].active && currentTime > this.powerUps[powerUp].endTime) {
                this.powerUps[powerUp].active = false;
            }
        });
        this.updatePowerUpDisplay();
    }

    activatePowerUp(type, duration) {
        this.powerUps[type].active = true;
        this.powerUps[type].endTime = Date.now() + duration;
        
        const messages = {
            speedBoost: 'SPEED BOOST!',
            multiplyPoints: '2X MULTIPLIER!'
        };
        this.showPowerUpIndicator(messages[type]);
        this.updatePowerUpDisplay();
    }

    updatePowerUpDisplay() {
        const display = document.getElementById('powerUpsDisplay');
        const currentTime = Date.now();
        let html = '';

        if (this.powerUps.multiplyPoints.active) {
            const remaining = Math.ceil((this.powerUps.multiplyPoints.endTime - currentTime) / 1000);
            html += `<div class="power-up-item multiplier">2X Multi: ${remaining}s</div>`;
        }

        if (this.powerUps.speedBoost.active) {
            const remaining = Math.ceil((this.powerUps.speedBoost.endTime - currentTime) / 1000);
            html += `<div class="power-up-item speed">⏱️ Speed: ${remaining}s</div>`;
        }

        display.innerHTML = html;
    }

    showPowerUpIndicator(message) {
        const indicator = document.getElementById('powerUpIndicator');
        indicator.textContent = message;
        if (message) {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 2000);
        } else {
            indicator.style.opacity = '0';
        }
    }

    addScore(points) {
        let finalPoints = points;
        
        // Apply 2x multiplier power-up
        if (this.powerUps.multiplyPoints.active && points > 0) {
            finalPoints *= 2;
        }
        
        // Apply combo multiplier
        if (this.combo >= CONFIG.COMBO_THRESHOLD && points > 0) {
            finalPoints = Math.floor(finalPoints * CONFIG.SCORING.COMBO_MULTIPLIER);
        }
        
        this.score = Math.max(0, this.score + finalPoints);
        this.updateScoreDisplay();
        
        return finalPoints;
    }

    updateCombo(hit) {
        if (hit) {
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            if (this.combo >= CONFIG.COMBO_THRESHOLD) {
                this.showComboIndicator(`${this.combo}x COMBO!`);
            }
        } else {
            this.combo = 0;
        }
    }

    showComboIndicator(text) {
        const indicator = document.getElementById('comboIndicator');
        indicator.textContent = text;
        indicator.style.opacity = '1';
        indicator.style.transform = 'translate(-50%, -50%) scale(1.2)';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 1000);
    }

    updateScoreDisplay() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateTimerDisplay() {
        const seconds = Math.ceil(this.timeLeft / 1000);
        document.getElementById('timeLeft').textContent = seconds;
        
        // Visual timer warning
        const timerElement = document.getElementById('timeLeft');
        if (seconds <= 5) {
            timerElement.style.color = '#FF4500';
            timerElement.style.animation = 'pulse 0.5s infinite';
        } else {
            timerElement.style.color = 'white';
            timerElement.style.animation = 'none';
        }
    }
}

// Object Pool for Performance Optimization
class ObjectPool {
    constructor(createFn, resetFn, maxSize = 50) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        this.maxSize = maxSize;
    }

    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            if (this.pool.length < this.maxSize) {
                this.pool.push(obj);
            }
        }
    }

    releaseAll() {
        while (this.active.length > 0) {
            this.release(this.active[0]);
        }
    }

    getActiveObjects() {
        return this.active;
    }
}

// Input Management
class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        document.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    getInput() {
        return {
            left: this.keys['ArrowLeft'] || this.keys['KeyA'],
            right: this.keys['ArrowRight'] || this.keys['KeyD'],
            mouse: this.mouse
        };
    }
}

// Main Game Engine
class NarayaRainGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = new GameState();
        this.input = new InputManager();
        this.audio = new AudioManager();
        this.particles = new ParticleSystem();
        
        this.player = new Player(this.canvas);
        this.itemPool = new ObjectPool(
            () => new FallingItem(),
            (item) => item.reset()
        );
        
        this.lastSpawnTime = 0;
        this.lastFrameTime = 0;
        this.animationId = null;
        
        this.setupMouseControl();
        this.loadLeaderboard();
    }

    setupMouseControl() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.gameState.isPlaying) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            this.player.targetX = mouseX - this.player.width / 2;
        });
    }

    start() {
        this.gameState.reset();
        this.gameState.isPlaying = true;
        this.itemPool.releaseAll();
        this.particles.particles = [];
        
        // Reset UI displays
        this.gameState.updateScoreDisplay();
        this.gameState.updateTimerDisplay();
        
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('leaderboard').style.display = 'none';
        
        this.audio.resume();
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        if (this.gameState.isPlaying && !this.gameState.isPaused) {
            this.update(deltaTime);
        }
        
        this.draw();
        
        if (this.gameState.isPlaying) {
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    }

    update(deltaTime) {
        // Update game timer
        this.gameState.timeLeft -= deltaTime;
        this.gameState.updateTimerDisplay();
        
        if (this.gameState.timeLeft <= 0) {
            this.endGame();
            return;
        }

        // Update power-ups
        this.gameState.updatePowerUps(Date.now());

        // Update player
        const input = this.input.getInput();
        this.player.update(input);

        // Spawn items
        const currentTimeMs = performance.now();
        if (currentTimeMs - this.lastSpawnTime > 1000 / (CONFIG.ITEM_SPAWN_RATE * 60)) {
            if (Math.random() < CONFIG.ITEM_SPAWN_RATE) {
                const item = this.itemPool.get();
                item.spawn(this.canvas.width);
                this.lastSpawnTime = currentTimeMs;
            }
        }

        // Update items and check collisions
        const activeItems = this.itemPool.getActiveObjects();
        for (let i = activeItems.length - 1; i >= 0; i--) {
            const item = activeItems[i];
            
            if (!item.update(this.gameState)) {
                this.itemPool.release(item);
                continue;
            }

            // Check collision with player
            if (item.checkCollision(this.player)) {
                this.handleItemCatch(item);
                this.itemPool.release(item);
            }
        }

        // Update particles
        this.particles.update();
    }

    handleItemCatch(item) {
        let points = 0;
        let comboHit = false;

        switch (item.type) {
            case 'normal':
                points = CONFIG.SCORING.NORMAL_CAN;
                comboHit = true;
                this.gameState.statistics.cansHit++;
                this.audio.play('catch');
                this.particles.createExplosion(
                    item.x + item.width/2, 
                    item.y + item.height/2, 
                    '#FFD700', 6
                );
                break;

            case 'golden':
                points = CONFIG.SCORING.GOLDEN_CAN;
                comboHit = true;
                this.gameState.statistics.goldenCansHit++;
                this.audio.play('goldenCatch');
                this.particles.createExplosion(
                    item.x + item.width/2, 
                    item.y + item.height/2, 
                    '#FFD700', 12
                );
                break;

            case 'competitor':
                points = CONFIG.SCORING.COMPETITOR_PENALTY;
                comboHit = false;
                this.gameState.statistics.competitorHits++;
                this.audio.play('miss');
                this.particles.createExplosion(
                    item.x + item.width/2, 
                    item.y + item.height/2, 
                    '#FF0000', 8
                );
                break;

            case 'powerup':
                this.gameState.activatePowerUp(
                    item.powerUpType, 
                    CONFIG.POWER_UPS[item.powerUpType.toUpperCase() + '_DURATION']
                );
                this.audio.play('powerUp');
                this.particles.createExplosion(
                    item.x + item.width/2, 
                    item.y + item.height/2, 
                    '#00FFFF', 10
                );
                break;
        }

        this.gameState.updateCombo(comboHit);
        if (points !== 0) {
            this.gameState.addScore(points);
        }
    }

    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game objects
        this.player.draw(this.ctx);
        
        this.itemPool.getActiveObjects().forEach(item => {
            item.draw(this.ctx);
        });

        this.particles.draw(this.ctx);
    }

    endGame() {
        this.gameState.isPlaying = false;
        this.audio.play('gameOver');
        
        // Calculate performance message
        const score = this.gameState.score;
        let message = 'Great job!';
        
        if (score >= 1000) message = 'AMAZING! You\'re a Naraya Master!';
        else if (score >= 500) message = 'Excellent! You\'ve got great reflexes!';
        else if (score >= 200) message = 'Good job! Keep practicing!';
        else if (score >= 50) message = 'Not bad! Try again for a higher score!';
        else message = 'Keep trying! You\'ll get better!';

        document.getElementById('finalScore').textContent = score;
        document.getElementById('performanceMessage').textContent = message;
        document.getElementById('gameOverScreen').style.display = 'flex';
        
        // Hide discard button for completed games
        document.getElementById('discardBtn').style.display = 'none';
        
        // Clear name input for fresh start
        document.getElementById('playerName').value = '';
        document.getElementById('playerName').focus();
    }

    pauseGame() {
        if (!this.gameState.isPlaying) return;
        
        this.gameState.isPlaying = false;
        this.audio.play('gameOver');
        
        // Show pause/cancel message with different options
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('performanceMessage').textContent = 'Game Cancelled - Choose your action:';
        document.getElementById('gameOverScreen').style.display = 'flex';
        
        // Show discard button for cancelled games
        document.getElementById('discardBtn').style.display = 'inline-block';
        
        // Clear name input
        document.getElementById('playerName').value = '';
        document.getElementById('playerName').focus();
    }

    // Leaderboard Management
    loadLeaderboard() {
        const saved = localStorage.getItem('narayaRainLeaderboard');
        this.leaderboard = saved ? JSON.parse(saved) : [];
        this.updateLeaderboardDisplay();
    }

    saveLeaderboard() {
        localStorage.setItem('narayaRainLeaderboard', JSON.stringify(this.leaderboard));
        this.updateLeaderboardDisplay();
    }

    addScore(name, score) {
        this.leaderboard.push({ name: name || 'Anonymous', score, date: Date.now() });
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10); // Keep only top 10
        this.saveLeaderboard();
    }

    updateLeaderboardDisplay() {
        const list = document.getElementById('leaderboardList');
        if (this.leaderboard.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">No scores yet!<br>Be the first to play!</div>';
            return;
        }

        // Show only top 10, but ensure we're displaying exactly what we have
        const topScores = this.leaderboard.slice(0, 10);
        list.innerHTML = topScores.map((entry, index) => `
            <div class="leaderboard-entry">
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${entry.name}</span>
                <span class="player-score">${entry.score}</span>
            </div>
        `).join('');
    }

    resetLeaderboard() {
        // Remove the confirm dialog - security is handled by adminReset function
        this.leaderboard = [];
        this.saveLeaderboard();
    }
}

// Global game instance
let game;

// Game control functions
function startGame() {
    if (!game) {
        game = new NarayaRainGame();
    }
    game.start();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC key to pause/stop game
        if (e.code === 'Escape') {
            e.preventDefault();
            if (game && game.gameState.isPlaying) {
                game.pauseGame();
            }
        }
        
        if (e.code === 'Space') {
            e.preventDefault();
            const startScreen = document.getElementById('startScreen');
            const gameOverScreen = document.getElementById('gameOverScreen');
            
            if (startScreen.style.display !== 'none') {
                startGame();
            } else if (gameOverScreen.style.display !== 'none') {
                playAgain();
            }
        }
        
        if (e.code === 'Enter') {
            const gameOverScreen = document.getElementById('gameOverScreen');
            if (gameOverScreen.style.display !== 'none') {
                saveScore();
            }
        }
    });

    console.log('Naraya Rain Game initialized - Senior Engineer Implementation');
    console.log('Features: Object pooling, particle system, power-ups, combo system');
    console.log('Press SPACE to start, Enter to save score');
});