/**
 * onboarding.js — First-Time User Onboarding Tutorial
 * Shows a multi-step welcome tutorial only once, controlled via LocalStorage.
 * Uses smooth glassmorphism modal with step indicators and navigation.
 */

import { storage } from "./utils.js";

const ONBOARDING_KEY = "typePlayOnboardingDone";

const STEPS = [
  {
    icon: "⌨️",
    title: "Welcome to TypePlay!",
    body: `
      <p>TypePlay is your all-in-one <strong>typing practice platform</strong> — designed to make you faster, more accurate, and more confident at the keyboard.</p>
      <ul class="onboarding-list">
        <li>🎯 Practice typing with real paragraphs</li>
        <li>📖 Complete structured lessons &amp; levels</li>
        <li>🎮 Play exciting typing games</li>
        <li>📊 Track your progress with detailed stats</li>
      </ul>
    `,
    cta: null
  },
  {
    icon: "📖",
    title: "Choose Your Lesson",
    body: `
      <p>Start from <strong>Level 1 – Home Row</strong> and work your way up through 17 progressively harder levels.</p>
      <div class="onboarding-levels-preview">
        <div class="ob-level-badge">Level 1<br><small>Home Row</small></div>
        <div class="ob-arrow">→</div>
        <div class="ob-level-badge">Level 8<br><small>JavaScript</small></div>
        <div class="ob-arrow">→</div>
        <div class="ob-level-badge">Level 17<br><small>Regex Expert</small></div>
      </div>
      <p>Or jump straight into <strong>Practice Mode</strong> with your chosen difficulty level.</p>
    `,
    cta: null
  },
  {
    icon: "⚡",
    title: "Practice Makes Perfect",
    body: `
      <p>The typing field shows you exactly what to type. Each character lights up as you go:</p>
      <div class="onboarding-char-demo">
        <span class="ob-char correct">T</span><span class="ob-char correct">h</span><span class="ob-char correct">e</span>
        <span class="ob-char correct"> </span><span class="ob-char current">q</span><span class="ob-char gray">u</span>
        <span class="ob-char gray">i</span><span class="ob-char gray">c</span><span class="ob-char gray">k</span>
      </div>
      <ul class="onboarding-list">
        <li><span style="color:var(--correct)">●</span> Green = Correct</li>
        <li><span style="color:var(--incorrect)">●</span> Red = Mistake</li>
        <li><span style="color:var(--current)">●</span> Blue = Current position</li>
      </ul>
    `,
    cta: null
  },
  {
    icon: "🏆",
    title: "Earn XP & Coins",
    body: `
      <p>Every test you complete rewards you with <strong>Experience Points (XP)</strong> and <strong>Coins</strong>!</p>
      <div class="onboarding-rewards">
        <div class="ob-reward-item">
          <span class="ob-reward-icon">⚡</span>
          <strong>XP</strong>
          <small>Level up your profile</small>
        </div>
        <div class="ob-reward-item">
          <span class="ob-reward-icon">🪙</span>
          <strong>Coins</strong>
          <small>Unlock themes &amp; avatars</small>
        </div>
        <div class="ob-reward-item">
          <span class="ob-reward-icon">🏅</span>
          <strong>Badges</strong>
          <small>Achievement rewards</small>
        </div>
      </div>
      <p>Higher accuracy and speed = more rewards!</p>
    `,
    cta: null
  },
  {
    icon: "🚀",
    title: "You're Ready!",
    body: `
      <p>Here's a quick reference for keyboard shortcuts:</p>
      <div class="onboarding-shortcuts">
        <div class="ob-shortcut"><kbd>Enter</kbd> Start test</div>
        <div class="ob-shortcut"><kbd>Esc</kbd> Pause / Resume</div>
        <div class="ob-shortcut"><kbd>Ctrl + R</kbd> Restart</div>
      </div>
      <p>Click <strong>Start Practice</strong> on the home page to begin your first test. Good luck! 🎯</p>
    `,
    cta: "Start Typing!"
  }
];

