/**
 * toast.js — Toast Notification System
 * Provides beautiful glassmorphism toast notifications as a replacement
 * for native browser alert() dialogs. Supports typed notifications with
 * icons, auto-dismiss, and achievement unlock animations.
 */

// Ensure container exists in DOM
function getToastContainer() {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "false");
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message — The message to display
 * @param {string} type — 'success' | 'error' | 'info' | 'achievement' | 'warning'
 * @param {number} duration — Auto-dismiss after ms (default 3500)
 */
export function showToast(message, type = "info", duration = 3500) {
  const container = getToastContainer();

  const ICONS = {
    success:     "✅",
    error:       "❌",
    info:        "ℹ️",
    achievement: "🏅",
    warning:     "⚠️",
    levelup:     "🎉",
    xp:          "⚡",
    coin:        "🪙"
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] || "ℹ️"}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Dismiss notification">×</button>
  `;

  // Close button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    dismissToast(toast);
  });

  container.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("toast-visible");
    });
  });

  // Auto-dismiss
  const timerId = setTimeout(() => dismissToast(toast), duration);

  // Allow user hover to pause auto-dismiss
  toast.addEventListener("mouseenter", () => clearTimeout(timerId));
  toast.addEventListener("mouseleave", () => {
    setTimeout(() => dismissToast(toast), 1500);
  });

  return toast;
}

/**
 * Dismiss and remove a toast element.
 * @param {HTMLElement} toast
 */
function dismissToast(toast) {
  if (!toast || toast.classList.contains("toast-leaving")) return;
  toast.classList.add("toast-leaving");
  toast.addEventListener("transitionend", () => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, { once: true });
}

/**
 * Show an achievement unlock toast with special styling.
 * @param {string} title — Achievement title
 * @param {string} description — Achievement description
 * @param {string} icon — Emoji icon
 */
export function showAchievementToast(title, description, icon = "🏅") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = "toast toast-achievement toast-achievement-special";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="achievement-toast-content">
      <div class="achievement-toast-badge">${icon}</div>
      <div class="achievement-toast-text">
        <div class="achievement-toast-label">🔓 Achievement Unlocked!</div>
        <div class="achievement-toast-title">${title}</div>
        <div class="achievement-toast-desc">${description}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">×</button>
    </div>
  `;

  toast.querySelector(".toast-close").addEventListener("click", () => {
    dismissToast(toast);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("toast-visible");
    });
  });

  setTimeout(() => dismissToast(toast), 5000);
}

/**
 * Convenience wrappers for common toast types.
 */
export const toast = {
  success:     (msg, dur) => showToast(msg, "success", dur),
  error:       (msg, dur) => showToast(msg, "error", dur),
  info:        (msg, dur) => showToast(msg, "info", dur),
  warning:     (msg, dur) => showToast(msg, "warning", dur),
  achievement: (title, desc, icon) => showAchievementToast(title, desc, icon),
  levelUp:     (level) => showToast(`🎉 Level Up! You reached <strong>Level ${level}</strong>!`, "levelup", 4000),
  xp:          (amount) => showToast(`⚡ +${amount} XP earned!`, "xp", 2500),
  coins:       (amount) => showToast(`🪙 +${amount} Coins earned!`, "coin", 2500)
};
