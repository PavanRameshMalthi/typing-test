import { soundEngine, getRandomParagraph, getDailyParagraph, fetchQuote, storage, getPracticeContent } from "./utils.js";
import { themeManager } from "./theme.js";
import { Timer } from "./timer.js";
import { TypingEngine } from "./typing.js";
import { historyManager } from "./history.js";
import { chartManager } from "./chart.js";
import { certificateGenerator } from "./certificate.js";
import { profileManager } from "./profile.js";
import { lessonsManager } from "./lessons.js";
import { typingGames } from "./games.js";

// Global DOM Cache
const dom = {
  // Navigation Tabs
  tabs: document.querySelectorAll(".platform-tabs .tab-btn"),
  tabContents: document.querySelectorAll(".tab-content"),
  
  // Profile elements
  profileAvatar: document.getElementById("profileAvatar"),
  profileLevel: document.getElementById("profileLevel"),
  xpProgressFill: document.getElementById("xpProgressFill"),
  xpText: document.getElementById("xpText"),
  coinsText: document.getElementById("coinsText"),
  
  // Config Controls (Practice Tab)
  practiceTypeSelect: document.getElementById("practiceTypeSelect"),
  practiceSubtypeSelect: document.getElementById("practiceSubtypeSelect"),
  practiceSubtypeGroup: document.getElementById("practiceSubtypeGroup"),
  difficultyGroup: document.getElementById("difficultyGroup"),
  difficultySelect: document.getElementById("difficultySelect"),
  durationSelect: document.getElementById("durationSelect"),
  modePractice: document.getElementById("modePractice"),
  modeZen: document.getElementById("modeZen"),
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
  hiddenInput: document.getElementById("typingInput"),
  progressBar: document.getElementById("progressBar"),
  pausedOverlay: document.getElementById("pausedOverlay"),
  
  // Results Overlay
  resultsOverlay: document.getElementById("resultsOverlay"),
  resTitle: document.getElementById("resTitle"),
  resWpm: document.getElementById("resWpm"),
  resCpm: document.getElementById("resCpm"),
  resAcc: document.getElementById("resAcc"),
  resMistakes: document.getElementById("resMistakes"),
  resTime: document.getElementById("resTime"),
  resXp: document.getElementById("resXp"),
  resCoins: document.getElementById("resCoins"),
  resPracticeAgainBtn: document.getElementById("resPracticeAgainBtn"),
  resReplayMistakesBtn: document.getElementById("resReplayMistakesBtn"),
  resCertBtn: document.getElementById("resCertBtn"),
  
  // Campaign Levels Progression HUD
  campaignCurrentLevel: document.getElementById("campaignCurrentLevel"),
  campaignCompletionPercent: document.getElementById("campaignCompletionPercent"),
  campaignCompletedLevelsCount: document.getElementById("campaignCompletedLevelsCount"),
  campaignProgressBarFill: document.getElementById("campaignProgressBarFill"),
  campaignProgressBarAscii: document.getElementById("campaignProgressBarAscii"),
  
  // Combo
  comboContainer: document.getElementById("comboContainer"),
  comboNumber: document.getElementById("comboNumber"),
  
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
  heroStartBtn: document.getElementById("heroStartBtn"),
  heroPracticeBtn: document.getElementById("heroPracticeBtn"),
  
  // Finger Guide
  nextKeyGuide: document.getElementById("nextKeyGuide"),
  nextFingerGuide: document.getElementById("nextFingerGuide"),
  
  // Lessons / Levels Grid
  lessonsGrid: document.getElementById("lessonsGrid"),
  
  // Games
  gameSelectionPanel: document.getElementById("gameSelectionPanel"),
  gamePlayPanel: document.getElementById("gamePlayPanel"),
  gameCanvas: document.getElementById("gameCanvas"),
  restartGameBtn: document.getElementById("restartGameBtn"),
  exitGameBtn: document.getElementById("exitGameBtn"),
  activeGameTitle: document.getElementById("activeGameTitle"),
  
  // Game Results Overlay
  gameResultsOverlay: document.getElementById("gameResultsOverlay"),
  gameResTitle: document.getElementById("gameResTitle"),
  gameResScore: document.getElementById("gameResScore"),
  gameResAcc: document.getElementById("gameResAcc"),
  gameResTime: document.getElementById("gameResTime"),
  gameResXp: document.getElementById("gameResXp"),
  gameResCoins: document.getElementById("gameResCoins"),
  gameResPlayAgainBtn: document.getElementById("gameResPlayAgainBtn"),
  gameResNextGameBtn: document.getElementById("gameResNextGameBtn"),
  gameResExitBtn: document.getElementById("gameResExitBtn"),
  gameResHomeBtn: document.getElementById("gameResHomeBtn"),
  
  // Shop
  shopCategoryButtons: document.querySelectorAll(".shop-category-btn"),
  shopItemsGrid: document.getElementById("shopItemsGrid"),
  
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
  badgesGrid: document.getElementById("badgesGrid")
};

