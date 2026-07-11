import { soundEngine, getRandomParagraph, getDailyParagraph, fetchQuote, storage } from "./utils.js";
import { themeManager } from "./theme.js";
import { Timer } from "./timer.js";
import { TypingEngine } from "./typing.js";
import { historyManager } from "./history.js";
import { chartManager } from "./chart.js";
import { certificateGenerator } from "./certificate.js";

// Global DOM Cache
const dom = {
  // Config Controls
  difficultySelect: document.getElementById("difficultySelect"),
  durationSelect: document.getElementById("durationSelect"),
  modePractice: document.getElementById("modePractice"),
  modeZen: document.getElementById("modeZen"),
  modeDaily: document.getElementById("modeDaily"),
  soundToggleBtn: document.getElementById("soundToggleBtn"),
  themeSelect: document.getElementById("themeSelect"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
  
  // Custom text container
  customInputToggle: document.getElementById("customInputToggle"),
  customInputCard: document.getElementById("customInputCard"),
  customInput: document.getElementById("customInput"),
  
  // Typing Container
  typingContainer: document.getElementById("typingContainer"),
  paragraphDisplay: document.getElementById("paragraphDisplay"),
  hiddenInput: document.getElementById("typingInput"), // maps to index.html textarea
  progressBar: document.getElementById("progressBar"),
  pausedOverlay: document.getElementById("pausedOverlay"),
  
  // Circular Timer
  timerCircle: document.getElementById("timerCircle"),
  timerText: document.getElementById("timerText"),
  timerWrapper: document.getElementById("timerWrapper"),
  
  // Live Metrics
  wpmDisplay: document.getElementById("wpm"),
  cpmDisplay: document.getElementById("cpm"),
  accuracyDisplay: document.getElementById("accuracy"),
  mistakesDisplay: document.getElementById("mistakes"),
  remainingDisplay: document.getElementById("remainingChars"),
  typedDisplay: document.getElementById("typedChars"),
  liveStatsBar: document.getElementById("liveStatsBar"),
  
  // Action Buttons
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resumeBtn: document.getElementById("resumeBtn"),
  restartBtn: document.getElementById("restartBtn"),
  retestBtn: document.getElementById("retestBtn"),
  replayMistakesBtn: document.getElementById("replayMistakesBtn"),
  
  // Modals & Panels
  certificateModal: document.getElementById("certificateModal"),
  certificateCanvas: document.getElementById("certificateCanvas"),
  certNameInput: document.getElementById("certNameInput"),
  downloadCertBtn: document.getElementById("downloadCertBtn"),
  closeCertBtn: document.getElementById("closeCertBtn"),
  
  leaderboardModal: document.getElementById("leaderboardModal"),
  leaderboardList: document.getElementById("leaderboardList"),
  closeLeaderboardBtn: document.getElementById("closeLeaderboardBtn"),
  openLeaderboardBtn: document.getElementById("openLeaderboardBtn"),
  
  shortcutsModal: document.getElementById("shortcutsModal"),
  openShortcutsBtn: document.getElementById("openShortcutsBtn"),
  closeShortcutsBtn: document.getElementById("closeShortcutsBtn"),
  
  // Dashboard & History
  highestWpmDisplay: document.getElementById("highestWpm"),
  avgWpmDisplay: document.getElementById("avgWpm"),
  highestAccDisplay: document.getElementById("highestAcc"),
  totalTestsDisplay: document.getElementById("totalTests"),
  avgAccDisplay: document.getElementById("avgAcc"),
  totalTimeDisplay: document.getElementById("totalTime"),
  currentStreakDisplay: document.getElementById("currentStreak"),
  
  historyList: document.getElementById("historyList"),
  historySearch: document.getElementById("historySearch"),
  historySort: document.getElementById("historySort"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  
  // Exports
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  exportPdfBtn: document.getElementById("exportPdfBtn"),
  
  // Achievements
  badgesGrid: document.getElementById("badgesGrid"),
  
  // Keyboard keys for Heatmap
  keyboardKeys: document.querySelectorAll(".keyboard-container .key")
};

// Application State
let mode = "practice"; // practice, zen, daily
let difficulty = "medium"; // easy, medium, hard, expert
let duration = 60; // seconds
let currentParagraph = "";
let timer = null;
let typingEngine = null;
let lastTestStats = null;

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("[Service Worker] Registered successfully:", reg.scope))
      .catch((err) => console.error("[Service Worker] Registration failed:", err));
  });
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  themeManager.init();
  historyManager.init();
  
  // Sync Theme Selector UI
  if (dom.themeSelect) {
    dom.themeSelect.value = themeManager.currentTheme;
    dom.themeSelect.addEventListener("change", (e) => {
      soundEngine.play("btnClick");
      themeManager.setTheme(e.target.value);
    });
  }

  // Setup sound button toggle state
  updateSoundButtonUI();

  // Initialize modular controllers
  timer = new Timer(handleTimerTick, handleTimerComplete);
  
  typingEngine = new TypingEngine({
    paragraphDisplay: dom.paragraphDisplay,
    hiddenInput: dom.hiddenInput,
    progressBar: dom.progressBar,
    wpmDisplay: dom.wpmDisplay,
    cpmDisplay: dom.cpmDisplay,
    accuracyDisplay: dom.accuracyDisplay,
    mistakesDisplay: dom.mistakesDisplay,
    remainingDisplay: dom.remainingDisplay,
    typedDisplay: dom.typedDisplay,
    onProgress: handleTypingProgress,
    onComplete: handleTypingComplete
  });

  // Load first paragraph
  loadNextParagraph();
  
  // Render stats, charts, history, achievements, and heatmap
  updateDashboard();
  chartManager.updateChart(historyManager.getRecords());
  renderHistory();
  renderAchievements();
  renderHeatmap();

  // Event Binding
  setupEventListeners();
});

