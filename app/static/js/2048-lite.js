// 2048-lite (4x4)
window.initGame = function(container, options) {
  let board = Array(4).fill(null).map(() => Array(4).fill(0));
  let score = 0;

  const TILE_COLORS = {
    2: { bg: "#eee4da", color: "#776e65" },
    4: { bg: "#ede0c8", color: "#776e65" },
    8: { bg: "#f2b179", color: "#f9f6f2" },
    16: { bg: "#f59563", color: "#f9f6f2" },
    32: { bg: "#f67c5f", color: "#f9f6f2" },
    64: { bg: "#f65e3b", color: "#f9f6f2" },
    128: { bg: "#edcf72", color: "#f9f6f2" },
    256: { bg: "#edcc61", color: "#f9f6f2" },
    512: { bg: "#edc850", color: "#f9f6f2" },
    1024: { bg: "#edc53f", color: "#f9f6f2" },
    2048: { bg: "#edc22e", color: "#f9f6f2" }
  };

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; width:100%; max-width:380px;">
      <div id="board-2048" style="
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; aspect-ratio: 1;
        background: #0f172a; border: 2px solid var(--border-color); border-radius: 12px; padding: 10px;
      "></div>

      <!-- Controls for Touch / Mobile -->
      <div style="display:grid; grid-template-columns:repeat(3, 48px); gap:6px;">
        <div></div>
        <button class="btn btn-secondary" id="k-up">⬆️</button>
        <div></div>
        <button class="btn btn-secondary" id="k-left">⬅️</button>
        <button class="btn btn-secondary" id="k-down">⬇️</button>
        <button class="btn btn-secondary" id="k-right">➡️</button>
      </div>

      <div style="display:flex; gap:0.75rem; width:100%;">
        <button id="btn-restart-2048" class="btn btn-secondary" style="flex:1;">Restart</button>
        <button id="btn-submit-2048" class="btn btn-primary" style="flex:1;">Submit Score</button>
      </div>
    </div>
  `;

  const boardEl = container.querySelector("#board-2048");
  const restartBtn = container.querySelector("#btn-restart-2048");
  const submitBtn = container.querySelector("#btn-submit-2048");

  function spawnTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function render() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c];
        const tile = document.createElement("div");
        const styling = TILE_COLORS[val] || { bg: "#3c3a32", color: "#fff" };
        tile.style.cssText = `
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: ${val > 512 ? "1.4rem" : "1.8rem"}; border-radius: 8px;
          background: ${val === 0 ? "#1e293b" : styling.bg};
          color: ${val === 0 ? "transparent" : styling.color};
          aspect-ratio: 1; user-select: none;
        `;
        tile.textContent = val !== 0 ? val : "";
        boardEl.appendChild(tile);
      }
    }
    options.updateScore(score);
  }

  function slide(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function move(direction) {
    let moved = false;
    let oldBoard = JSON.stringify(board);

    if (direction === "left") {
      for (let r = 0; r < 4; r++) {
        board[r] = slide(board[r]);
      }
    } else if (direction === "right") {
      for (let r = 0; r < 4; r++) {
        board[r] = slide(board[r].reverse()).reverse();
      }
    } else if (direction === "up") {
      for (let c = 0; c < 4; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        col = slide(col);
        for (let r = 0; r < 4; r++) board[r][c] = col[r];
      }
    } else if (direction === "down") {
      for (let c = 0; c < 4; c++) {
        let col = [board[3][c], board[2][c], board[1][c], board[0][c]];
        col = slide(col);
        for (let r = 0; r < 4; r++) board[3 - r][c] = col[r];
      }
    }

    if (oldBoard !== JSON.stringify(board)) {
      spawnTile();
      render();
    }
  }

  function init() {
    board = Array(4).fill(null).map(() => Array(4).fill(0));
    score = 0;
    spawnTile();
    spawnTile();
    render();
  }

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp": case "w": case "W": move("up"); break;
      case "ArrowDown": case "s": case "S": move("down"); break;
      case "ArrowLeft": case "a": case "A": move("left"); break;
      case "ArrowRight": case "d": case "D": move("right"); break;
    }
  });

  container.querySelector("#k-up").addEventListener("click", () => move("up"));
  container.querySelector("#k-down").addEventListener("click", () => move("down"));
  container.querySelector("#k-left").addEventListener("click", () => move("left"));
  container.querySelector("#k-right").addEventListener("click", () => move("right"));
  restartBtn.addEventListener("click", init);
  submitBtn.addEventListener("click", () => options.saveScore(score));

  init();
};