// Application State
let activeTab = "practice";
let activeLessonId = null;
let activeChallengeType = null;
let mode = "practice"; // practice, zen
let difficulty = "medium"; // easy, medium, hard, expert
let duration = 60; // seconds
let currentParagraph = "";
let timer = null;
let typingEngine = null;
let lastTestStats = null;
let isTestActive = false; // BUG 5 & BUG 4 DUPLICATE PREVENTER

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  themeManager.init();
  historyManager.init();
  profileManager.init();
  lessonsManager.init();
  typingGames.init(dom.gameCanvas);
  
  // Render initial profile state
  updateProfileUI();
  applyEquippedCursor(profileManager.selectedCursor);
  themeManager.setTheme(profileManager.selectedTheme);

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
    onComplete: handleTypingComplete,
    onKeyPress: handleKeyPair,
    onNextKey: handleNextKey,
    onCombo: handleComboUpdate
  });

  // Load first paragraph
  loadNextParagraph();
  
  // Render dashboards, structures
  updateDashboard();
  chartManager.updateChart(historyManager.getRecords());
  renderHistory();
  renderAchievements();
  renderLevelsProgressionHUD();
  renderLessons();
  renderChallenges();
  renderShop("themes");

  // Event Binding
  setupEventListeners();
});

// Configure Event Listeners
function setupEventListeners() {
  // Navigation Tabs
  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      soundEngine.play("btnClick");
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  // Controls
  dom.startBtn.addEventListener("click", () => { soundEngine.play("btnClick"); startTest(); });
  dom.pauseBtn.addEventListener("click", () => { soundEngine.play("btnClick"); pauseTest(); });
  dom.resumeBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resumeTest(); });
  dom.restartBtn.addEventListener("click", () => { soundEngine.play("btnClick"); restartTest(); });
  dom.retestBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resetTest(); });
  dom.replayMistakesBtn.addEventListener("click", () => { soundEngine.play("btnClick"); replayMistakes(); });
  
  // Hero Section CTA Buttons
  if (dom.heroStartBtn) {
    dom.heroStartBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      dom.typingContainer.scrollIntoView({ behavior: "smooth" });
      startTest();
    });
  }
  if (dom.heroPracticeBtn) {
    dom.heroPracticeBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      dom.typingContainer.scrollIntoView({ behavior: "smooth" });
      typingEngine.focus();
    });
  }
  
  // Results Overlay Controls
  dom.resPracticeAgainBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    restartTest();
    startTest();
  });
  dom.resReplayMistakesBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    replayMistakes();
  });
  dom.resCertBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    if (lastTestStats) {
      openCertificateModal(lastTestStats);
    } else {
      alert("No completed test record found for this session.");
    }
  });

  // Options (Practice Settings)
  dom.difficultySelect.addEventListener("change", (e) => {
    soundEngine.play("btnClick");
    difficulty = e.target.value;
    if (!isTestActive) loadNextParagraph();
  });
  
  dom.durationSelect.addEventListener("change", (e) => {
    soundEngine.play("btnClick");
    duration = parseInt(e.target.value);
    resetTimerUI();
  });

  dom.practiceTypeSelect.addEventListener("change", () => {
    soundEngine.play("btnClick");
    updatePracticeSubtypes();
    if (!isTestActive) loadNextParagraph();
  });

  dom.practiceSubtypeSelect.addEventListener("change", () => {
    soundEngine.play("btnClick");
    if (!isTestActive) loadNextParagraph();
  });

  // Modes
  dom.modePractice.addEventListener("click", () => changeMode("practice"));
  dom.modeZen.addEventListener("click", () => changeMode("zen"));
  
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
    if (!isTestActive && dom.customInput.value.trim().length > 0) {
      loadNextParagraph();
    }
  });

  // Clicking typingContainer focuses the text area
  dom.typingContainer.addEventListener("click", () => {
    if (isTestActive && !timer.isPaused()) {
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

  // Shop Category Switching
  dom.shopCategoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      dom.shopCategoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderShop(btn.getAttribute("data-category"));
    });
  });

  // Dedicated Game Restart
  dom.restartGameBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    dom.gameResultsOverlay.classList.add("hidden");
    typingGames.startGame(typingGames.activeGame);
  });

  // Games Exit button
  dom.exitGameBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    typingGames.stopGame();
    dom.gamePlayPanel.classList.add("hidden");
    dom.gameSelectionPanel.classList.remove("hidden");
  });

  // Game Results Overlay Controls (Issue 3)
  dom.gameResPlayAgainBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    dom.gameResultsOverlay.classList.add("hidden");
    typingGames.startGame(typingGames.activeGame);
  });

  dom.gameResNextGameBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    dom.gameResultsOverlay.classList.add("hidden");
    
    // Cycle to next game
    const games = ["fruitCatch", "spaceShooter", "rocketRace", "carRacing", "zombieEscape"];
    let nextIdx = games.indexOf(typingGames.activeGame) + 1;
    if (nextIdx >= games.length) nextIdx = 0;
    
    const nextGame = games[nextIdx];
    const names = {
      fruitCatch: "Fruit Catch Mode",
      spaceShooter: "Space Shooter Mode",
      rocketRace: "Rocket Race",
      carRacing: "Car Racing",
      zombieEscape: "Zombie Escape"
    };
    dom.activeGameTitle.textContent = names[nextGame] || "Type Game";
    typingGames.startGame(nextGame);
  });

  dom.gameResExitBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    typingGames.stopGame();
    dom.gameResultsOverlay.classList.add("hidden");
    dom.gamePlayPanel.classList.add("hidden");
    dom.gameSelectionPanel.classList.remove("hidden");
  });

  dom.gameResHomeBtn.addEventListener("click", () => {
    soundEngine.play("btnClick");
    typingGames.stopGame();
    dom.gameResultsOverlay.classList.add("hidden");
    switchTab("practice");
  });

  // Game Over callback (Issue 3 & 8)
  typingGames.onGameOver = (score, coinsEarned, xpEarned, playerWon, accuracy, elapsedSeconds, wpm, cpm, mistakes) => {
    dom.gameResTitle.textContent = playerWon ? "🎉 Level Complete!" : "💀 Game Over!";
    dom.gameResScore.textContent = score;
    dom.gameResAcc.textContent = `${accuracy}%`;
    dom.gameResTime.textContent = `${elapsedSeconds}s`;
    dom.gameResXp.textContent = `+${xpEarned} XP`;
    dom.gameResCoins.textContent = `🪙 +${coinsEarned}`;
    
    updateProfileUI(); // update XP / Coin widgets in header!
    dom.gameResultsOverlay.classList.remove("hidden");
  };

  // Games Select play buttons
  document.querySelectorAll(".start-game-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      const gameType = btn.getAttribute("data-game");
      dom.gameSelectionPanel.classList.add("hidden");
      dom.gamePlayPanel.classList.remove("hidden");
      dom.gameResultsOverlay.classList.add("hidden");
      
      const names = {
        fruitCatch: "Fruit Catch Mode",
        spaceShooter: "Space Shooter Mode",
        rocketRace: "Rocket Race",
        carRacing: "Car Racing",
        zombieEscape: "Zombie Escape"
      };
      dom.activeGameTitle.textContent = names[gameType] || "Type Game";
      
      typingGames.startGame(gameType);
    });
  });

  // Canvas game key listener forwards keystrokes
  window.addEventListener("keydown", (e) => {
    if (typingGames.isRunning) {
      if (e.key === " ") e.preventDefault();
      typingGames.handleKeystroke(e.key);
    }
  });

  // Listen to daily challenge clicks
  document.querySelectorAll(".btn-challenge-play").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      const chalType = btn.getAttribute("data-chal");
      startDailyChallenge(chalType);
    });
  });

  // Level Up callback
  profileManager.onLevelUp = (level) => {
    showLevelUpEffect(level);
  };
}

