let score = 0;
let record = 0;
let gameActive = true;
const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies');

// Основний ігровий цикл
function gameLoop() {
    if (!gameActive) return;
    
    score++;
    document.getElementById('time').textContent = score;
    
    // Генерація ворогів
    if (Math.random() < 0.02) {
        spawnEnemy();
    }
    
    requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.innerHTML = '👨<span class="knife">🔪</span>';
    enemiesContainer.appendChild(enemy);
    
    let pos = 100;
    const moveInterval = setInterval(() => {
        pos -= 5;
        enemy.style.left = pos + 'px';
        
        // Перевірка зіткнення
        if (pos < 50 && pos > 30) {
            endGame();
            clearInterval(moveInterval);
        }
        
        if (pos < 0) {
            enemy.remove();
            clearInterval(moveInterval);
        }
    }, 50);
}

function endGame() {
    gameActive = false;
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    
    // Відправка результату на сервер
    fetch('/save_score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: Telegram.WebApp.initDataUnsafe.user?.id || 0,
            score: score
        })
    });
}

function restart() {
    score = 0;
    gameActive = true;
    document.getElementById('game-over').style.display = 'none';
    enemiesContainer.innerHTML = '';
    gameLoop();
}

// Початок гри
Telegram.WebApp.ready();
gameLoop();