// Configure Event Listeners
function setupEventListeners() {
  // Controls
  dom.startBtn.addEventListener("click", () => { soundEngine.play("btnClick"); startTest(); });
  dom.pauseBtn.addEventListener("click", () => { soundEngine.play("btnClick"); pauseTest(); });
  dom.resumeBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resumeTest(); });
  dom.restartBtn.addEventListener("click", () => { soundEngine.play("btnClick"); restartTest(); });
  dom.retestBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resetTest(); });
  dom.replayMistakesBtn.addEventListener("click", () => { soundEngine.play("btnClick"); replayMistakes(); });
  
  // Options
  dom.difficultySelect.addEventListener("change", (e) => {
    soundEngine.play("btnClick");
    difficulty = e.target.value;
    if (!timer.isRunning()) loadNextParagraph();
  });
  
  dom.durationSelect.addEventListener("change", (e) => {
    soundEngine.play("btnClick");
    duration = parseInt(e.target.value);
    resetTimerUI();
  });

  // Modes
  dom.modePractice.addEventListener("click", () => changeMode("practice"));
  dom.modeZen.addEventListener("click", () => changeMode("zen"));
  dom.modeDaily.addEventListener("click", () => changeMode("daily"));
  
  // Sound
  dom.soundToggleBtn.addEventListener("click", () => {
    const enabled = soundEngine.toggle();
    updateSoundButtonUI();
    soundEngine.play("btnClick");
  });

  // Fullscreen
  dom.fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Custom Paragraph Toggle
  dom.customInputToggle.addEventListener("click", () => {
    soundEngine.play("btnClick");
    dom.customInputCard.classList.toggle("hidden");
    if (!dom.customInputCard.classList.contains("hidden")) {
      dom.customInput.focus();
    }
  });

  dom.customInput.addEventListener("input", () => {
    if (!timer.isRunning() && dom.customInput.value.trim().length > 0) {
      loadNextParagraph();
    }
  });

  // Clicking typingContainer focuses the text area (vital for mobile keyboard)
  dom.typingContainer.addEventListener("click", () => {
    if (timer.isRunning() && !timer.isPaused()) {
      typingEngine.focus();
    }
  });

  dom.hiddenInput.addEventListener("input", () => {
    const elapsed = timer.getTimeElapsed();
    typingEngine.handleInput(elapsed);
  });

  // History & Exports
  dom.historySearch.addEventListener("input", renderHistory);
  dom.historySort.addEventListener("change", renderHistory);
  dom.clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire history? This cannot be undone.")) {
      soundEngine.play("btnClick");
      historyManager.clearAll();
      updateDashboard();
      chartManager.updateChart([]);
      renderHistory();
      renderAchievements();
      renderHeatmap();
    }
  });

  dom.exportCsvBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportCSV(); });
  dom.exportJsonBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportJSON(); });
  dom.exportPdfBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportPDF(); });

  // Modals
  dom.closeCertBtn.addEventListener("click", () => dom.certificateModal.classList.add("hidden"));
  dom.downloadCertBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    certificateGenerator.downloadPDF(dom.certificateCanvas, dom.certNameInput.value);
  });

  dom.openLeaderboardBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    renderLeaderboardUI();
    dom.leaderboardModal.classList.remove("hidden");
  });
  dom.closeLeaderboardBtn.addEventListener("click", () => dom.leaderboardModal.classList.add("hidden"));

  dom.openShortcutsBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    dom.shortcutsModal.classList.remove("hidden");
  });
  dom.closeShortcutsBtn.addEventListener("click", () => dom.shortcutsModal.classList.add("hidden"));

  // Close modals on background click
  window.addEventListener("click", (e) => {
    if (e.target === dom.certificateModal) dom.certificateModal.classList.add("hidden");
    if (e.target === dom.leaderboardModal) dom.leaderboardModal.classList.add("hidden");
    if (e.target === dom.shortcutsModal) dom.shortcutsModal.classList.add("hidden");
  });

  // Keyboard Shortcuts
  window.addEventListener("keydown", handleKeyboardShortcuts);
}

