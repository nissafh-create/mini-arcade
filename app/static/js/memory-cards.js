// Memory Cards Game
window.initGame = function(container, options) {
  const EMOJIS = ["🎮", "🕹️", "🎲", "🎯", "👾", "🚀", "⭐", "🏆"];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let startTime = null;
  let timerInterval = null;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; width:100%; max-width:400px;">
      <div style="display:flex; justify-content:space-between; width:100%; font-size:0.95rem; color:var(--text-muted);">
        <span>Moves: <strong id="mem-moves" style="color:white;">0</strong></span>
        <span>Time: <strong id="mem-time" style="color:white;">0s</strong></span>
        <span>Matched: <strong id="mem-matched" style="color:var(--accent-green);">0/8</strong></span>
      </div>
      <div id="mem-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; width:100%; aspect-ratio:1;"></div>
      <div style="display:flex; gap:0.75rem; width:100%;">
        <button id="mem-restart" class="btn btn-secondary" style="flex:1;">New Game</button>
      </div>
    </div>
  `;

  const grid = container.querySelector("#mem-grid");
  const movesEl = container.querySelector("#mem-moves");
  const timeEl = container.querySelector("#mem-time");
  const matchedEl = container.querySelector("#mem-matched");
  const restartBtn = container.querySelector("#mem-restart");

  function start() {
    clearInterval(timerInterval);
    moves = 0;
    matched = 0;
    flipped = [];
    movesEl.textContent = "0";
    timeEl.textContent = "0s";
    matchedEl.textContent = "0/8";
    options.updateScore(0);

    const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    grid.innerHTML = "";

    deck.forEach((emoji, index) => {
      const card = document.createElement("button");
      card.style.cssText = `
        background: #0f172a; border: 2px solid var(--border-color); border-radius: 8px;
        font-size: 2rem; cursor: pointer; display:flex; align-items:center; justify-content:center;
        transition: transform 0.2s, background 0.2s; aspect-ratio: 1; color: transparent;
      `;
      card.dataset.emoji = emoji;
      card.dataset.index = index;

      card.addEventListener("click", () => handleFlip(card));
      grid.appendChild(card);
    });

    startTime = Date.now();
    timerInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      timeEl.textContent = `${seconds}s`;
    }, 1000);
  }

  function handleFlip(card) {
    if (flipped.length >= 2 || card.classList.contains("revealed") || card.classList.contains("matched")) {
      return;
    }
    card.textContent = card.dataset.emoji;
    card.style.color = "white";
    card.style.background = "#1e293b";
    card.classList.add("revealed");
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      const [c1, c2] = flipped;
      if (c1.dataset.emoji === c2.dataset.emoji) {
        c1.classList.add("matched");
        c2.classList.add("matched");
        c1.style.borderColor = "var(--accent-green)";
        c2.style.borderColor = "var(--accent-green)";
        matched++;
        matchedEl.textContent = `${matched}/8`;
        flipped = [];

        if (matched === 8) {
          clearInterval(timerInterval);
          const seconds = Math.floor((Date.now() - startTime) / 1000);
          const score = Math.max(100, 1000 - (moves * 15) - (seconds * 8));
          options.updateScore(score);
          options.saveScore(score);
        }
      } else {
        setTimeout(() => {
          c1.textContent = "";
          c1.style.background = "#0f172a";
          c1.classList.remove("revealed");
          c2.textContent = "";
          c2.style.background = "#0f172a";
          c2.classList.remove("revealed");
          flipped = [];
        }, 700);
      }
    }
  }

  restartBtn.addEventListener("click", start);
  start();
};
