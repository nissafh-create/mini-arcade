// Rock-paper-scissors Game
window.initGame = function(container, options) {
  const CHOICES = [
    { name: "rock", label: "Rock", icon: "🪨" },
    { name: "paper", label: "Paper", icon: "📄" },
    { name: "scissors", label: "Scissors", icon: "✂️" }
  ];

  let streak = 0;
  let score = 0;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1.5rem; width:100%; max-width:440px; text-align:center;">
      <div style="display:flex; justify-content:space-between; width:100%; font-size:1rem; color:var(--text-muted);">
        <span>Streak: <strong id="rps-streak" style="color:var(--accent-yellow);">0</strong></span>
        <span>Score: <strong id="rps-score" style="color:var(--accent-green);">0</strong></span>
      </div>

      <div style="display:flex; justify-content:space-around; align-items:center; width:100%; padding:1rem; background:#0f172a; border-radius:12px; border:1px solid var(--border-color);">
        <div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.25rem;">YOU</div>
          <div id="player-choice-icon" style="font-size:3rem;">❔</div>
        </div>
        <div style="font-weight:800; font-size:1.5rem; color:var(--text-muted);">VS</div>
        <div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.25rem;">BOT</div>
          <div id="bot-choice-icon" style="font-size:3rem;">❔</div>
        </div>
      </div>

      <div id="rps-result" style="font-size:1.2rem; font-weight:700; min-height:1.75rem;">Make your choice!</div>

      <div style="display:flex; gap:0.75rem; width:100%;">
        ${CHOICES.map(c => `
          <button class="btn btn-secondary rps-choice-btn" data-choice="${c.name}" style="flex:1; padding:1rem 0.5rem; font-size:1.1rem; display:flex; flex-direction:column; gap:0.25rem;">
            <span style="font-size:1.8rem;">${c.icon}</span>
            <span>${c.label}</span>
          </button>
        `).join("")}
      </div>

      <div style="display:flex; gap:0.75rem; width:100%;">
        <button id="rps-cashout" class="btn btn-primary" style="flex:1;">Submit & Cash Out</button>
      </div>
    </div>
  `;

  const streakEl = container.querySelector("#rps-streak");
  const scoreEl = container.querySelector("#rps-score");
  const playerIcon = container.querySelector("#player-choice-icon");
  const botIcon = container.querySelector("#bot-choice-icon");
  const resultEl = container.querySelector("#rps-result");
  const cashoutBtn = container.querySelector("#rps-cashout");

  function play(playerChoice) {
    const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].name;
    const pObj = CHOICES.find(c => c.name === playerChoice);
    const bObj = CHOICES.find(c => c.name === botChoice);

    playerIcon.textContent = pObj.icon;
    botIcon.textContent = bObj.icon;

    if (playerChoice === botChoice) {
      resultEl.textContent = "🤝 Draw! (+10 pts)";
      resultEl.style.color = "var(--accent-yellow)";
      score += 10;
    } else if (
      (playerChoice === "rock" && botChoice === "scissors") ||
      (playerChoice === "paper" && botChoice === "rock") ||
      (playerChoice === "scissors" && botChoice === "paper")
    ) {
      streak++;
      const earned = 50 + (streak * 25);
      score += earned;
      resultEl.textContent = `🎉 You Win Round! (+${earned} pts)`;
      resultEl.style.color = "var(--accent-green)";
    } else {
      resultEl.textContent = `💀 Bot wins round! Streak lost.`;
      resultEl.style.color = "var(--accent-red)";
      streak = 0;
    }

    streakEl.textContent = streak;
    scoreEl.textContent = score;
    options.updateScore(score);
  }

  container.querySelectorAll(".rps-choice-btn").forEach(btn => {
    btn.addEventListener("click", () => play(btn.dataset.choice));
  });

  cashoutBtn.addEventListener("click", () => {
    options.saveScore(score);
  });
};