// Sound Button UI Helper
function updateSoundButtonUI() {
  if (soundEngine.enabled) {
    dom.soundToggleBtn.innerHTML = "🔊 Sound On";
    dom.soundToggleBtn.classList.remove("muted");
  } else {
    dom.soundToggleBtn.innerHTML = "🔇 Sound Off";
    dom.soundToggleBtn.classList.add("muted");
  }
}

// Mode Selection Coordinator
function changeMode(newMode) {
  if (timer.isRunning()) {
    if (!confirm("A typing test is currently active. Change mode anyway?")) return;
    timer.stop();
    resetTest();
  }
  
  soundEngine.play("btnClick");
  mode = newMode;
  
  // Reset buttons classes
  dom.modePractice.classList.remove("active");
  dom.modeZen.classList.remove("active");
  dom.modeDaily.classList.remove("active");
  
  if (mode === "practice") {
    dom.modePractice.classList.add("active");
    dom.difficultySelect.disabled = false;
    dom.customInputToggle.disabled = false;
    dom.durationSelect.disabled = false;
  } else if (mode === "zen") {
    dom.modeZen.classList.add("active");
    dom.difficultySelect.disabled = false;
    dom.customInputToggle.disabled = false;
    dom.durationSelect.disabled = true; // Zen has no timer
  } else if (mode === "daily") {
    dom.modeDaily.classList.add("active");
    dom.difficultySelect.disabled = true;
    dom.customInputToggle.disabled = true;
    dom.durationSelect.disabled = false;
  }
  
  loadNextParagraph();
}

// Load paragraph based on configurations
async function loadNextParagraph() {
  typingEngine.reset();
  
  if (mode === "daily") {
    currentParagraph = getDailyParagraph();
  } else if (dom.customInput.value.trim().length > 0 && !dom.customInputCard.classList.contains("hidden")) {
    currentParagraph = dom.customInput.value.trim();
  } else {
    // Standard random paragraph
    currentParagraph = getRandomParagraph(difficulty);
  }
  
  typingEngine.loadParagraph(currentParagraph);
  resetTimerUI();
}

// Timer UI Reset
function resetTimerUI() {
  if (mode === "zen") {
    dom.timerText.textContent = "∞";
    dom.timerCircle.style.strokeDashoffset = "0";
  } else {
    dom.timerText.textContent = duration;
    dom.timerCircle.style.strokeDashoffset = "0";
  }
}

// Start Test
function startTest() {
  if (timer.isRunning()) return;

  // Validation
  if (!currentParagraph || currentParagraph.length < 5) {
    alert("Paragraph is too short or empty! Please select a valid paragraph.");
    return;
  }

  // Visual Zen Mode
  if (mode === "zen") {
    dom.timerText.textContent = "Zen";
  } else {
    timer.start(duration);
  }
  
  typingEngine.start();
  
  // UI updates
  dom.startBtn.classList.add("hidden");
  dom.pauseBtn.classList.remove("hidden");
  dom.resumeBtn.classList.add("hidden");
  
  // Fade out stats in Zen mode
  if (mode === "zen") {
    dom.liveStatsBar.classList.add("zen-fade");
    dom.timerWrapper.classList.add("zen-fade");
  } else {
    dom.liveStatsBar.classList.remove("zen-fade");
    dom.timerWrapper.classList.remove("zen-fade");
  }
}

