/**
 * Mini Arcade - Common Client Helpers
 */

const ARCADE_GAMES = [
  { slug: "tic-tac-toe", name: "Tic-tac-toe", icon: "⭕", desc: "Classic 3x3 challenge against an intelligent computer." },
  { slug: "memory-cards", name: "Memory Cards", icon: "🃏", desc: "Test your memory by flipping and matching 8 emoji pairs." },
  { slug: "guess-number", name: "Guess the Number", icon: "🔢", desc: "Find the hidden number from 1 to 100 with hints." },
  { slug: "snake", name: "Snake", icon: "🐍", desc: "Eat apples and grow your retro snake without hitting walls or tail." },
  { slug: "rock-paper-scissors", name: "Rock-paper-scissors", icon: "✂️", desc: "Battle the computer to build the longest winning streak." },
  { slug: "whack-a-mole", name: "Whack-a-Mole", icon: "🐹", desc: "Tap the fast popping moles within 30 seconds!" },
  { slug: "simon-says", name: "Simon Says", icon: "💡", desc: "Watch the flashing sequence and repeat the color patterns." },
  { slug: "reaction-time", name: "Reaction Time Test", icon: "⚡", desc: "Wait for green and click as fast as humanly possible." },
  { slug: "higher-lower", name: "Higher or Lower", icon: "📈", desc: "Guess if the next drawn card will be higher or lower." },
  { slug: "2048-lite", name: "2048-lite", icon: "🧩", desc: "Slide and merge matching number tiles on a 4x4 board." }
];

const USER_STORAGE_KEY = "arcade_username";
const USERNAME_REGEX = /^[A-Za-z0-9_]{2,20}$/;

function getUsername() {
  return localStorage.getItem(USER_STORAGE_KEY) || "";
}

function setUsername(name) {
  name = (name || "").trim();
  if (!USERNAME_REGEX.test(name)) {
    return false;
  }
  localStorage.setItem(USER_STORAGE_KEY, name);
  updateNavUser();
  return true;
}

function updateNavUser() {
  const user = getUsername();
  const el = document.getElementById("nav-player-name");
  if (el) {
    el.textContent = user || "Guest";
  }
}

function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function showUserModal(allowClose = false) {
  let modal = document.getElementById("username-modal");
  if (modal) modal.remove();

  modal = document.createElement("div");
  modal.id = "username-modal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Enter your name</h3>
      <p class="modal-desc">Choose a nickname for the Mini Arcade leaderboards (2-20 characters: letters, numbers, underscore).</p>
      <form id="username-form">
        <div class="form-group">
          <input type="text" id="username-input" class="form-input" placeholder="e.g. Player_1" maxlength="20" autofocus value="${getUsername()}" />
          <div id="username-error" class="error-msg">Letters, numbers, and underscore only (2-20 chars).</div>
        </div>
        <div style="display:flex; justify-content: flex-end; gap: 0.5rem;">
          ${allowClose ? '<button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>' : ''}
          <button type="submit" class="btn btn-primary">Save Name</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const input = modal.querySelector("#username-input");
  const form = modal.querySelector("#username-form");
  const error = modal.querySelector("#username-error");
  const cancelBtn = modal.querySelector("#btn-cancel-modal");

  input.focus();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (setUsername(val)) {
      modal.remove();
      showToast(`Welcome, ${val}!`);
    } else {
      error.style.display = "block";
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => modal.remove());
  }
}

async function submitScore(gameSlug, score) {
  let user = getUsername();
  if (!user) {
    showUserModal(false);
    return;
  }

  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        game_slug: gameSlug,
        score: parseInt(score, 10)
      })
    });
    if (res.ok) {
      showToast(`🎉 Score ${score} saved to leaderboard!`);
      if (typeof window.refreshLeaderboard === "function") {
        window.refreshLeaderboard();
      }
    } else {
      const err = await res.json();
      showToast(`⚠️ ${err.error || "Failed to save score"}`);
    }
  } catch (err) {
    showToast("⚠️ Could not reach server to save score");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavUser();
  if (!getUsername()) {
    showUserModal(false);
  }
  const editBtn = document.getElementById("btn-edit-user");
  if (editBtn) {
    editBtn.addEventListener("click", () => showUserModal(true));
  }
});
