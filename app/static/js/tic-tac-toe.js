// Tic-tac-toe vs Computer
window.initGame = function(container, options) {
  let board = Array(9).fill(null);
  let gameOver = false;
  let streak = 0;
  let totalScore = 0;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; width:100%; max-width:360px;">
      <div id="ttt-status" style="font-size:1.1rem; font-weight:600; color:var(--accent-cyan); height:1.6rem;">Your Turn (X)</div>
      <div id="ttt-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; width:100%; aspect-ratio:1;">
        ${[0,1,2,3,4,5,6,7,8].map(i => `
          <button class="ttt-cell" data-index="${i}" style="
            background: #0f172a; border: 2px solid var(--border-color); border-radius: 10px;
            font-size: 2.5rem; font-weight: 800; color: white; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
          "></button>
        `).join("")}
      </div>
      <div style="display:flex; gap:0.75rem; margin-top:0.5rem; width:100%;">
        <button id="ttt-reset" class="btn btn-secondary" style="flex:1;">Restart Round</button>
        <button id="ttt-submit" class="btn btn-primary" style="flex:1;">Submit Score</button>
      </div>
    </div>
  `;

  const statusEl = container.querySelector("#ttt-status");
  const cells = container.querySelectorAll(".ttt-cell");
  const resetBtn = container.querySelector("#ttt-reset");
  const submitBtn = container.querySelector("#ttt-submit");

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function checkWinner(b) {
    for (const [a, c, d] of WIN_COMBOS) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every(x => x !== null)) return "tie";
    return null;
  }

  function computerMove() {
    if (gameOver) return;
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        if (checkWinner(board) === "O") { render(); handleEnd("O"); return; }
        board[i] = null;
      }
    }
    // Block player win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        if (checkWinner(board) === "X") { board[i] = "O"; render(); const w = checkWinner(board); if (w) handleEnd(w); return; }
        board[i] = null;
      }
    }
    // Take center if available
    if (!board[4]) { board[4] = "O"; render(); const w = checkWinner(board); if (w) handleEnd(w); return; }
    // Random available cell
    const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length > 0) {
      const idx = empty[Math.floor(Math.random() * empty.length)];
      board[idx] = "O";
    }
    render();
    const winner = checkWinner(board);
    if (winner) handleEnd(winner);
    else statusEl.textContent = "Your Turn (X)";
  }

  function handleEnd(result) {
    gameOver = true;
    if (result === "X") {
      streak++;
      const earned = 100 * streak;
      totalScore += earned;
      statusEl.textContent = `🎉 You Win! (+${earned} pts)`;
      statusEl.style.color = "var(--accent-green)";
    } else if (result === "O") {
      streak = 0;
      statusEl.textContent = "💀 Computer Wins!";
      statusEl.style.color = "var(--accent-red)";
    } else {
      totalScore += 20;
      statusEl.textContent = "🤝 It's a Tie! (+20 pts)";
      statusEl.style.color = "var(--accent-yellow)";
    }
    options.updateScore(totalScore);
  }

  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i] || "";
      cell.style.color = board[i] === "X" ? "var(--accent-cyan)" : "var(--accent-yellow)";
    });
  }

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const idx = parseInt(cell.getAttribute("data-index"), 10);
      if (board[idx] || gameOver) return;
      board[idx] = "X";
      render();
      const winner = checkWinner(board);
      if (winner) {
        handleEnd(winner);
      } else {
        statusEl.textContent = "Computer thinking...";
        setTimeout(computerMove, 300);
      }
    });
  });

  resetBtn.addEventListener("click", () => {
    board = Array(9).fill(null);
    gameOver = false;
    statusEl.textContent = "Your Turn (X)";
    statusEl.style.color = "var(--accent-cyan)";
    render();
  });

  submitBtn.addEventListener("click", () => {
    options.saveScore(totalScore);
  });

  options.updateScore(0);
};