// Pause Test
function pauseTest() {
  if (!timer.isRunning() || timer.isPaused()) return;
  
  timer.pause();
  dom.pausedOverlay.classList.remove("hidden");
  dom.hiddenInput.disabled = true;
  
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.remove("hidden");
}

// Resume Test
function resumeTest() {
  if (!timer.isRunning() || !timer.isPaused()) return;
  
  timer.resume();
  dom.pausedOverlay.classList.add("hidden");
  dom.hiddenInput.disabled = false;
  dom.hiddenInput.focus();
  
  dom.resumeBtn.classList.add("hidden");
  dom.pauseBtn.classList.remove("hidden");
}

// Stop Test
function stopTest() {
  if (!timer.isRunning() && mode !== "zen") return;
  
  timer.stop();
  handleTestFinished();
}

// Restart Test
function restartTest() {
  timer.stop();
  typingEngine.reset();
  loadNextParagraph();
  
  dom.startBtn.classList.remove("hidden");
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.add("hidden");
  dom.pausedOverlay.classList.add("hidden");
  
  dom.liveStatsBar.classList.remove("zen-fade");
  dom.timerWrapper.classList.remove("zen-fade");
}

// Reset / Clear Metrics UI
function resetTest() {
  timer.stop();
  typingEngine.reset();
  resetTimerUI();
  
  dom.startBtn.classList.remove("hidden");
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.add("hidden");
  dom.pausedOverlay.classList.add("hidden");
  
  dom.liveStatsBar.classList.remove("zen-fade");
  dom.timerWrapper.classList.remove("zen-fade");
}

// Replay Mistakes Mode
function replayMistakes() {
  const replayText = typingEngine.getReplayParagraph();
  if (!replayText) {
    alert("Amazing! You made 0 mistakes in the last test to replay.");
    return;
  }
  
  timer.stop();
  typingEngine.reset();
  currentParagraph = replayText;
  typingEngine.loadParagraph(currentParagraph);
  resetTimerUI();
  
  startTest();
}

// Fullscreen Control
function toggleFullscreen() {
  soundEngine.play("btnClick");
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      alert(`Error attempting to enable fullscreen mode: ${err.message}`);
    });
    dom.fullscreenBtn.innerHTML = "🗖 Windowed";
  } else {
    document.exitFullscreen();
    dom.fullscreenBtn.innerHTML = "🗗 Fullscreen";
  }
}

// Handle Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
  const activeEl = document.activeElement;
  
  // Ignore shortcuts if user is typing in a modal name field or search box
  if (activeEl === dom.certNameInput || activeEl === dom.historySearch || activeEl === dom.customInput) {
    return;
  }

  // Ctrl+R -> Restart test (prevent browser reload)
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    restartTest();
  }
  
  // Enter -> Start test (only if test is NOT running and not in input field)
  if (e.key === "Enter" && !timer.isRunning() && activeEl !== dom.hiddenInput) {
    e.preventDefault();
    startTest();
  }

  // Esc -> Stop/Pause test
  if (e.key === "Escape" && timer.isRunning()) {
    e.preventDefault();
    if (timer.isPaused()) {
      resumeTest();
    } else {
      pauseTest();
    }
  }
}

// Timer Tick Callback
function handleTimerTick(timeLeft) {
  dom.timerText.textContent = timeLeft;
  
  // Update circular Progress
  // Circumference of r=45 circle is ~282.74
  const circumference = 282.74;
  const progressRatio = (duration - timeLeft) / duration;
  const offset = circumference * progressRatio;
  
  dom.timerCircle.style.strokeDashoffset = offset;
}

// Timer Timeout Callback
function handleTimerComplete() {
  handleTestFinished();
}

// Typing Keystroke Callback
function handleTypingProgress(typedLength, totalLength) {
  // If Zen mode, update stats but they remain faded.
  // In normal mode, metrics update in real time.
}

// Typing Fully Completed Callback
function handleTypingComplete() {
  if (mode === "zen") {
    handleTestFinished();
  }
}

