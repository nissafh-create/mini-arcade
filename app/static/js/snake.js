// Classic Snake Game
window.initGame = function(container, options) {
  const GRID_SIZE = 20;
  const CELL_COUNT = 18;
  const WIDTH = GRID_SIZE * CELL_COUNT;

  let snake = [];
  let food = { x: 0, y: 0 };
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let score = 0;
  let gameInterval = null;
  let running = false;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1rem;">
      <canvas id="snake-canvas" width="${WIDTH}" height="${WIDTH}" style="
        background: #020617; border: 2px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
      "></canvas>
      <div id="snake-overlay" style="font-weight:600; font-size:1.1rem; color:var(--text-muted); min-height:1.6rem;">Press Start or Space to play!</div>
      
      <!-- Directional Controls for Mobile / Touch -->
      <div style="display:grid; grid-template-columns:repeat(3, 50px); gap:6px; margin: 0.25rem 0;">
        <div></div>
        <button class="btn btn-secondary" id="ctrl-up" style="padding:0.75rem;">⬆️</button>
        <div></div>
        <button class="btn btn-secondary" id="ctrl-left" style="padding:0.75rem;">⬅️</button>
        <button class="btn btn-secondary" id="ctrl-down" style="padding:0.75rem;">⬇️</button>
        <button class="btn btn-secondary" id="ctrl-right" style="padding:0.75rem;">➡️</button>
      </div>

      <div style="display:flex; gap:0.75rem;">
        <button id="snake-start" class="btn btn-primary">Start Game</button>
      </div>
    </div>
  `;

  const canvas = container.querySelector("#snake-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = container.querySelector("#snake-overlay");
  const startBtn = container.querySelector("#snake-start");

  function spawnFood() {
    let valid = false;
    while (!valid) {
      food.x = Math.floor(Math.random() * CELL_COUNT);
      food.y = Math.floor(Math.random() * CELL_COUNT);
      valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
  }

  function startGame() {
    snake = [
      { x: 5, y: 9 },
      { x: 4, y: 9 },
      { x: 3, y: 9 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    options.updateScore(score);
    spawnFood();
    overlay.textContent = "Use Arrow Keys or WASD";
    overlay.style.color = "var(--accent-cyan)";
    startBtn.textContent = "Restart";
    running = true;

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
  }

  function gameOver() {
    running = false;
    clearInterval(gameInterval);
    overlay.textContent = `💀 Game Over! Score: ${score}`;
    overlay.style.color = "var(--accent-red)";
    options.saveScore(score);
  }

  function gameLoop() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Collision with walls
    if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
      return gameOver();
    }

    // Collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      return gameOver();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      options.updateScore(score);
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, WIDTH, WIDTH);

    // Draw Food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? "#10b981" : "#059669";
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });
  }

  function setDirection(dx, dy) {
    if (dx !== -dir.x || dy !== -dir.y) {
      nextDir = { x: dx, y: dy };
    }
  }

  window.addEventListener("keydown", (e) => {
    if (!running && e.key === " ") {
      startGame();
      return;
    }
    switch (e.key) {
      case "ArrowUp": case "w": case "W": setDirection(0, -1); break;
      case "ArrowDown": case "s": case "S": setDirection(0, 1); break;
      case "ArrowLeft": case "a": case "A": setDirection(-1, 0); break;
      case "ArrowRight": case "d": case "D": setDirection(1, 0); break;
    }
  });

  container.querySelector("#ctrl-up").addEventListener("click", () => setDirection(0, -1));
  container.querySelector("#ctrl-down").addEventListener("click", () => setDirection(0, 1));
  container.querySelector("#ctrl-left").addEventListener("click", () => setDirection(-1, 0));
  container.querySelector("#ctrl-right").addEventListener("click", () => setDirection(1, 0));

  startBtn.addEventListener("click", startGame);
  draw();
};
