// Higher or Lower Card Game
window.initGame = function(container, options) {
  const SUITS = ["♠️", "♥️", "♣️", "♦️"];
  const VALUES = [
    { rank: 2, label: "2" }, { rank: 3, label: "3" }, { rank: 4, label: "4" },
    { rank: 5, label: "5" }, { rank: 6, label: "6" }, { rank: 7, label: "7" },
    { rank: 8, label: "8" }, { rank: 9, label: "9" }, { rank: 10, label: "10" },
    { rank: 11, label: "J" }, { rank: 12, label: "Q" }, { rank: 13, label: "K" },
    { rank: 14, label: "A" }
  ];

  let currentCard = null;
  let streak = 0;
  let score = 0;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1.25rem; width:100%; max-width:380px;">
      <div style="display:flex; justify-content:space-between; width:100%; font-size:1rem; color:var(--text-muted);">
        <span>Streak: <strong id="hol-streak" style="color:var(--accent-yellow);">0</strong></span>
        <span>Score: <strong id="hol-score" style="color:var(--accent-green);">0</strong></span>
      </div>

      <!-- Card Display -->
      <div id="hol-card" style="
        width: 170px; height: 240px; background: white; color: black; border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); display: flex; flex-direction: column;
        justify-content: space-between; padding: 1rem; user-select: none;
      ">
        <div id="card-top" style="font-size: 1.5rem; font-weight: 800; text-align: left;">7♠️</div>
        <div id="card-center" style="font-size: 3.5rem; text-align: center;">♠️</div>
        <div id="card-bottom" style="font-size: 1.5rem; font-weight: 800; text-align: right;">7♠️</div>
      </div>

      <div id="hol-result" style="font-size:1.15rem; font-weight:700; min-height:1.6rem; color:var(--accent-cyan);">Will the next card be higher or lower?</div>

      <div style="display:flex; gap:0.75rem; width:100%;">
        <button id="hol-higher" class="btn btn-primary" style="flex:1; padding:0.75rem; font-size:1.1rem;">⬆️ Higher</button>
        <button id="hol-lower" class="btn btn-secondary" style="flex:1; padding:0.75rem; font-size:1.1rem;">⬇️ Lower</button>
      </div>

      <button id="hol-submit" class="btn btn-accent" style="width:100%;">Cash Out &amp; Save Score</button>
    </div>
  `;

  const streakEl = container.querySelector("#hol-streak");
  const scoreEl = container.querySelector("#hol-score");
  const cardTop = container.querySelector("#card-top");
  const cardCenter = container.querySelector("#card-center");
  const cardBottom = container.querySelector("#card-bottom");
  const resultEl = container.querySelector("#hol-result");
  const higherBtn = container.querySelector("#hol-higher");
  const lowerBtn = container.querySelector("#hol-lower");
  const submitBtn = container.querySelector("#hol-submit");

  function drawCard() {
    const val = VALUES[Math.floor(Math.random() * VALUES.length)];
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const isRed = suit === "♥️" || suit === "♦️";
    return { ...val, suit, color: isRed ? "#dc2626" : "#0f172a" };
  }

  function renderCard(card) {
    currentCard = card;
    const txt = `${card.label}${card.suit}`;
    cardTop.textContent = txt;
    cardTop.style.color = card.color;
    cardCenter.textContent = card.suit;
    cardCenter.style.color = card.color;
    cardBottom.textContent = txt;
    cardBottom.style.color = card.color;
  }

  function guess(direction) {
    const nextCard = drawCard();
    const isHigher = nextCard.rank > currentCard.rank;
    const isLower = nextCard.rank < currentCard.rank;
    const isTie = nextCard.rank === currentCard.rank;

    renderCard(nextCard);

    if (isTie) {
      score += 15;
      resultEl.textContent = "🤝 Tie rank! +15 pts. Streak continues!";
      resultEl.style.color = "var(--accent-yellow)";
    } else if ((direction === "higher" && isHigher) || (direction === "lower" && isLower)) {
      streak++;
      const earned = 60 + (streak * 20);
      score += earned;
      resultEl.textContent = `🎉 Correct! (+${earned} pts)`;
      resultEl.style.color = "var(--accent-green)";
    } else {
      resultEl.textContent = `💀 Wrong! Game over. Final score: ${score}`;
      resultEl.style.color = "var(--accent-red)";
      options.saveScore(score);
      streak = 0;
      score = 0;
    }

    streakEl.textContent = streak;
    scoreEl.textContent = score;
    options.updateScore(score);
  }

  higherBtn.addEventListener("click", () => guess("higher"));
  lowerBtn.addEventListener("click", () => guess("lower"));
  submitBtn.addEventListener("click", () => {
    options.saveScore(score);
  });

  renderCard(drawCard());
};
