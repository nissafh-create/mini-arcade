// Reaction Time Test Game
window.initGame = function(container, options) {
  let state = "IDLE"; // IDLE, WAITING, READY, DONE
  let timeoutId = null;
  let startTime = null;
  let bestScore = 0;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap: 1.25rem; width:100%; max-width:440px;">
      <div id="reaction-box" style="
        width: 100%; height: 260px; border-radius: 16px; display: flex; flex-direction: column;
        align-items: center; justify-content: center; cursor: pointer; user-select: none;
        background: #2563eb; color: white; text-align: center; padding: 1.5rem; transition: background 0.15s;
      ">
        <div id="reaction-icon" style="font-size: 3rem; margin-bottom: 0.5rem;">⚡</div>
        <div id="reaction-main-text" style="font-size: 1.3rem; font-weight: 700;">Click Here to Start</div>
        <div id="reaction-sub-text" style="font-size: 0.95rem; opacity: 0.9; margin-top: 0.25rem;">When red turns GREEN, click as fast as you can!</div>
      </div>
      <div style="display:flex; justify-content:space-between; width:100%; font-size:0.95rem; color:var(--text-muted);">
        <span>Best Reaction: <strong id="best-reaction" style="color:var(--accent-yellow);">-</strong></span>
        <span>Score: <strong id="reaction-score" style="color:var(--accent-green);">0</strong></span>
      </div>
      <button id="reaction-submit" class="btn btn-primary" style="width:100%; display:none;">Submit Score</button>
    </div>
  `;

  const box = container.querySelector("#reaction-box");
  const icon = container.querySelector("#reaction-icon");
  const mainText = container.querySelector("#reaction-main-text");
  const subText = container.querySelector("#reaction-sub-text");
  const bestEl = container.querySelector("#best-reaction");
  const scoreEl = container.querySelector("#reaction-score");
  const submitBtn = container.querySelector("#reaction-submit");

  function handleClick() {
    if (state === "IDLE" || state === "DONE") {
      state = "WAITING";
      box.style.background = "#dc2626"; // Red
      icon.textContent = "⏳";
      mainText.textContent = "Wait for green...";
      subText.textContent = "Do not click yet!";
      submitBtn.style.display = "none";

      const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5s - 4s
      timeoutId = setTimeout(() => {
        state = "READY";
        startTime = performance.now();
        box.style.background = "#16a34a"; // Green
        icon.textContent = "⚡";
        mainText.textContent = "CLICK NOW!";
        subText.textContent = "Fast fast fast!";
      }, delay);
    } else if (state === "WAITING") {
      clearTimeout(timeoutId);
      state = "DONE";
      box.style.background = "#b45309"; // Amber
      icon.textContent = "⚠️";
      mainText.textContent = "Too early!";
      subText.textContent = "Click here to try again.";
    } else if (state === "READY") {
      const elapsed = Math.round(performance.now() - startTime);
      state = "DONE";
      box.style.background = "#1e293b";
      box.style.border = "2px solid var(--accent-cyan)";
      icon.textContent = "🎯";
      mainText.textContent = `${elapsed} ms`;
      subText.textContent = "Click box to try again or submit your score.";

      const score = Math.max(10, 1000 - elapsed);
      if (score > bestScore) {
        bestScore = score;
        bestEl.textContent = `${elapsed} ms`;
        scoreEl.textContent = score;
        options.updateScore(score);
      }
      submitBtn.style.display = "block";
    }
  }

  box.addEventListener("click", handleClick);
  submitBtn.addEventListener("click", () => {
    if (bestScore > 0) {
      options.saveScore(bestScore);
    }
  });
};
