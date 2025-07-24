// Leaderboard Management Functions
function saveScore() {
    const name = document.getElementById('playerName').value.trim();
    const playerName = name.length > 0 ? name : 'No Name';
    
    game.addScore(playerName, game.gameState.score);
    
    // Hide game over screen and show leaderboard modal
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
}

function playAgain() {
    // Auto-save score first
    const name = document.getElementById('playerName').value.trim();
    const playerName = name.length > 0 ? name : 'No Name';
    
    game.addScore(playerName, game.gameState.score);
    
    // Then restart game immediately
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame();
}

function discardAndRestart() {
    // Don't save score, just restart
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame();
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame();
}

function closeLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
}

function toggleLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const startScreen = document.getElementById('startScreen');
    
    if (leaderboard.style.display === 'none') {
        leaderboard.style.display = 'block';
        startScreen.style.display = 'none';
    } else {
        leaderboard.style.display = 'none';
        startScreen.style.display = 'flex';
    }
}

function adminReset() {
    console.log('Admin reset button clicked'); // Debug log
    
    const code = prompt('Please enter a code to reset the leaderboard:');
    console.log('Code entered:', code); // Debug log
    
    if (code === 'reset') {
        if (confirm('Are you sure you want to reset ALL scores? This cannot be undone!')) {
            // Initialize game if it doesn't exist
            if (!game) {
                game = new NarayaRainGame();
            }
            
            game.leaderboard = [];
            game.saveLeaderboard();
            alert('Leaderboard has been reset successfully.');
            console.log('Leaderboard reset completed'); // Debug log
        }
    } else if (code !== null && code !== '') {
        alert('Incorrect code. Please try again.');
    }
}

function resetLeaderboard() {
    // This function is now hidden - adminReset handles the logic
    adminReset();
}