// Core Test Finishing Logic
function handleTestFinished() {
  soundEngine.play("success");
  
  const timeElapsed = mode === "zen" ? 10 : (duration - timer.timeLeft); // Zen mode mock duration or actual
  const actualElapsed = Math.max(1, timeElapsed);
  
  const finalWpm = typingEngine.getWPM(actualElapsed);
  const finalAcc = typingEngine.getAccuracy();
  const finalMistakes = typingEngine.getMistakes();
  
  // Save result to stats
  lastTestStats = historyManager.addRecord(
    finalWpm,
    finalAcc,
    finalMistakes,
    actualElapsed,
    mode === "daily" ? "daily" : difficulty,
    currentParagraph
  );

  // Sync heatmap errors with cumulative LocalStorage map
  mergeToCumulativeHeatmap(typingEngine.getHeatmapData());

  // Show stats again (if zen mode was active)
  dom.liveStatsBar.classList.remove("zen-fade");
  dom.timerWrapper.classList.remove("zen-fade");

  // Reset controls
  dom.startBtn.classList.remove("hidden");
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.add("hidden");
  dom.pausedOverlay.classList.add("hidden");
  
  // Update dashboard, charts, history list, achievements, and heatmaps
  updateDashboard();
  chartManager.updateChart(historyManager.getRecords());
  renderHistory();
  renderAchievements();
  renderHeatmap();
  
  // Check Leaderboard Eligibility
  checkLeaderboardEligibility(finalWpm, finalAcc);
  
  // Trigger Confetti for achievements or high scores!
  triggerFinishedConfetti(finalWpm, finalAcc);
}

// Merge Heatmap Data
function mergeToCumulativeHeatmap(currentRunMap) {
  const cumulative = storage.get("agTyperHeatmap", {});
  for (let key in currentRunMap) {
    cumulative[key] = (cumulative[key] || 0) + currentRunMap[key];
  }
  storage.set("agTyperHeatmap", cumulative);
}

// Heatmap Renderer
function renderHeatmap() {
  const heatmap = storage.get("agTyperHeatmap", {});
  const values = Object.values(heatmap);
  const maxMistakes = values.length > 0 ? Math.max(...values) : 0;
  
  dom.keyboardKeys.forEach((keyEl) => {
    const keyVal = keyEl.getAttribute("data-key");
    if (!keyVal) return;
    
    const count = heatmap[keyVal.toLowerCase()] || 0;
    keyEl.classList.remove("heatmap-level-0", "heatmap-level-1", "heatmap-level-2", "heatmap-level-3");
    
    if (count > 0 && maxMistakes > 0) {
      const ratio = count / maxMistakes;
      if (ratio <= 0.25) {
        keyEl.classList.add("heatmap-level-0");
      } else if (ratio <= 0.5) {
        keyEl.classList.add("heatmap-level-1");
      } else if (ratio <= 0.75) {
        keyEl.classList.add("heatmap-level-2");
      } else {
        keyEl.classList.add("heatmap-level-3");
      }
      keyEl.setAttribute("title", `${count} mistakes on key ${keyVal.toUpperCase()}`);
    } else {
      keyEl.removeAttribute("title");
    }
  });
}