export const onboardingManager = {
  currentStep: 0,
  modal: null,
  isVisible: false,

  /**
   * Initialize onboarding. Shows tutorial if never seen before.
   */
  init() {
    if (storage.get(ONBOARDING_KEY, false)) return; // Already seen
    this.buildModal();
    this.show();
  },

  /**
   * Build the onboarding modal DOM structure.
   */
  buildModal() {
    // Remove existing if any
    const existing = document.getElementById("onboardingModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "onboardingModal";
    modal.className = "modal onboarding-modal";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "onboardingTitle");
    modal.innerHTML = `
      <div class="onboarding-content glass-card">
        <!-- Header -->
        <div class="onboarding-header">
          <div class="onboarding-icon-wrap" id="obIcon"></div>
          <div class="onboarding-step-indicators" id="obStepIndicators" aria-label="Progress indicators"></div>
        </div>

        <!-- Body -->
        <div class="onboarding-body">
          <h2 class="onboarding-title" id="onboardingTitle"></h2>
          <div class="onboarding-text" id="obText"></div>
        </div>

        <!-- Footer -->
        <div class="onboarding-footer">
          <button id="obSkipBtn" class="btn btn-outline btn-sm">Skip Tour</button>
          <div class="onboarding-nav">
            <button id="obBackBtn" class="btn btn-secondary btn-sm" style="display:none">← Back</button>
            <button id="obNextBtn" class="btn btn-primary">Next →</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Wire buttons
    modal.querySelector("#obSkipBtn").addEventListener("click", () => this.finish(true));
    modal.querySelector("#obBackBtn").addEventListener("click", () => this.goToStep(this.currentStep - 1));
    modal.querySelector("#obNextBtn").addEventListener("click", () => {
      if (this.currentStep >= STEPS.length - 1) {
        this.finish(false);
      } else {
        this.goToStep(this.currentStep + 1);
      }
    });
  },

  /**
   * Show the onboarding modal.
   */
  show() {
    if (!this.modal) this.buildModal();
    this.isVisible = true;
    this.modal.classList.remove("hidden");
    this.goToStep(0);

    // Trap focus inside modal
    setTimeout(() => {
      const firstBtn = this.modal.querySelector("button:not([disabled])");
      if (firstBtn) firstBtn.focus();
    }, 100);
  },

  /**
   * Navigate to a specific step.
   * @param {number} step
   */
  goToStep(step) {
    if (step < 0 || step >= STEPS.length) return;
    this.currentStep = step;
    const data = STEPS[step];

    // Update icon
    const iconEl = this.modal.querySelector("#obIcon");
    iconEl.textContent = data.icon;
    iconEl.style.animation = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        iconEl.style.animation = "";
      });
    });

    // Update step indicators
    const indicators = this.modal.querySelector("#obStepIndicators");
    indicators.innerHTML = STEPS.map((_, i) =>
      `<div class="ob-dot ${i === step ? "active" : i < step ? "done" : ""}" aria-label="Step ${i + 1}"></div>`
    ).join("");

    // Update title and body with fade
    const titleEl = this.modal.querySelector("#onboardingTitle");
    const textEl = this.modal.querySelector("#obText");

    titleEl.style.opacity = "0";
    textEl.style.opacity = "0";

    setTimeout(() => {
      titleEl.textContent = data.title;
      textEl.innerHTML = data.body;
      titleEl.style.opacity = "1";
      textEl.style.opacity = "1";
    }, 150);

    // Update navigation buttons
    const backBtn = this.modal.querySelector("#obBackBtn");
    const nextBtn = this.modal.querySelector("#obNextBtn");

    backBtn.style.display = step === 0 ? "none" : "";
    nextBtn.textContent = step === STEPS.length - 1 ? (data.cta || "Finish! 🚀") : "Next →";
  },

  /**
   * Finish and dismiss the onboarding.
   * @param {boolean} skipped — Whether the user skipped
   */
  finish(skipped) {
    storage.set(ONBOARDING_KEY, true);
    this.isVisible = false;

    if (this.modal) {
      this.modal.classList.add("onboarding-exit");
      setTimeout(() => {
        if (this.modal) {
          this.modal.classList.add("hidden");
          this.modal.classList.remove("onboarding-exit");
        }
      }, 400);
    }
  },

  /**
   * Force re-show onboarding (for testing or settings reset).
   */
  reset() {
    storage.set(ONBOARDING_KEY, false);
    if (this.modal) this.modal.remove();
    this.modal = null;
    this.buildModal();
    this.show();
  }
};
