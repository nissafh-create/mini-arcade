// Simon Says Game
window.initGame = function(container, options) {
  const COLORS = [
    { name: "green", bg: "#10b981", active: "#6ee7b7" },
    { name: "red", bg: "#ef4444", active: "#fca5a5" },
    { name: "yellow", bg: "#f59e0b", active: "#fde68a" },
    { name: "blue", bg: "#3b82f6", active: "#93c5fd" }
  ];

  let sequence = [];
  let playerStep = 0;
  let score = 0;
  let canClick = false;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1.25rem; width:100%; max-width:360px;">
      <div id="simon-status" style="font-size:1.1rem; font-weight:700; color:var(--accent-cyan); min-height:1.6rem;">Press Start to play!</div>
      <div id="simon-board" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; width:100%; aspect-ratio:1;">
        ${COLORS.map((c, i) => `
          <button class="simon-pad" data-index="${i}" style="
            background: ${c.bg}; border: none; border-radius: 16px; cursor: pointer;
            aspect-ratio: 1; opacity: 0.8; transition: opacity 0.15s, transform 0.1s;
          "></button>
        `).join("")}
      </div>
      <button id="simon-start" class="btn btn-primary" style="width:100%;">Start Game</button>
    </div>
  `;

  const statusEl = container.querySelector("#simon-status");
  const pads = container.querySelectorAll(".simon-pad");
  const startBtn = container.querySelector("#simon-start");

  function flashPad(index, duration = 300) {
    return new Promise(resolve => {
      const pad = pads[index];
      const color = COLORS[index];
      pad.style.opacity = "1";
      pad.style.background = color.active;
      pad.style.transform = "scale(0.96)";
      setTimeout(() => {
        pad.style.opacity = "0.8";
        pad.style.background = color.bg;
        pad.style.transform = "scale(1)";
        setTimeout(resolve, 100);
      }, duration);
    });
  }

  async function playSequence() {
    canClick = false;
    statusEl.textContent = `Round ${sequence.length}: Watch Simon!`;
    statusEl.style.color = "var(--accent-yellow)";

    await new Promise(r => setTimeout(r, 600));

    for (const idx of sequence) {
      await flashPad(idx);
    }

    playerStep = 0;
    canClick = true;
    statusEl.textContent = "Your turn! Repeat the pattern.";
    statusEl.style.color = "var(--accent-cyan)";
  }

  function nextRound() {
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
  }

  function handlePadClick(index) {
    if (!canClick) return;

    flashPad(index, 200);

    if (index === sequence[playerStep]) {
      playerStep++;
      if (playerStep === sequence.length) {
        canClick = false;
        score = sequence.length * 100;
        options.updateScore(score);
        statusEl.textContent = "Great job! Next level...";
        statusEl.style.color = "var(--accent-green)";
        setTimeout(nextRound, 800);
      }
    } else {
      canClick = false;
      statusEl.textContent = `💀 Wrong pad! Final Score: ${score}`;
      statusEl.style.color = "var(--accent-red)";
      startBtn.textContent = "Play Again";
      options.saveScore(score);
    }
  }

  pads.forEach((pad, i) => {
    pad.addEventListener("click", () => handlePadClick(i));
  });

  startBtn.addEventListener("click", () => {
    sequence = [];
    score = 0;
    options.updateScore(0);
    startBtn.textContent = "Restart";
    nextRound();
  });
};