// Achievements & Badges Verification
function renderAchievements() {
  const records = historyManager.getRecords();
  const unlocked = storage.get("agTyperBadges", []);
  
  const streak = calculateStreak(records);
  const bestWpm = records.length > 0 ? Math.max(...records.map((r) => r.wpm)) : 0;
  const bestAcc = records.length > 0 ? Math.max(...records.map((r) => r.accuracy)) : 0;

  const achievementsList = [
    { id: "first_test", title: "First Flight", desc: "Complete 1 typing speed test", icon: "🚀", met: records.length >= 1 },
    { id: "wpm_50", title: "Speedy Cadet", desc: "Reach 50 Words Per Minute", icon: "⚡", met: bestWpm >= 50 },
    { id: "wpm_80", title: "Key Master", desc: "Reach 80 Words Per Minute", icon: "🥇", met: bestWpm >= 80 },
    { id: "wpm_100", title: "Antigravity Typer", desc: "Reach 100 Words Per Minute", icon: "🌌", met: bestWpm >= 100 },
    { id: "perfect_acc", title: "Perfectionist", desc: "Achieve 100% typing accuracy", icon: "🎯", met: bestAcc === 100 },
    { id: "tests_10", title: "Daily Typist", desc: "Complete 10 total tests", icon: "📚", met: records.length >= 10 },
    { id: "tests_50", title: "Word Slinger", desc: "Complete 50 total tests", icon: "⚔️", met: records.length >= 50 },
    { id: "streak_3", title: "Unstoppable", desc: "Maintain a 3-day typing streak", icon: "🔥", met: streak >= 3 }
  ];

  let newlyUnlocked = false;
  const nextUnlockedList = [...unlocked];

  dom.badgesGrid.innerHTML = "";
  achievementsList.forEach((ach) => {
    const isAlreadyUnlocked = unlocked.includes(ach.id);
    const isUnlockedNow = ach.met;
    
    if (isUnlockedNow && !isAlreadyUnlocked) {
      nextUnlockedList.push(ach.id);
      newlyUnlocked = true;
    }

    const badge = document.createElement("div");
    badge.className = `badge-card glass-card ${isUnlockedNow ? "unlocked" : "locked"}`;
    badge.innerHTML = `
      <div class="badge-icon">${ach.icon}</div>
      <div class="badge-info">
        <h3>${ach.title}</h3>
        <p>${ach.desc}</p>
      </div>
      <span class="badge-status">${isUnlockedNow ? "✓" : "🔒"}</span>
    `;
    dom.badgesGrid.appendChild(badge);
  });

  if (newlyUnlocked) {
    storage.set("agTyperBadges", nextUnlockedList);
    // Show toast or play effect
    setTimeout(() => {
      triggerConfettiRain();
    }, 500);
  }
}

// Daily Streak Calculator
function calculateStreak(records) {
  if (records.length === 0) return 0;
  
  // Extract unique sorted dates (local date format YYYY-MM-DD)
  const uniqueDates = Array.from(new Set(records.map((r) => {
    const d = new Date(r.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }))).sort().reverse(); // Decending (newest first)
  
  if (uniqueDates.length === 0) return 0;
  
  const todayStr = getLocalDateStr(new Date());
  const yesterdayStr = getLocalDateStr(new Date(Date.now() - 86400000));
  
  // Streak only continues if they did a test today or yesterday
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }
  
  let streak = 1;
  let currentCheck = new Date(uniqueDates[0]);
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const nextDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(currentCheck - nextDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      currentCheck = nextDate;
    } else if (diffDays > 1) {
      break;
    }
  }
  return streak;
}

function getLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Dashboard Update
function updateDashboard() {
  const records = historyManager.getRecords();
  const totalTests = records.length;
  
  if (totalTests === 0) {
    dom.highestWpmDisplay.textContent = "0";
    dom.avgWpmDisplay.textContent = "0";
    dom.highestAccDisplay.textContent = "0%";
    dom.avgAccDisplay.textContent = "0%";
    dom.totalTestsDisplay.textContent = "0";
    dom.totalTimeDisplay.textContent = "0s";
    dom.currentStreakDisplay.textContent = "0 days";
    return;
  }

  const highestWpm = Math.max(...records.map((r) => r.wpm));
  const avgWpm = Math.round(records.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
  const highestAcc = Math.max(...records.map((r) => r.accuracy));
  const avgAcc = Math.round(records.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const streak = calculateStreak(records);

  // Animate numbers gently
  animateNumber(dom.highestWpmDisplay, 0, highestWpm, 1000);
  animateNumber(dom.avgWpmDisplay, 0, avgWpm, 1000);
  dom.highestAccDisplay.textContent = `${highestAcc}%`;
  dom.avgAccDisplay.textContent = `${avgAcc}%`;
  dom.totalTestsDisplay.textContent = totalTests;
  dom.totalTimeDisplay.textContent = `${totalDuration}s`;
  dom.currentStreakDisplay.textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
}

function animateNumber(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Render history list to DOM
function renderHistory() {
  const query = dom.historySearch.value;
  const sortBy = dom.historySort.value;
  const records = historyManager.searchAndSort(query, sortBy);

  dom.historyList.innerHTML = "";
  
  if (records.length === 0) {
    dom.historyList.innerHTML = `<li class="empty-history-placeholder">No typing tests match the search query.</li>`;
    return;
  }

  records.forEach((record) => {
    const li = document.createElement("li");
    li.className = "history-item glass-card";
    li.innerHTML = `
      <div class="hist-main-info">
        <span class="hist-date">${record.date}</span>
        <div class="hist-badge-row">
          <span class="hist-badge wpm-badge">${record.wpm} WPM</span>
          <span class="hist-badge acc-badge">${record.accuracy}% Acc</span>
          <span class="hist-badge diff-badge ${record.difficulty}">${record.difficulty.toUpperCase()}</span>
        </div>
      </div>
      <div class="hist-details">
        <p class="hist-paragraph">"${record.paragraph.substring(0, 75)}..."</p>
        <div class="hist-actions">
          <button class="btn btn-sm btn-outline btn-cert" data-id="${record.id}">📜 Cert</button>
          <button class="btn btn-sm btn-danger btn-del" data-id="${record.id}">✕</button>
        </div>
      </div>
    `;
    
    // Bind buttons
    li.querySelector(".btn-del").addEventListener("click", (e) => {
      e.stopPropagation();
      soundEngine.play("btnClick");
      historyManager.deleteRecord(record.id);
      updateDashboard();
      chartManager.updateChart(historyManager.getRecords());
      renderHistory();
      renderAchievements();
      renderHeatmap();
    });

    li.querySelector(".btn-cert").addEventListener("click", (e) => {
      e.stopPropagation();
      soundEngine.play("btnClick");
      openCertificateModal(record);
    });

    dom.historyList.appendChild(li);
  });
}

// Certificate Modal Coordinator
function openCertificateModal(record) {
  // Pre-fill name input or prompt
  const savedName = storage.get("agTyperUserName", "");
  dom.certNameInput.value = savedName;

  const drawAndDisplay = () => {
    storage.set("agTyperUserName", dom.certNameInput.value);
    certificateGenerator.drawCertificate(
      dom.certificateCanvas,
      dom.certNameInput.value,
      record.wpm,
      record.accuracy,
      record.difficulty,
      record.date
    );
  };

  // Draw once initially
  drawAndDisplay();

  // Listen to input changes to redraw certificate in real time!
  dom.certNameInput.removeEventListener("input", drawAndDisplay);
  dom.certNameInput.addEventListener("input", drawAndDisplay);

  dom.certificateModal.classList.remove("hidden");
}

// Leaderboard Manager
function checkLeaderboardEligibility(wpm, accuracy) {
  const leaderboard = storage.get("agTyperLeaderboard", []);
  
  const isEligible = leaderboard.length < 10 || wpm > leaderboard[leaderboard.length - 1].wpm;
  
  if (isEligible) {
    // Timeout to let congratulations audio complete
    setTimeout(() => {
      const name = prompt("🏆 New High Score! Enter your name for the Leaderboard:", storage.get("agTyperUserName", ""));
      if (name && name.trim()) {
        const username = name.trim();
        storage.set("agTyperUserName", username);
        
        leaderboard.push({
          name: username,
          wpm,
          accuracy,
          difficulty: difficulty,
          date: new Date().toLocaleDateString()
        });
        
        // Sort: WPM desc, Accuracy desc
        leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
        
        // Keep top 10
        storage.set("agTyperLeaderboard", leaderboard.slice(0, 10));
        
        // Show leaderboard
        renderLeaderboardUI();
        dom.leaderboardModal.classList.remove("hidden");
      }
    }, 800);
  }
}

function renderLeaderboardUI() {
  const leaderboard = storage.get("agTyperLeaderboard", []);
  dom.leaderboardList.innerHTML = "";
  
  if (leaderboard.length === 0) {
    dom.leaderboardList.innerHTML = `<li class="empty-placeholder">Leaderboard is currently empty. Beat a score to appear here!</li>`;
    return;
  }

  leaderboard.forEach((entry, idx) => {
    const li = document.createElement("li");
    li.className = `leaderboard-entry ${idx === 0 ? "first-place" : ""}`;
    li.innerHTML = `
      <span class="leader-rank">#${idx + 1}</span>
      <span class="leader-name">${entry.name}</span>
      <span class="leader-wpm">${entry.wpm} WPM</span>
      <span class="leader-acc">${entry.accuracy}% Acc</span>
      <span class="leader-diff badge-${entry.difficulty}">${entry.difficulty.toUpperCase()}</span>
    `;
    dom.leaderboardList.appendChild(li);
  });
}

// Confetti triggers
function triggerFinishedConfetti(wpm, accuracy) {
  if (wpm >= 60 && accuracy >= 90) {
    triggerConfettiRain();
  }
}

function triggerConfettiRain() {
  if (typeof confetti === "undefined") return;
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
