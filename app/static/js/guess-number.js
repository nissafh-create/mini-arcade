// Guess the Number
window.initGame = function(container, options) {
  let target = 0;
  let attempts = 0;
  let minRange = 1;
  let maxRange = 100;
  let gameOver = false;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1.25rem; width:100%; max-width:380px; text-align:center;">
      <p style="color:var(--text-muted); font-size:1rem;">I have picked a secret number between <strong>1</strong> and <strong>100</strong>. Can you guess it?</p>
      <div id="guess-range" style="font-size:1.1rem; font-weight:700; color:var(--accent-cyan);">Range: 1 - 100</div>
      <div id="guess-hint" style="font-size:1.15rem; font-weight:600; min-height:1.75rem;">Enter your first guess!</div>
      <form id="guess-form" style="display:flex; gap:0.5rem; width:100%;">
        <input type="number" id="guess-input" min="1" max="100" class="form-input" placeholder="1-100" required style="text-align:center; font-size:1.2rem; font-weight:700;">
        <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">Guess</button>
      </form>
      <div id="guess-stats" style="font-size:0.9rem; color:var(--text-muted);">Attempts: 0</div>
      <button id="guess-restart" class="btn btn-secondary" style="width:100%; display:none;">Play Again</button>
    </div>
  `;

  const rangeEl = container.querySelector("#guess-range");
  const hintEl = container.querySelector("#guess-hint");
  const form = container.querySelector("#guess-form");
  const input = container.querySelector("#guess-input");
  const statsEl = container.querySelector("#guess-stats");
  const restartBtn = container.querySelector("#guess-restart");

  function resetGame() {
    target = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    minRange = 1;
    maxRange = 100;
    gameOver = false;
    rangeEl.textContent = "Range: 1 - 100";
    hintEl.textContent = "Enter your first guess!";
    hintEl.style.color = "var(--text-primary)";
    statsEl.textContent = "Attempts: 0";
    input.value = "";
    input.disabled = false;
    form.style.display = "flex";
    restartBtn.style.display = "none";
    options.updateScore(0);
    input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gameOver) return;

    const guess = parseInt(input.value, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) return;

    attempts++;
    statsEl.textContent = `Attempts: ${attempts}`;

    if (guess === target) {
      gameOver = true;
      const score = Math.max(50, 1000 - (attempts - 1) * 90);
      hintEl.textContent = `🎉 Correct! The number was ${target}!`;
      hintEl.style.color = "var(--accent-green)";
      input.disabled = true;
      form.style.display = "none";
      restartBtn.style.display = "block";
      options.updateScore(score);
      options.saveScore(score);
    } else if (guess < target) {
      if (guess >= minRange) minRange = guess + 1;
      hintEl.textContent = `❄️ Too Low! (Try higher)`;
      hintEl.style.color = "var(--accent-cyan)";
      rangeEl.textContent = `Range: ${minRange} - ${maxRange}`;
    } else {
      if (guess <= maxRange) maxRange = guess - 1;
      hintEl.textContent = `🔥 Too High! (Try lower)`;
      hintEl.style.color = "var(--accent-yellow)";
      rangeEl.textContent = `Range: ${minRange} - ${maxRange}`;
    }

    input.value = "";
    input.focus();
  });

  restartBtn.addEventListener("click", resetGame);
  resetGame();
};