// Switch navigation tabs
function switchTab(tabId) {
  activeTab = tabId;
  
  dom.tabs.forEach((tab) => {
    if (tab.getAttribute("data-tab") === tabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  dom.tabContents.forEach((content) => {
    if (content.id === `tab-${tabId}`) {
      content.classList.remove("hidden");
      content.classList.add("active");
    } else {
      content.classList.add("hidden");
      content.classList.remove("active");
    }
  });

  if (tabId !== "practice") {
    timer.stop();
    typingEngine.reset();
    isTestActive = false;
    dom.resultsOverlay.classList.add("hidden");
    resetTimerUI();
    dom.startBtn.classList.remove("hidden");
    dom.startBtn.disabled = false;
    dom.pauseBtn.classList.add("hidden");
    dom.resumeBtn.classList.add("hidden");
    dom.pausedOverlay.classList.add("hidden");
  }

  if (tabId !== "games") {
    typingGames.stopGame();
    dom.gameResultsOverlay.classList.add("hidden");
    dom.gamePlayPanel.classList.add("hidden");
    dom.gameSelectionPanel.classList.remove("hidden");
  }

  if (tabId === "stats") {
    updateDashboard();
    chartManager.updateChart(historyManager.getRecords());
    renderHistory();
    renderAchievements();
  }
}

// Update Practice Subtypes
function updatePracticeSubtypes() {
  const type = dom.practiceTypeSelect.value;
  dom.practiceSubtypeSelect.innerHTML = "";

  if (type === "paragraph") {
    dom.practiceSubtypeGroup.classList.add("hidden");
    dom.difficultyGroup.classList.remove("hidden");
  } else {
    dom.practiceSubtypeGroup.classList.remove("hidden");
    dom.difficultyGroup.classList.add("hidden");

    let options = [];
    if (type === "letters") {
      options = [
        { value: "home", label: "Home Row Keys" },
        { value: "top", label: "Top Row Keys" },
        { value: "bottom", label: "Bottom Row Keys" },
        { value: "all", label: "Full Alphabet Mix" }
      ];
    } else if (type === "words") {
      options = [
        { value: "easy", label: "Easy Short Words" },
        { value: "medium", label: "Medium Length Words" },
        { value: "hard", label: "Long/Complex Words" }
      ];
    } else if (type === "sentences") {
      options = [
        { value: "easy", label: "Easy Short Sentences" },
        { value: "medium", label: "Medium Sentences" },
        { value: "hard", label: "Difficult Sentences" }
      ];
    } else if (type === "numbers") {
      options = [
        { value: "phone", label: "Phone Numbers" },
        { value: "years", label: "Historical Years" },
        { value: "prices", label: "Currency Prices" },
        { value: "random", label: "Random Digits" }
      ];
    } else if (type === "symbols") {
      options = [
        { value: "brackets", label: "Brackets & Parens" },
        { value: "operators", label: "Logic Operators" },
        { value: "mixed", label: "All Symbols Rush" }
      ];
    } else if (type === "programming") {
      options = [
        { value: "js", label: "JavaScript / Node" },
        { value: "html", label: "HTML5 Elements" },
        { value: "css", label: "CSS Layouts" },
        { value: "python", label: "Python Scripts" },
        { value: "sql", label: "SQL Queries" },
        { value: "c", label: "C Programming" },
        { value: "java", label: "Java Structures" }
      ];
    }

    options.forEach((opt) => {
      const el = document.createElement("option");
      el.value = opt.value;
      el.textContent = opt.label;
      dom.practiceSubtypeSelect.appendChild(el);
    });
  }
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
  if (isTestActive) {
    if (!confirm("A typing test is currently active. Change mode anyway?")) return;
    timer.stop();
    resetTest();
  }
  
  soundEngine.play("btnClick");
  mode = newMode;
  
  dom.modePractice.classList.remove("active");
  dom.modeZen.classList.remove("active");
  
  if (mode === "practice") {
    dom.modePractice.classList.add("active");
    dom.durationSelect.disabled = false;
  } else if (mode === "zen") {
    dom.modeZen.classList.add("active");
    dom.durationSelect.disabled = true;
  }
  
  loadNextParagraph();
}

// Load paragraph content
async function loadNextParagraph() {
  typingEngine.reset();
  clearKeyboardHighlights();
  dom.resultsOverlay.classList.add("hidden");

  if (activeChallengeType) {
    // Challenge loaded by startDailyChallenge
  } else if (activeLessonId) {
    // Lesson loaded by startLesson
  } else if (dom.customInput.value.trim().length > 0 && !dom.customInputCard.classList.contains("hidden")) {
    currentParagraph = dom.customInput.value.trim();
  } else {
    const practiceType = dom.practiceTypeSelect.value;
    if (practiceType === "paragraph") {
      currentParagraph = getRandomParagraph(difficulty);
    } else {
      const subtype = dom.practiceSubtypeSelect.value;
      currentParagraph = getPracticeContent(practiceType, subtype);
    }
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
  // BUG 5 PREVENT MULTIPLE STARTS: Ignore clicks/invocations if already running
  if (isTestActive || timer.isRunning()) return;

  if (!currentParagraph || currentParagraph.length < 3) {
    alert("Paragraph content is empty! Select a valid set.");
    return;
  }

  isTestActive = true;
  dom.resultsOverlay.classList.add("hidden");
  
  // Disable start button
  dom.startBtn.disabled = true;

  if (mode === "zen") {
    dom.timerText.textContent = "Zen";
  } else {
    timer.start(duration);
  }
  
  typingEngine.start();
  
  dom.startBtn.classList.add("hidden");
  dom.pauseBtn.classList.remove("hidden");
  dom.resumeBtn.classList.add("hidden");
  
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
  if (!isTestActive || timer.isPaused()) return;
  
  timer.pause();
  dom.pausedOverlay.classList.remove("hidden");
  typingEngine.isRunning = false;
  typingEngine.hiddenInput.disabled = true;
  
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.remove("hidden");
}

// Resume Test
function resumeTest() {
  if (!isTestActive || !timer.isPaused()) return;
  
  timer.resume();
  dom.pausedOverlay.classList.add("hidden");
  typingEngine.isRunning = true;
  typingEngine.hiddenInput.disabled = false;
  typingEngine.hiddenInput.focus();
  
  dom.resumeBtn.classList.add("hidden");
  dom.pauseBtn.classList.remove("hidden");
}

// Restart Test
function restartTest() {
  timer.stop();
  typingEngine.reset();
  isTestActive = false;
  
  dom.resultsOverlay.classList.add("hidden");
  loadNextParagraph();
  
  dom.startBtn.classList.remove("hidden");
  dom.startBtn.disabled = false;
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.add("hidden");
  dom.pausedOverlay.classList.add("hidden");
  
  dom.liveStatsBar.classList.remove("zen-fade");
  dom.timerWrapper.classList.remove("zen-fade");
}

// Reset / Clear Metrics
function resetTest() {
  timer.stop();
  typingEngine.reset();
  resetTimerUI();
  
  isTestActive = false;
  activeChallengeType = null;
  activeLessonId = null;
  
  dom.resultsOverlay.classList.add("hidden");
  
  dom.startBtn.classList.remove("hidden");
  dom.startBtn.disabled = false;
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
  isTestActive = false;
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
  if (typingGames.isRunning) return;

  const activeEl = document.activeElement;
  if (activeEl === dom.certNameInput || activeEl === dom.historySearch || activeEl === dom.customInput) {
    return;
  }

  // BUG 4 RESULTS ENTER LOCK: Enter key on Results screen triggers Practice Again
  if (e.key === "Enter" && !dom.resultsOverlay.classList.contains("hidden")) {
    e.preventDefault();
    restartTest();
    startTest();
    return;
  }

  // BUG 5 PREVENT ENTER START MULTIPLE: Ignore Enter shortcut if test is active
  if (e.key === "Enter" && isTestActive) {
    e.preventDefault();
    return;
  }

  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    restartTest();
  }
  
  if (e.key === "Enter" && !isTestActive && activeEl !== dom.hiddenInput) {
    e.preventDefault();
    startTest();
  }

  if (e.key === "Escape" && isTestActive) {
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
function handleTypingProgress(typedLength, totalLength) {}

// Typing Fully Completed Callback
// BUG 2 INSTANT COMPLETE FIX: Always finish the test immediately on paragraph complete
function handleTypingComplete() {
  handleTestFinished();
}

// Core Test Finishing Logic
function handleTestFinished() {
  // BUG 4 & DUPLICATE PREVENTER: Verify test is active and hasn't finished already
  if (!isTestActive) return;
  isTestActive = false;
  
  // Cache remaining time before stopping the timer
  const remaining = timer.timeLeft;
  
  // Stop timer immediately
  timer.stop();
  
  // Update typing engine completion state
  typingEngine.isCompleted = true;
  typingEngine.isRunning = false;
  
  // Play victory melody
  soundEngine.play("victory");
  
  // Disable typing input immediately
  typingEngine.hiddenInput.disabled = true;
  typingEngine.hiddenInput.blur();
  
  const timeElapsed = mode === "zen" ? 10 : (duration - remaining);
  const actualElapsed = Math.max(1, timeElapsed);
  
  const finalWpm = typingEngine.getWPM(actualElapsed);
  const finalAcc = typingEngine.getAccuracy();
  const finalMistakes = typingEngine.getMistakes();
  
  // Calculate reward XP and Coins
  let xpGained = Math.round((finalWpm * finalAcc / 100) * (actualElapsed / 30));
  let coinsGained = Math.round((finalWpm * finalAcc / 100) * 0.2);
  
  if (finalAcc === 100) {
    xpGained *= 2;
    coinsGained += 10;
  }

  // Check Level Campaign completion (Issue 5 & 6)
  if (activeLessonId !== null) {
    const activeId = activeLessonId;
    const completedNow = lessonsManager.completeLevel(activeId, finalWpm, finalAcc);
    if (completedNow) {
      xpGained += 150;
      coinsGained += 50;
      triggerConfettiRain();
      setTimeout(() => {
        alert(`🎉 New Level Unlocked! Level ${activeId + 1}`);
      }, 500);
    }
    activeLessonId = null;
    renderLessons();
    renderLevelsProgressionHUD();
  }

  // Check daily challenge completion
  if (activeChallengeType !== null) {
    const todayStr = getLocalDateStr(new Date());
    const challengeKey = `typePlayChallenge-${todayStr}-${activeChallengeType}`;
    
    if (!storage.get(challengeKey, false)) {
      storage.set(challengeKey, true);
      xpGained += 100;
      coinsGained += 50;
    }
    activeChallengeType = null;
    renderChallenges();
  }

  // Award rewards
  profileManager.addXP(xpGained);
  profileManager.addCoins(coinsGained);
  updateProfileUI();

  // Save result to history
  lastTestStats = historyManager.addRecord(
    finalWpm,
    finalAcc,
    finalMistakes,
    actualElapsed,
    mode === "daily" ? "daily" : difficulty,
    currentParagraph
  );

  // Sync heatmap mistakes
  mergeToCumulativeHeatmap(typingEngine.getHeatmapData());

  // Show stats again (if zen)
  dom.liveStatsBar.classList.remove("zen-fade");
  dom.timerWrapper.classList.remove("zen-fade");

  // Reset controls
  dom.startBtn.classList.remove("hidden");
  dom.startBtn.disabled = false;
  dom.pauseBtn.classList.add("hidden");
  dom.resumeBtn.classList.add("hidden");
  dom.pausedOverlay.classList.add("hidden");
  
  // Clear visualizer
  clearKeyboardHighlights();

  // Populate Dynamic Titles on Completion screen (Issue 8)
  let completionTitle = "Practice Completed! 🎉";
  if (activeLessonId !== null) {
    completionTitle = "Level Completed! 🎉";
  } else if (activeChallengeType !== null) {
    if (activeChallengeType === "code") completionTitle = "Coding Practice Completed! 🎉";
    else if (activeChallengeType === "number") completionTitle = "Number Practice Completed! 🎉";
    else if (activeChallengeType === "symbol") completionTitle = "Symbol Practice Completed! 🎉";
    else completionTitle = "Daily Challenge Completed! 🎉";
  }
  dom.resTitle.textContent = completionTitle;

  // Populate Statistics in Overlay
  dom.resWpm.textContent = finalWpm;
  dom.resCpm.textContent = actualElapsed > 0 ? Math.round(typingEngine.correctChars / (actualElapsed / 60)) : 0;
  dom.resAcc.textContent = `${finalAcc}%`;
  dom.resMistakes.textContent = finalMistakes;
  dom.resTime.textContent = `${actualElapsed}s`;
  dom.resXp.textContent = `+${xpGained} XP`;
  dom.resCoins.textContent = `🪙 +${coinsGained}`;

  // Highlight completed paragraph
  const chars = dom.paragraphDisplay.querySelectorAll(".char");
  chars.forEach((c) => {
    if (!c.classList.contains("incorrect")) {
      c.classList.add("correct");
      c.classList.remove("gray", "current");
    }
  });

  // Display the Results overlay
  dom.resultsOverlay.classList.remove("hidden");

  // Update stats dashboards, charts, history list
  updateDashboard();
  chartManager.updateChart(historyManager.getRecords());
  renderHistory();
  renderAchievements();
  
  // Check Leaderboard Eligibility
  checkLeaderboardEligibility(finalWpm, finalAcc);
  
  // Trigger Confetti
  triggerFinishedConfetti(finalWpm, finalAcc);
}

// Profile UI Updater
function updateProfileUI() {
  dom.profileLevel.textContent = `Lvl ${profileManager.level}`;
  dom.coinsText.textContent = profileManager.coins;
  
  const currentXP = profileManager.getCurrentLevelProgressXP();
  const requiredXP = profileManager.getXPRequiredForCurrentLevelSpan();
  const percentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  
  dom.xpProgressFill.style.width = `${percentage}%`;
  dom.xpText.textContent = `${currentXP} / ${requiredXP} XP`;
  
  const avatarList = {
    alien: "👽",
    fox: "🦊",
    rocket: "🚀",
    flash: "⚡",
    king: "👑",
    wizard: "🧙",
    dragon: "🐉"
  };
  dom.profileAvatar.textContent = avatarList[profileManager.selectedAvatar] || "👽";
}

// Show level-up effect
function showLevelUpEffect(level) {
  triggerConfettiRain();
  setTimeout(() => {
    alert(`🎉 LEVEL UP! You reached Level ${level}! Keep typing to unlock more custom designs.`);
  }, 300);
}

// Switch cursor styles
function applyEquippedCursor(cursorId) {
  const body = document.body;
  body.classList.remove("cursor-line-shape", "cursor-block-shape", "cursor-underline-shape", "cursor-glowdot-shape", "cursor-laser-shape");
  
  const caret = document.getElementById("floatingCursor");
  if (caret) {
    caret.className = "floating-cursor";
    if (cursorId === "block") caret.classList.add("cursor-block");
    if (cursorId === "underline") caret.classList.add("cursor-underline");
    if (cursorId === "glowdot") caret.classList.add("cursor-glowdot");
    if (cursorId === "laser") caret.classList.add("cursor-laser");
  }
}

// Merge Heatmap Data
function mergeToCumulativeHeatmap(currentRunMap) {
  const cumulative = storage.get("typePlayHeatmap", {});
  for (let key in currentRunMap) {
    cumulative[key] = (cumulative[key] || 0) + currentRunMap[key];
  }
  storage.set("typePlayHeatmap", cumulative);
}

// Achievements Renderer
function renderAchievements() {
  const records = historyManager.getRecords();
  const unlocked = storage.get("typePlayBadges", []);
  
  const streak = calculateStreak(records);
  const bestWpm = records.length > 0 ? Math.max(...records.map((r) => r.wpm)) : 0;
  const bestAcc = records.length > 0 ? Math.max(...records.map((r) => r.accuracy)) : 0;
  const totalChars = records.reduce((sum, r) => sum + r.paragraph.length, 0);

  const achievementsList = [
    { id: "first_test", title: "First Flight", desc: "Complete 1 speed test", icon: "🚀", met: records.length >= 1 },
    { id: "wpm_50", title: "Speedy Cadet", desc: "Reach 50 WPM", icon: "⚡", met: bestWpm >= 50 },
    { id: "wpm_100", title: "Key Legend", desc: "Reach 100 WPM", icon: "🌌", met: bestWpm >= 100 },
    { id: "perfect_acc", title: "Perfectionist", desc: "Achieve 100% accuracy", icon: "🎯", met: bestAcc === 100 },
    { id: "tests_10", title: "Daily Typist", desc: "Complete 10 total tests", icon: "📚", met: records.length >= 10 },
    { id: "tests_100", title: "Keyboard Warrior", desc: "Complete 100 total tests", icon: "⚔️", met: records.length >= 100 },
    { id: "streak_3", title: "Unstoppable", desc: "Maintain a 3-day typing streak", icon: "🔥", met: streak >= 3 },
    { id: "chars_10k", title: "Word Giant", desc: "Type 10,000 characters", icon: "🐉", met: totalChars >= 10000 }
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
      soundEngine.play("achievement");
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
    storage.set("typePlayBadges", nextUnlockedList);
  }
}

// Daily Streak Calculator
function calculateStreak(records) {
  if (records.length === 0) return 0;
  const uniqueDates = Array.from(new Set(records.map((r) => {
    const d = new Date(r.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }))).sort().reverse();
  
  if (uniqueDates.length === 0) return 0;
  
  const todayStr = getLocalDateStr(new Date());
  const yesterdayStr = getLocalDateStr(new Date(Date.now() - 86400000));
  
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

// Render Level Progression HUD Widgets (Issue 5)
function renderLevelsProgressionHUD() {
  const levels = lessonsManager.getLevels();
  const totalCount = levels.length;
  const completedCount = lessonsManager.completedLevels.length;
  const percentage = lessonsManager.getCampaignCompletionPercentage();
  
  // Find current level titles
  const highestUnlocked = lessonsManager.getHighestUnlockedLevel();
  const currentLvl = levels.find((l) => l.id === highestUnlocked) || levels[0];
  
  dom.campaignCurrentLevel.textContent = currentLvl.title;
  dom.campaignCompletionPercent.textContent = `${percentage}%`;
  dom.campaignCompletedLevelsCount.textContent = `${completedCount} / ${totalCount} Completed`;
  
  dom.campaignProgressBarFill.style.width = `${percentage}%`;
  
  // ASCII Progress Bar generator
  const bars = Math.round(percentage / 10);
  const filledStr = "█".repeat(bars);
  const emptyStr = "░".repeat(10 - bars);
  dom.campaignProgressBarAscii.textContent = `${filledStr}${emptyStr} ${percentage}%`;
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
    
    li.querySelector(".btn-del").addEventListener("click", (e) => {
      e.stopPropagation();
      soundEngine.play("btnClick");
      historyManager.deleteRecord(record.id);
      updateDashboard();
      chartManager.updateChart(historyManager.getRecords());
      renderHistory();
      renderAchievements();
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
  const savedName = storage.get("typePlayUserName", "");
  dom.certNameInput.value = savedName;

  const drawAndDisplay = () => {
    storage.set("typePlayUserName", dom.certNameInput.value);
    certificateGenerator.drawCertificate(
      dom.certificateCanvas,
      dom.certNameInput.value,
      record.wpm,
      record.accuracy,
      record.difficulty,
      record.date
    );
  };

  drawAndDisplay();

  dom.certNameInput.removeEventListener("input", drawAndDisplay);
  dom.certNameInput.addEventListener("input", drawAndDisplay);

  dom.certificateModal.classList.remove("hidden");
}

// Leaderboard Manager
function checkLeaderboardEligibility(wpm, accuracy) {
  const leaderboard = storage.get("typePlayLeaderboard", []);
  const isEligible = leaderboard.length < 10 || wpm > leaderboard[leaderboard.length - 1].wpm;
  
  if (isEligible) {
    setTimeout(() => {
      const name = prompt("🏆 New High Score! Enter your name for the Leaderboard:", storage.get("typePlayUserName", ""));
      if (name && name.trim()) {
        const username = name.trim();
        storage.set("typePlayUserName", username);
        
        leaderboard.push({
          name: username,
          wpm,
          accuracy,
          difficulty: difficulty,
          date: new Date().toLocaleDateString()
        });
        
        leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
        storage.set("typePlayLeaderboard", leaderboard.slice(0, 10));
        
        renderLeaderboardUI();
        dom.leaderboardModal.classList.remove("hidden");
      }
    }, 800);
  }
}

function renderLeaderboardUI() {
  const leaderboard = storage.get("typePlayLeaderboard", []);
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

// Level Campaign Renderer (Issue 5 & 6)
function renderLessons() {
  dom.lessonsGrid.innerHTML = "";
  const levels = lessonsManager.getLevels();
  
  levels.forEach((level) => {
    const card = document.createElement("div");
    card.className = `lesson-card glass-card ${level.unlocked ? "unlocked" : "locked"} ${level.completed ? "completed" : ""}`;
    
    let btnText = "Start Level";
    let scoreDisplay = `Locked`;
    
    if (level.unlocked) {
      scoreDisplay = `Not completed yet`;
      if (level.completed) {
        btnText = "Replay Level";
        scoreDisplay = `Best: ${level.maxWpm} WPM (${level.maxAcc}% Acc)`;
      }
    }

    card.innerHTML = `
      <h3>${level.title}</h3>
      <p>${level.description}</p>
      ${!level.unlocked ? `<span class="lesson-lock-badge">🔒</span>` : ""}
      <div class="lesson-score">
        <span>Goal: ${level.requiredWpm} WPM / ${level.requiredAcc}% Acc</span>
        <span>${scoreDisplay}</span>
      </div>
      <button class="btn btn-primary start-lesson-btn" ${!level.unlocked ? "disabled" : ""}>${btnText}</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      soundEngine.play("btnClick");
      startLesson(level.id, level.text);
    });

    dom.lessonsGrid.appendChild(card);
  });
}

function startLesson(lessonId, text) {
  activeLessonId = lessonId;
  activeChallengeType = null;
  
  dom.practiceTypeSelect.value = "paragraph";
  updatePracticeSubtypes();
  
  currentParagraph = text;
  
  switchTab("practice");
  loadNextParagraph();
  
  alert(`📖 Loaded Campaign Level ${lessonId}! Press "Start Test" or Enter key to begin.`);
}

// Daily Challenges Renderer
function renderChallenges() {
  const todayStr = getLocalDateStr(new Date());
  const chalList = ["para", "code", "number", "symbol"];
  
  chalList.forEach((chal) => {
    const challengeKey = `typePlayChallenge-${todayStr}-${chal}`;
    const completed = storage.get(challengeKey, false);
    const card = document.getElementById(`challenge-${chal}`);
    
    if (card) {
      if (completed) {
        card.classList.add("completed");
        const btn = card.querySelector("button");
        if (btn) {
          btn.textContent = "Done";
          btn.disabled = true;
        }
      } else {
        card.classList.remove("completed");
        const btn = card.querySelector("button");
        if (btn) {
          btn.textContent = "Play Run";
          btn.disabled = false;
        }
      }
    }
  });
}

function startDailyChallenge(chalType) {
  activeChallengeType = chalType;
  activeLessonId = null;
  
  let challengeText = "";
  if (chalType === "para") {
    challengeText = getDailyParagraph();
  } else if (chalType === "code") {
    challengeText = getPracticeContent("programming", "js");
  } else if (chalType === "number") {
    challengeText = getPracticeContent("numbers", "random");
  } else if (chalType === "symbol") {
    challengeText = getPracticeContent("symbols", "mixed");
  }
  
  currentParagraph = challengeText;
  
  switchTab("practice");
  loadNextParagraph();
  
  alert(`📅 Loaded Daily ${chalType.toUpperCase()} Challenge! Complete the run to unlock rewards.`);
}

// Reward & Shop Renderer
function renderShop(category) {
  dom.shopItemsGrid.innerHTML = "";
  const items = SHOP_ITEMS[category] || [];
  
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "shop-item-card glass-card";
    
    let isUnlocked = false;
    let isEquipped = false;
    
    if (category === "themes") {
      isUnlocked = profileManager.unlockedThemes.includes(item.id);
      isEquipped = profileManager.selectedTheme === item.id;
    } else if (category === "cursors") {
      isUnlocked = profileManager.unlockedCursors.includes(item.id);
      isEquipped = profileManager.selectedCursor === item.id;
    } else if (category === "avatars") {
      isUnlocked = profileManager.unlockedAvatars.includes(item.id);
      isEquipped = profileManager.selectedAvatar === item.id;
    }
    
    if (isEquipped) {
      card.classList.add("equipped");
    }

    card.innerHTML = `
      <div class="shop-item-preview">${item.preview}</div>
      <h3>${item.name}</h3>
      <span class="shop-item-cost">${isUnlocked ? "Unlocked" : `🪙 ${item.price}`}</span>
      <button class="btn btn-sm ${isEquipped ? "btn-outline" : "btn-primary"}">
        ${isEquipped ? "Active" : (isUnlocked ? "Equip" : "Buy")}
      </button>
    `;

    const btn = card.querySelector("button");
    if (isEquipped) {
      btn.disabled = true;
    }

    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (isUnlocked) {
        profileManager.selectItem(category.slice(0, -1), item.id);
        if (category === "themes") {
          themeManager.setTheme(item.id);
        } else if (category === "cursors") {
          applyEquippedCursor(item.id);
        }
        updateProfileUI();
        renderShop(category);
      } else {
        const success = profileManager.purchaseItem(category.slice(0, -1), item.id, item.price);
        if (success) {
          updateProfileUI();
          renderShop(category);
        }
      }
    });

    dom.shopItemsGrid.appendChild(card);
  });
}

// Live Keyboard Visualizer Key Highlights
function handleKeyPair(expectedChar, isCorrect) {
  highlightKey(expectedChar, isCorrect ? "correct" : "incorrect");
}

function handleNextKey(nextChar, finger) {
  clearKeyboardHighlights();
  
  if (nextChar) {
    highlightKey(nextChar, "next");
    
    const displayChar = nextChar === " " ? "Space" : nextChar.toUpperCase();
    dom.nextKeyGuide.textContent = displayChar;
    dom.nextFingerGuide.textContent = finger;
  } else {
    dom.nextKeyGuide.textContent = "Start";
    dom.nextFingerGuide.textContent = "proper fingers";
  }
}

function clearKeyboardHighlights() {
  document.querySelectorAll("#visualizerKeyboard .key").forEach((keyEl) => {
    keyEl.classList.remove("next-press", "correct-press", "incorrect-press");
  });
}

function highlightKey(key, state) {
  let keyStr = key.toLowerCase();
  
  if (keyStr === " ") keyStr = " ";
  if (keyStr === "enter") keyStr = "enter";
  if (keyStr === "backspace") keyStr = "backspace";
  if (keyStr === "shift") keyStr = "shift";
  if (keyStr === "ctrl" || keyStr === "control") keyStr = "ctrl";
  if (keyStr === "alt") keyStr = "alt";
  if (keyStr === "tab") keyStr = "tab";
  if (keyStr === "caps" || keyStr === "capslock") keyStr = "caps";
  
  const shiftMappings = {
    "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0",
    "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/"
  };
  if (shiftMappings[keyStr]) {
    keyStr = shiftMappings[keyStr];
  }

  const keys = document.querySelectorAll(`#visualizerKeyboard .key[data-key="${keyStr}"]`);
  
  keys.forEach((keyEl) => {
    if (state === "correct") {
      keyEl.classList.add("correct-press");
      setTimeout(() => keyEl.classList.remove("correct-press"), 150);
    } else if (state === "incorrect") {
      keyEl.classList.add("incorrect-press");
      setTimeout(() => keyEl.classList.remove("incorrect-press"), 150);
    } else if (state === "next") {
      keyEl.classList.add("next-press");
    }
  });
}

// Combo Counter popups
function handleComboUpdate(combo) {
  if (combo >= 5) {
    dom.comboContainer.classList.remove("hidden");
    dom.comboNumber.textContent = combo;
    
    if (combo % 10 === 0) {
      dom.comboContainer.classList.add("combo-pop-active");
      setTimeout(() => dom.comboContainer.classList.remove("combo-pop-active"), 200);
    }
  } else {
    dom.comboContainer.classList.add("hidden");
  }
}
