// Whack-a-Mole Game
window.initGame = function(container, options) {
  let score = 0;
  let timeLeft = 30;
  let timerInterval = null;
  let moleInterval = null;
  let activeHole = -1;
  let isRunning = false;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; width:100%; max-width:380px;">
      <div style="display:flex; justify-content:space-between; width:100%; font-size:1rem; color:var(--text-muted);">
        <span>Time Remaining: <strong id="wam-time" style="color:var(--accent-cyan);">30s</strong></span>
        <span>Score: <strong id="wam-score" style="color:var(--accent-yellow);">0</strong></span>
      </div>
      <div id="wam-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; width:100%; aspect-ratio:1;">
        ${[0,1,2,3,4,5,6,7,8].map(i => `
          <button class="wam-hole" data-index="${i}" style="
            background: #0f172a; border: 2px solid var(--border-color); border-radius: 50%;
            font-size: 2.5rem; cursor: pointer; display:flex; align-items:center; justify-content:center;
            aspect-ratio: 1; user-select: none;
          "></button>
        `).join("")}
      </div>
      <div style="display:flex; gap:0.75rem; width:100%;">
        <button id="wam-start" class="btn btn-primary" style="flex:1;">Start Game</button>
      </div>
    </div>
  `;

  const timeEl = container.querySelector("#wam-time");
  const scoreEl = container.querySelector("#wam-score");
  const holes = container.querySelectorAll(".wam-hole");
  const startBtn = container.querySelector("#wam-start");

  function popupMole() {
    holes.forEach(h => {
      h.textContent = "";
      h.style.background = "#0f172a";
    });
    if (!isRunning) return;

    let nextHole;
    do {
      nextHole = Math.floor(Math.random() * 9);
    } while (nextHole === activeHole);

    activeHole = nextHole;
    const hole = holes[activeHole];
    hole.textContent = "🐹";
    hole.style.background = "#1e293b";
  }

  function startGame() {
    clearInterval(timerInterval);
    clearInterval(moleInterval);
    score = 0;
    timeLeft = 30;
    isRunning = true;
    options.updateScore(0);
    scoreEl.textContent = "0";
    timeEl.textContent = "30s";
    startBtn.textContent = "Restart";

    popupMole();
    moleInterval = setInterval(popupMole, 850);

    timerInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    isRunning = false;
    clearInterval(timerInterval);
    clearInterval(moleInterval);
    holes.forEach(h => { h.textContent = ""; h.style.background = "#0f172a"; });
    timeEl.textContent = "0s";
    options.saveScore(score);
  }

  holes.forEach(hole => {
    hole.addEventListener("click", () => {
      if (!isRunning) return;
      const idx = parseInt(hole.dataset.index, 10);
      if (idx === activeHole && hole.textContent === "🐹") {
        hole.textContent = "💥";
        hole.style.background = "#334155";
        score += 10;
        scoreEl.textContent = score;
        options.updateScore(score);
        activeHole = -1;
      }
    });
  });

  startBtn.addEventListener("click", startGame);
};
