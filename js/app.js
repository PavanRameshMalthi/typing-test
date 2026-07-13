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
import { toast } from "./toast.js";
import { onboardingManager } from "./onboarding.js";
import { goalsManager } from "./goals.js";
import { achievementsManager } from "./achievements.js";
import { profilePageManager } from "./profile-page.js";

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
  badgesGrid: document.getElementById("badgesGrid"),
  
  // Hamburger and new widgets
  navHamburger: document.getElementById("navHamburger"),
  platformTabsContainer: document.querySelector(".platform-tabs"),
  challengeCountdown: document.getElementById("challengeCountdown"),
  shopCoinsText: document.getElementById("shopCoinsText"),
  startWeeklyChallengeBtn: document.getElementById("startWeeklyChallengeBtn"),
  totalCharsTyped: document.getElementById("totalCharsTyped"),
  totalWordsTyped: document.getElementById("totalWordsTyped"),
  totalBadgesEarned: document.getElementById("totalBadgesEarned")
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
  try { themeManager.init(); } catch(e) { console.error("themeManager.init failed:", e); }
  try { historyManager.init(); } catch(e) { console.error("historyManager.init failed:", e); }
  try { profileManager.init(); } catch(e) { console.error("profileManager.init failed:", e); }
  try { lessonsManager.init(); } catch(e) { console.error("lessonsManager.init failed:", e); }
  try { typingGames.init(dom.gameCanvas); } catch(e) { console.error("typingGames.init failed:", e); }
  
  // Custom Modules
  try { onboardingManager.init(); } catch(e) { console.error("onboardingManager.init failed:", e); }
  try { goalsManager.init(); } catch(e) { console.error("goalsManager.init failed:", e); }
  try { achievementsManager.init(); } catch(e) { console.error("achievementsManager.init failed:", e); }

  // Render initial profile state
  try { updateProfileUI(); } catch(e) { console.error("updateProfileUI failed:", e); }
  try { themeManager.setTheme(profileManager.selectedTheme); } catch(e) { console.error("themeManager.setTheme failed:", e); }

  // Setup sound button toggle state
  try { updateSoundButtonUI(); } catch(e) { console.error("updateSoundButtonUI failed:", e); }

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

  try { applyEquippedCursor(profileManager.selectedCursor); } catch(e) { console.error("applyEquippedCursor failed:", e); }

  // Load first paragraph
  try { loadNextParagraph(); } catch(e) { console.error("loadNextParagraph failed:", e); }
  
  // Render dashboards, structures (non-critical — must not block event binding)
  try { updateDashboard(); } catch(e) { console.error("updateDashboard failed:", e); }
  try { chartManager.updateChart(historyManager.getRecords()); } catch(e) { console.error("chartManager.updateChart failed:", e); }
  try { renderHistory(); } catch(e) { console.error("renderHistory failed:", e); }
  try { renderAchievements(); } catch(e) { console.error("renderAchievements failed:", e); }
  try { renderLevelsProgressionHUD(); } catch(e) { console.error("renderLevelsProgressionHUD failed:", e); }
  try { renderLessons(); } catch(e) { console.error("renderLessons failed:", e); }
  try { renderChallenges(); } catch(e) { console.error("renderChallenges failed:", e); }
  try { renderShop("themes"); } catch(e) { console.error("renderShop failed:", e); }
  try { renderDailyGoalsUI(); } catch(e) { console.error("renderDailyGoalsUI failed:", e); }

  // Event Binding — MUST always execute
  setupEventListeners();

  // Handle initial page load hash routing
  const initialHash = window.location.hash.substring(1);
  const validTabs = ["practice", "lessons", "games", "challenges", "shop", "stats", "achievements", "multiplayer", "profile", "settings"];
  if (initialHash && validTabs.includes(initialHash)) {
    switchTab(initialHash, false);
  } else {
    switchTab("practice", false);
  }
});

// Configure Event Listeners
function setupEventListeners() {
  // Navigation Tabs with SPA Routing
  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      soundEngine.play("btnClick");
      
      // Close hamburger drawer if open on mobile
      if (dom.platformTabsContainer) {
        dom.platformTabsContainer.classList.remove("open");
      }
      if (dom.navHamburger) {
        dom.navHamburger.classList.remove("open");
        dom.navHamburger.setAttribute("aria-expanded", "false");
      }
      
      switchTab(tab.getAttribute("data-tab"), true);
    });
  });

  // Hamburger Drawer Menu Click Handler
  if (dom.navHamburger) {
    dom.navHamburger.addEventListener("click", () => {
      soundEngine.play("btnClick");
      let isOpen = false;
      if (dom.platformTabsContainer) {
        isOpen = dom.platformTabsContainer.classList.toggle("open");
      }
      dom.navHamburger.classList.toggle("open");
      dom.navHamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Browser Navigation SPA Popstate Listener
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.tab) {
      switchTab(event.state.tab, false);
    } else {
      const hash = window.location.hash.substring(1);
      if (hash) {
        switchTab(hash, false);
      } else {
        switchTab("practice", false);
      }
    }
  });

  // Weekly Marathon Challenge Start Handler
  if (dom.startWeeklyChallengeBtn) {
    dom.startWeeklyChallengeBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      activeChallengeType = "weekly-marathon";
      currentParagraph = "The keyboard is your primary tool as a developer and digital creator. To master it, you must practice regularly, maintaining both high accuracy and speed. This marathon test is designed to push your limits, forcing you to maintain focus across five hundred words of content. Keep your shoulders relaxed, wrists slightly elevated, and tap each key smoothly without looking down. Every keypress gets you closer to perfect rhythm. Speed will naturally follow correct finger placement. Let your muscle memory guide you. Relax, breathe deeply, and let your fingers fly across the keys with absolute precision.";
      difficulty = "hard";
      duration = 300; // 5 minute endurance run
      
      switchTab("practice", true);
      resetTest();
      startTest();
    });
  }

  // Controls
  if (dom.startBtn) dom.startBtn.addEventListener("click", () => { soundEngine.play("btnClick"); startTest(); });
  if (dom.pauseBtn) dom.pauseBtn.addEventListener("click", () => { soundEngine.play("btnClick"); pauseTest(); });
  if (dom.resumeBtn) dom.resumeBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resumeTest(); });
  if (dom.restartBtn) dom.restartBtn.addEventListener("click", () => { soundEngine.play("btnClick"); restartTest(); });
  if (dom.retestBtn) dom.retestBtn.addEventListener("click", () => { soundEngine.play("btnClick"); resetTest(); });
  if (dom.replayMistakesBtn) dom.replayMistakesBtn.addEventListener("click", () => { soundEngine.play("btnClick"); replayMistakes(); });
  
  // Hero Section CTA Buttons
  if (dom.heroStartBtn && dom.typingContainer) {
    dom.heroStartBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      dom.typingContainer.scrollIntoView({ behavior: "smooth" });
      startTest();
    });
  }
  if (dom.heroPracticeBtn && dom.typingContainer) {
    dom.heroPracticeBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      dom.typingContainer.scrollIntoView({ behavior: "smooth" });
      if (typingEngine) typingEngine.focus();
    });
  }
  
  // Results Overlay Controls
  if (dom.resPracticeAgainBtn) {
    dom.resPracticeAgainBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      restartTest();
      startTest();
    });
  }
  if (dom.resReplayMistakesBtn) {
    dom.resReplayMistakesBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      replayMistakes();
    });
  }
  if (dom.resCertBtn) {
    dom.resCertBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (lastTestStats) {
        openCertificateModal(lastTestStats);
      } else {
        toast.warning("No completed test record found for this session.");
      }
    });
  }

  // Difficulty Cards Click handlers
  document.querySelectorAll(".difficulty-card").forEach((card) => {
    card.addEventListener("click", () => {
      soundEngine.play("btnClick");
      document.querySelectorAll(".difficulty-card").forEach((c) => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("selected");
      card.setAttribute("aria-checked", "true");
      
      const diffVal = card.getAttribute("data-diff");
      difficulty = diffVal;
      if (dom.difficultySelect) {
        dom.difficultySelect.value = diffVal;
      }
      if (!isTestActive) loadNextParagraph();
    });
    
    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Options (Practice Settings)
  if (dom.difficultySelect) {
    dom.difficultySelect.addEventListener("change", (e) => {
      soundEngine.play("btnClick");
      difficulty = e.target.value;
      if (!isTestActive) loadNextParagraph();
    });
  }
  
  if (dom.durationSelect) {
    dom.durationSelect.addEventListener("change", (e) => {
      soundEngine.play("btnClick");
      duration = parseInt(e.target.value);
      resetTimerUI();
    });
  }

  if (dom.practiceTypeSelect) {
    dom.practiceTypeSelect.addEventListener("change", () => {
      soundEngine.play("btnClick");
      updatePracticeSubtypes();
      if (!isTestActive) loadNextParagraph();
    });
  }

  if (dom.practiceSubtypeSelect) {
    dom.practiceSubtypeSelect.addEventListener("change", () => {
      soundEngine.play("btnClick");
      if (!isTestActive) loadNextParagraph();
    });
  }

  // Modes
  if (dom.modePractice) dom.modePractice.addEventListener("click", () => changeMode("practice"));
  if (dom.modeZen) dom.modeZen.addEventListener("click", () => changeMode("zen"));
  
  // Sound
  if (dom.soundToggleBtn) {
    dom.soundToggleBtn.addEventListener("click", () => {
      const enabled = soundEngine.toggle();
      updateSoundButtonUI();
      soundEngine.play("btnClick");
      
      // Sync setting toggle
      const soundCheck = document.getElementById("settingsSoundToggle");
      if (soundCheck) soundCheck.checked = enabled;
    });
  }

  // Settings Panel specific bindings
  const soundCheck = document.getElementById("settingsSoundToggle");
  if (soundCheck) {
    soundCheck.addEventListener("change", () => {
      soundEngine.enabled = soundCheck.checked;
      updateSoundButtonUI();
      soundEngine.play("btnClick");
    });
  }

  const kbCheck = document.getElementById("settingsKeyboardToggle");
  if (kbCheck) {
    kbCheck.addEventListener("change", () => {
      soundEngine.play("btnClick");
      const kbPanel = document.querySelector(".heatmap-panel");
      if (kbPanel) {
        if (kbCheck.checked) kbPanel.classList.remove("hidden");
        else kbPanel.classList.add("hidden");
      }
    });
  }

  const guideCheck = document.getElementById("settingsFingerGuideToggle");
  if (guideCheck) {
    guideCheck.addEventListener("change", () => {
      soundEngine.play("btnClick");
      const fgPanel = document.querySelector(".finger-guide-panel");
      if (fgPanel) {
        if (guideCheck.checked) fgPanel.classList.remove("hidden");
        else fgPanel.classList.add("hidden");
      }
    });
  }

  // Collapsible Settings sections
  document.querySelectorAll(".settings-section-header").forEach((header) => {
    header.addEventListener("click", () => {
      soundEngine.play("btnClick");
      const body = header.nextElementSibling;
      const isOpen = header.classList.toggle("open");
      header.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (body) {
        body.classList.toggle("hidden", !isOpen);
      }
    });
    header.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Font size settings
  document.querySelectorAll(".font-size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      document.querySelectorAll(".font-size-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      const size = btn.getAttribute("data-size");
      document.body.classList.remove("font-size-sm", "font-size-md", "font-size-lg", "font-size-xl");
      document.body.classList.add(`font-size-${size}`);
    });
  });

  // Dyslexia & High Contrast toggles
  const dyslexiaToggle = document.getElementById("dyslexiaFontToggle");
  if (dyslexiaToggle) {
    dyslexiaToggle.addEventListener("change", () => {
      soundEngine.play("btnClick");
      document.body.classList.toggle("font-dyslexia", dyslexiaToggle.checked);
    });
  }

  const contrastToggle = document.getElementById("highContrastToggle");
  if (contrastToggle) {
    contrastToggle.addEventListener("change", () => {
      soundEngine.play("btnClick");
      document.body.classList.toggle("high-contrast", contrastToggle.checked);
    });
  }

  // Dev actions reset
  const resetObBtn = document.getElementById("resetOnboardingBtn");
  if (resetObBtn) {
    resetObBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      onboardingManager.reset();
      toast.success("Onboarding tutorial has been reset! Reloading...");
      setTimeout(() => window.location.reload(), 1500);
    });
  }

  const exportAllBtn = document.getElementById("exportAllDataBtn");
  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      const allData = {
        profile: storage.get("typePlayUserProfile", {}),
        history: storage.get("typingHistory", []),
        badges: storage.get("typePlayBadges", []),
        goals: storage.get("typePlayDailyGoals", {}),
        heatmap: storage.get("typePlayHeatmap", {})
      };
      const json = JSON.stringify(allData, null, 2);
      historyManager.downloadFile(json, "typeplay_all_data.json", "application/json;charset=utf-8;");
      toast.success("Profile data package exported successfully!");
    });
  }

  const resetAllBtn = document.getElementById("resetAllProgressBtn");
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (confirm("⚠️ CRITICAL: Are you absolutely sure you want to delete all local progress, stats, history, and inventory? This is permanent!")) {
        storage.clear();
        toast.error("All local progress wiped completely. Refreshing page...");
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }

  // Custom tabs switching
  document.querySelectorAll(".custom-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      document.querySelectorAll(".custom-tab-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      
      const tabVal = btn.getAttribute("data-custom-tab");
      document.querySelectorAll(".custom-tab-panel").forEach((p) => p.classList.add("hidden"));
      
      const targetPanel = document.getElementById(`customTab${tabVal.charAt(0).toUpperCase() + tabVal.slice(1)}`);
      if (targetPanel) targetPanel.classList.remove("hidden");

      if (tabVal === "recent") {
        renderRecentCustomTexts();
      }
    });
  });

  // File Upload listener
  const fileInput = document.getElementById("customFileInput");
  const fileStatus = document.getElementById("fileUploadStatus");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        if (text.trim().length === 0) {
          toast.error("Uploaded file is empty!");
          if (fileStatus) fileStatus.textContent = "Error: File is empty";
          return;
        }

        const trimmed = text.trim().substring(0, 10000);
        if (dom.customInput) {
          dom.customInput.value = trimmed;
          updateCustomTextCounters();
        }
        
        saveCustomTextToRecent(trimmed);
        
        toast.success(`Loaded file: ${file.name}`);
        if (fileStatus) fileStatus.textContent = `Successfully loaded: ${file.name}`;
        
        // Load next paragraph
        if (!isTestActive) loadNextParagraph();
      };
      reader.readAsText(file);
    });
  }

  // Fullscreen
  if (dom.fullscreenBtn) dom.fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Custom Paragraph Toggle
  if (dom.customInputToggle) {
    dom.customInputToggle.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.customInputCard) {
        dom.customInputCard.classList.toggle("hidden");
        const isOpen = !dom.customInputCard.classList.contains("hidden");
        dom.customInputToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen && dom.customInput) {
          dom.customInput.focus();
        }
      }
    });
  }

  if (dom.customInput) {
    dom.customInput.addEventListener("input", () => {
      updateCustomTextCounters();
      if (!isTestActive && dom.customInput.value.trim().length > 0) {
        loadNextParagraph();
      }
    });
  }

  // Clicking typingContainer focuses the text area
  if (dom.typingContainer) {
    dom.typingContainer.addEventListener("click", () => {
      if (isTestActive && !timer.isPaused() && typingEngine) {
        typingEngine.focus();
      }
    });
  }

  if (dom.hiddenInput) {
    dom.hiddenInput.addEventListener("input", () => {
      const elapsed = timer.getTimeElapsed();
      if (typingEngine) typingEngine.handleInput(elapsed);
    });
  }

  // History & Exports
  if (dom.historySearch) dom.historySearch.addEventListener("input", renderHistory);
  if (dom.historySort) dom.historySort.addEventListener("change", renderHistory);
  if (dom.clearHistoryBtn) {
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
  }

  if (dom.exportCsvBtn) dom.exportCsvBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportCSV(); });
  if (dom.exportJsonBtn) dom.exportJsonBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportJSON(); });
  if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener("click", () => { soundEngine.play("btnClick"); historyManager.exportPDF(); });

  // Modals
  if (dom.closeCertBtn) dom.closeCertBtn.addEventListener("click", () => dom.certificateModal && dom.certificateModal.classList.add("hidden"));
  if (dom.downloadCertBtn) {
    dom.downloadCertBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.certificateCanvas && dom.certNameInput) {
        certificateGenerator.downloadPDF(dom.certificateCanvas, dom.certNameInput.value);
      }
    });
  }

  if (dom.openLeaderboardBtn) {
    dom.openLeaderboardBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      renderLeaderboardUI();
      if (dom.leaderboardModal) dom.leaderboardModal.classList.remove("hidden");
    });
  }
  if (dom.closeLeaderboardBtn) dom.closeLeaderboardBtn.addEventListener("click", () => dom.leaderboardModal && dom.leaderboardModal.classList.add("hidden"));

  if (dom.openShortcutsBtn) {
    dom.openShortcutsBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.shortcutsModal) dom.shortcutsModal.classList.remove("hidden");
    });
  }
  if (dom.closeShortcutsBtn) dom.closeShortcutsBtn.addEventListener("click", () => dom.shortcutsModal && dom.shortcutsModal.classList.add("hidden"));

  // Close modals on background click
  window.addEventListener("click", (e) => {
    if (dom.certificateModal && e.target === dom.certificateModal) dom.certificateModal.classList.add("hidden");
    if (dom.leaderboardModal && e.target === dom.leaderboardModal) dom.leaderboardModal.classList.add("hidden");
    if (dom.shortcutsModal && e.target === dom.shortcutsModal) dom.shortcutsModal.classList.add("hidden");
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
  if (dom.restartGameBtn) {
    dom.restartGameBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.add("hidden");
      typingGames.startGame(typingGames.activeGame);
    });
  }

  // Games Exit button
  if (dom.exitGameBtn) {
    dom.exitGameBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      typingGames.stopGame();
      if (dom.gamePlayPanel) dom.gamePlayPanel.classList.add("hidden");
      if (dom.gameSelectionPanel) dom.gameSelectionPanel.classList.remove("hidden");
    });
  }

  // Game Results Overlay Controls (Issue 3)
  if (dom.gameResPlayAgainBtn) {
    dom.gameResPlayAgainBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.add("hidden");
      typingGames.startGame(typingGames.activeGame);
    });
  }

  if (dom.gameResNextGameBtn) {
    dom.gameResNextGameBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.add("hidden");
      
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
      if (dom.activeGameTitle) dom.activeGameTitle.textContent = names[nextGame] || "Type Game";
      typingGames.startGame(nextGame);
    });
  }

  if (dom.gameResExitBtn) {
    dom.gameResExitBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      typingGames.stopGame();
      if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.add("hidden");
      if (dom.gamePlayPanel) dom.gamePlayPanel.classList.add("hidden");
      if (dom.gameSelectionPanel) dom.gameSelectionPanel.classList.remove("hidden");
    });
  }

  if (dom.gameResHomeBtn) {
    dom.gameResHomeBtn.addEventListener("click", () => {
      soundEngine.play("btnClick");
      typingGames.stopGame();
      if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.add("hidden");
      switchTab("practice");
    });
  }

  // Game Over callback (Issue 3 & 8)
  typingGames.onGameOver = (score, coinsEarned, xpEarned, playerWon, accuracy, elapsedSeconds, wpm, cpm, mistakes) => {
    if (dom.gameResTitle) dom.gameResTitle.textContent = playerWon ? "🎉 Level Complete!" : "💀 Game Over!";
    if (dom.gameResScore) dom.gameResScore.textContent = score;
    if (dom.gameResAcc) dom.gameResAcc.textContent = `${accuracy}%`;
    if (dom.gameResTime) dom.gameResTime.textContent = `${elapsedSeconds}s`;
    if (dom.gameResXp) dom.gameResXp.textContent = `+${xpEarned} XP`;
    if (dom.gameResCoins) dom.gameResCoins.textContent = `🪙 +${coinsEarned}`;
    
    // Save game stats
    const gPlay = storage.get("typePlayGamesPlayed", 0) + 1;
    storage.set("typePlayGamesPlayed", gPlay);

    // Reward player profile
    profileManager.addXP(xpEarned);
    profileManager.addCoins(coinsEarned);

    // Log Daily Goals progress
    try {
      goalsManager.updateProgress("play_game", 1);
      goalsManager.updateProgress("earn_xp", xpEarned);
      renderDailyGoalsUI();
    } catch(e) {
      console.error("Failed to update daily goals:", e);
    }

    // Check achievements
    try {
      const statsForCheck = getAchievementsStatsForCheck();
      achievementsManager.check(statsForCheck);
    } catch(e) {
      console.error("Failed to check achievements:", e);
    }

    updateProfileUI(); // update XP / Coin widgets in header!
    if (dom.gameResultsOverlay) dom.gameResultsOverlay.classList.remove("hidden");
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
function switchTab(tabId, pushToHistory = true) {
  activeTab = tabId;

  // SPA Router History push
  if (pushToHistory) {
    history.pushState({ tab: tabId }, "", `#${tabId}`);
  }
  
  dom.tabs.forEach((tab) => {
    const isCurrent = tab.getAttribute("data-tab") === tabId;
    tab.classList.toggle("active", isCurrent);
    tab.setAttribute("aria-selected", isCurrent ? "true" : "false");
    tab.setAttribute("tabindex", isCurrent ? "0" : "-1");
  });

  dom.tabContents.forEach((content) => {
    if (content.id === `tab-${tabId}`) {
      content.classList.remove("hidden");
    } else {
      content.classList.add("hidden");
    }
  });

  // State Preservation: Pause rather than stop/reset when leaving Practice Tab
  if (tabId !== "practice") {
    if (isTestActive && !timer.isPaused()) {
      pauseTest();
    }
  } else {
    // Returning to Practice tab
    if (isTestActive) {
      // Keep paused overlay visible if we had paused it
      dom.pausedOverlay.classList.remove("hidden");
      dom.pauseBtn.classList.add("hidden");
      dom.resumeBtn.classList.remove("hidden");
      dom.startBtn.classList.add("hidden");
    } else {
      dom.startBtn.classList.remove("hidden");
      dom.startBtn.disabled = false;
      dom.pauseBtn.classList.add("hidden");
      dom.resumeBtn.classList.add("hidden");
      dom.pausedOverlay.classList.add("hidden");
    }
  }

  // State Preservation: Pause rather than stop when leaving Games Tab
  if (tabId !== "games") {
    if (typingGames.isRunning && !typingGames.isPaused) {
      typingGames.pauseGame();
    }
  } else {
    // Returning to Games tab
    if (typingGames.isRunning && typingGames.isPaused) {
      typingGames.resumeGame();
      dom.gameSelectionPanel.classList.add("hidden");
      dom.gamePlayPanel.classList.remove("hidden");
    }
  }

  if (tabId === "stats") {
    updateDashboard();
    chartManager.updateChart(historyManager.getRecords());
    renderHistory();
    renderAchievements();
  }

  if (tabId === "achievements") {
    renderAchievements();
  }

  if (tabId === "profile") {
    profilePageManager.render();
  }

  if (tabId === "challenges") {
    // Refresh countdown time and daily rendering
    renderChallenges();
  }

  if (tabId === "shop") {
    // Render current coin balance
    if (dom.shopCoinsText) {
      dom.shopCoinsText.textContent = profileManager.coins;
    }
    // Render active shop category
    renderShop("themes");
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
    toast.warning("Paragraph content is empty! Select a valid set.");
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
    toast.success("Amazing! You made 0 mistakes in the last test to replay.");
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
      toast.error(`Error attempting to enable fullscreen mode: ${err.message}`);
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

  let isCampaignLevelCompleted = false;

  // Check Level Campaign completion (Issue 5 & 6)
  if (activeLessonId !== null) {
    const activeId = activeLessonId;
    const currentLesson = lessonsManager.getLevels().find(l => l.id === activeId);
    const completedNow = lessonsManager.completeLevel(activeId, finalWpm, finalAcc);
    if (completedNow) {
      xpGained += 150;
      coinsGained += 50;
      isCampaignLevelCompleted = true;
      triggerConfettiRain();
      toast.success(`🎉 Campaign Level ${activeId} Completed! Level ${activeId + 1} is now unlocked.`);
    } else if (finalWpm >= (currentLesson ? currentLesson.requiredWpm : 0) && finalAcc >= (currentLesson ? currentLesson.requiredAcc : 0)) {
      isCampaignLevelCompleted = true;
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
      toast.success(`📅 Daily Challenge completed! Earned bonus rewards!`);
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

  // Log Daily Goals progress
  try {
    goalsManager.updateProgress("complete_tests", 1);
    goalsManager.updateProgress("practice_time", actualElapsed);
    if (finalAcc >= 95) {
      goalsManager.updateProgress("reach_accuracy", 1, true);
    }
    goalsManager.updateProgress("earn_xp", xpGained);
    if (isCampaignLevelCompleted) {
      goalsManager.updateProgress("finish_lesson", 1, true);
    }
    renderDailyGoalsUI();
  } catch(e) {
    console.error("Failed to update daily goals:", e);
  }

  // Check achievements
  try {
    const statsForCheck = getAchievementsStatsForCheck();
    achievementsManager.check(statsForCheck);
  } catch(e) {
    console.error("Failed to check achievements:", e);
  }

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
    toast.levelUp(level);
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
  const achGrid = document.getElementById("achievementsGrid");
  const achCompletionText = document.getElementById("achCompletionText");
  const achRingText = document.getElementById("achRingText");
  const achRingFill = document.getElementById("achRingFill");

  if (!achGrid) return;

  const stats = getAchievementsStatsForCheck();

  const filterBtnActive = document.querySelector(".ach-filter-btn.active");
  const currentFilter = filterBtnActive ? filterBtnActive.getAttribute("data-ach-filter") : "all";

  const allAchs = achievementsManager.getAll();
  
  // Update Header UI
  const total = achievementsManager.getTotalCount();
  const unlocked = achievementsManager.getUnlockedCount();
  const percent = achievementsManager.getCompletionPercent();

  if (achCompletionText) achCompletionText.textContent = `${unlocked} / ${total} Unlocked`;
  if (achRingText) achRingText.textContent = `${percent}%`;
  if (achRingFill) {
    const offset = 100 - percent;
    achRingFill.style.strokeDashoffset = offset;
  }

  achGrid.innerHTML = "";

  const filtered = allAchs.filter(ach => {
    if (currentFilter === "all") return true;
    if (currentFilter === "unlocked") return ach.unlocked;
    if (currentFilter === "locked") return !ach.unlocked;
    return ach.rarity === currentFilter;
  });

  if (filtered.length === 0) {
    achGrid.innerHTML = `<div class="empty-placeholder" style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-muted);">No achievements found in this category.</div>`;
    return;
  }

  filtered.forEach(ach => {
    const card = document.createElement("div");
    card.className = `achievement-card ${ach.unlocked ? "unlocked" : "locked"}`;
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="ach-badge-icon">${ach.unlocked ? ach.icon : "🔒"}</div>
      <div class="ach-info">
        <h3 class="ach-title">${ach.title}</h3>
        <p class="ach-desc">${ach.desc}</p>
        <span class="ach-rarity rarity-${ach.rarity}">${ach.rarity}</span>
      </div>
      <span class="ach-lock-icon">${ach.unlocked ? "✅" : "🔒"}</span>
    `;
    achGrid.appendChild(card);
  });
}

function getAchievementsStatsForCheck() {
  const records = historyManager.getRecords();
  const streak = calculateStreak(records);
  const bestWpm = records.length > 0 ? Math.max(...records.map((r) => r.wpm)) : 0;
  const bestAcc = records.length > 0 ? Math.max(...records.map((r) => r.accuracy)) : 0;
  
  const totalChars = records.reduce((sum, r) => sum + (r.paragraph ? r.paragraph.length : 0), 0);
  const totalWords = records.reduce((sum, r) => sum + (r.paragraph ? r.paragraph.split(/\s+/).length : 0), 0);
  
  const gamesPlayed = storage.get("typePlayGamesPlayed", 0);
  const lessonsCompleted = lessonsManager.completedLevels.length;

  return {
    totalTests: records.length,
    bestWpm,
    bestAcc,
    totalWords,
    totalChars,
    streak,
    gamesPlayed,
    lessonsCompleted,
    userLevel: profileManager.level
  };
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
  const totalBadges = achievementsManager.getUnlockedCount();
  
  const hWpmEl = document.getElementById("highestWpm");
  const aWpmEl = document.getElementById("avgWpm");
  const hAccEl = document.getElementById("highestAcc");
  const aAccEl = document.getElementById("avgAcc");
  const tWordsEl = document.getElementById("totalWordsTyped");
  const tCharsEl = document.getElementById("totalCharsTyped");
  const hoursEl = document.getElementById("hoursPracticed");
  const tTestsEl = document.getElementById("totalTests");
  
  const gPlayEl = document.getElementById("gamesPlayedStat");
  const lCompEl = document.getElementById("lessonsCompletedStat");
  const xpEl = document.getElementById("xpEarnedStat");
  const coinsEl = document.getElementById("coinsEarnedStat");
  const streakEl = document.getElementById("currentStreak");
  const lStreakEl = document.getElementById("longestStreakStat");
  const bestDayEl = document.getElementById("bestDayStat");
  const tBadgesEl = document.getElementById("totalBadgesEarned");

  // Sync hero stats
  const heroStatTests = document.getElementById("heroStatTests");
  const heroStatWpm = document.getElementById("heroStatWpm");
  const heroStatStreak = document.getElementById("heroStatStreak");
  const heroStatAcc = document.getElementById("heroStatAcc");

  if (totalTests === 0) {
    if (hWpmEl) hWpmEl.textContent = "0";
    if (aWpmEl) aWpmEl.textContent = "0";
    if (hAccEl) hAccEl.textContent = "0%";
    if (aAccEl) aAccEl.textContent = "0%";
    if (tWordsEl) tWordsEl.textContent = "0";
    if (tCharsEl) tCharsEl.textContent = "0";
    if (hoursEl) hoursEl.textContent = "0h";
    if (tTestsEl) tTestsEl.textContent = "0";
    
    if (gPlayEl) gPlayEl.textContent = "0";
    if (lCompEl) lCompEl.textContent = "0";
    if (xpEl) xpEl.textContent = "0";
    if (coinsEl) coinsEl.textContent = "0";
    if (streakEl) streakEl.textContent = "0";
    if (lStreakEl) lStreakEl.textContent = "0";
    if (bestDayEl) bestDayEl.textContent = "—";
    if (tBadgesEl) tBadgesEl.textContent = totalBadges;

    if (heroStatTests) heroStatTests.textContent = "0";
    if (heroStatWpm) heroStatWpm.textContent = "0";
    if (heroStatStreak) heroStatStreak.textContent = "0";
    if (heroStatAcc) heroStatAcc.textContent = "—";
    return;
  }

  const highestWpm = Math.max(...records.map((r) => r.wpm));
  const avgWpm = Math.round(records.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
  const highestAcc = Math.max(...records.map((r) => r.accuracy));
  const avgAcc = Math.round(records.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const streak = calculateStreak(records);
  const longestStreak = storage.get("typePlayLongestStreak", streak);
  if (streak > longestStreak) {
    storage.set("typePlayLongestStreak", streak);
  }

  const totalChars = records.reduce((sum, r) => sum + (r.paragraph ? r.paragraph.length : 0), 0);
  const totalWords = records.reduce((sum, r) => sum + (r.paragraph ? r.paragraph.split(/\s+/).length : 0), 0);
  const hours = (totalDuration / 3600).toFixed(1);

  // Best Typing Day
  let bestDay = "—";
  const dayMap = {};
  records.forEach(r => {
    const d = new Date(r.date);
    const dayStr = d.toLocaleDateString();
    if (!dayMap[dayStr]) dayMap[dayStr] = { sum: 0, count: 0 };
    dayMap[dayStr].sum += r.wpm;
    dayMap[dayStr].count++;
  });
  let highestAvg = 0;
  for (let day in dayMap) {
    const avg = dayMap[day].sum / dayMap[day].count;
    if (avg > highestAvg) {
      highestAvg = avg;
      bestDay = day;
    }
  }

  // Animate counter values
  if (hWpmEl) animateNumber(hWpmEl, 0, highestWpm, 800);
  if (aWpmEl) animateNumber(aWpmEl, 0, avgWpm, 800);
  if (hAccEl) hAccEl.textContent = `${highestAcc}%`;
  if (aAccEl) aAccEl.textContent = `${avgAcc}%`;
  if (tWordsEl) animateNumber(tWordsEl, 0, totalWords, 800);
  if (tCharsEl) animateNumber(tCharsEl, 0, totalChars, 800);
  if (hoursEl) hoursEl.textContent = `${hours}h`;
  if (tTestsEl) animateNumber(tTestsEl, 0, totalTests, 800);

  if (gPlayEl) animateNumber(gPlayEl, 0, storage.get("typePlayGamesPlayed", 0), 800);
  if (lCompEl) animateNumber(lCompEl, 0, lessonsManager.completedLevels.length, 800);
  if (xpEl) animateNumber(xpEl, 0, profileManager.xp, 800);
  if (coinsEl) animateNumber(coinsEl, 0, profileManager.coins, 800);
  if (streakEl) animateNumber(streakEl, 0, streak, 800);
  if (lStreakEl) animateNumber(lStreakEl, 0, longestStreak, 800);
  if (bestDayEl) bestDayEl.textContent = bestDay;
  if (tBadgesEl) animateNumber(tBadgesEl, 0, totalBadges, 800);

  // Set hero stats
  if (heroStatTests) heroStatTests.textContent = totalTests;
  if (heroStatWpm) heroStatWpm.textContent = highestWpm;
  if (heroStatStreak) heroStatStreak.textContent = streak;
  if (heroStatAcc) heroStatAcc.textContent = `${avgAcc}%`;
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
          <span class="hist-badge diff-badge ${record.difficulty || 'medium'}">${(record.difficulty || 'medium').toUpperCase()}</span>
        </div>
      </div>
      <div class="hist-details">
        <p class="hist-paragraph">"${(record.paragraph || '').substring(0, 75)}..."</p>
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
  
  toast.info(`📖 Loaded Campaign Level ${lessonId}! Press "Start Test" or Enter key to begin.`);
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

  // Calculate remaining time until midnight
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = midnight - now;
  const diffHrs = Math.max(0, Math.floor(diffMs / 3600000));
  const diffMins = Math.max(0, Math.floor((diffMs % 3600000) / 60000));
  
  if (dom.challengeCountdown) {
    dom.challengeCountdown.textContent = `${String(diffHrs).padStart(2, "0")}h ${String(diffMins).padStart(2, "0")}m`;
  }
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
  
  toast.info(`📅 Loaded Daily ${chalType.toUpperCase()} Challenge! Complete the run to unlock rewards.`);
}

// Shop items catalog definition
const SHOP_ITEMS = {
  themes: [
    { id: "light", name: "Light Mode", price: 0, preview: "☀️" },
    { id: "dark", name: "Dark Slate", price: 0, preview: "🌙" },
    { id: "blue", name: "Deep Ocean", price: 100, preview: "🌊" },
    { id: "purple", name: "Cyber Purple", price: 150, preview: "🔮" },
    { id: "green", name: "Forest Mint", price: 200, preview: "🌿" },
    { id: "amoled", name: "AMOLED Black", price: 250, preview: "🕶️" },
    { id: "neon", name: "Neon Glow", price: 300, preview: "🚨" },
    { id: "sunset", name: "Sunset Gold", price: 350, preview: "🌇" },
    { id: "matrix", name: "Matrix Green", price: 500, preview: "📟" }
  ],
  cursors: [
    { id: "line", name: "Classic Line", price: 0, preview: "❘" },
    { id: "block", name: "Retro Block", price: 150, preview: "█" },
    { id: "underline", name: "Underline", price: 150, preview: "＿" },
    { id: "glowdot", name: "Glow Dot", price: 300, preview: "🔴" },
    { id: "laser", name: "Neon Laser", price: 450, preview: "⚡" }
  ],
  avatars: [
    { id: "alien", name: "Alien Cadet", price: 0, preview: "👽" },
    { id: "fox", name: "Cyber Fox", price: 0, preview: "🦊" },
    { id: "cat", name: "Ninja Cat", price: 200, preview: "🐱" },
    { id: "ghost", name: "Retro Ghost", price: 350, preview: "👻" },
    { id: "robot", name: "AI Automaton", price: 500, preview: "🤖" },
    { id: "unicorn", name: "Typing Unicorn", price: 750, preview: "🦄" }
  ],
  badges: [
    { id: "badge_cadet", name: "Speedy Cadet Title", price: 100, preview: "⚡" },
    { id: "badge_ninja", name: "Keyboard Ninja Title", price: 300, preview: "🥷" },
    { id: "badge_lord", name: "Typing Overlord Title", price: 600, preview: "👑" },
    { id: "badge_god", name: "Keyboard Deity Title", price: 1000, preview: "🌌" }
  ]
};

// Reward & Shop Renderer
function renderShop(category) {
  // Update shop coins balance text display
  if (dom.shopCoinsText) {
    dom.shopCoinsText.textContent = profileManager.coins;
  }

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
    } else if (category === "badges") {
      isUnlocked = profileManager.unlockedBadges.includes(item.id);
      isEquipped = profileManager.selectedBadge === item.id;
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

// Daily Goals UI rendering
function renderDailyGoalsUI() {
  const goalsList = document.getElementById("goalsList");
  const compText = document.getElementById("goalsCompletionText");
  const overallFill = document.getElementById("goalsOverallFill");

  if (!goalsList) return;

  const goals = goalsManager.getGoals();
  const completedCount = goalsManager.getCompletedCount();
  const completionPercent = goalsManager.getCompletionPercent();

  if (compText) compText.textContent = `${completedCount} / ${goals.length} complete`;
  if (overallFill) overallFill.style.width = `${completionPercent}%`;

  goalsList.innerHTML = "";
  goals.forEach(goal => {
    const card = document.createElement("div");
    card.className = `goal-item ${goal.completed ? "goal-done" : ""}`;
    card.innerHTML = `
      <span class="goal-icon">${goal.icon}</span>
      <div class="goal-body">
        <div class="goal-title">${goal.title}</div>
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${goal.progressPercent}%"></div>
        </div>
        <div class="goal-progress-text">${goal.currentProgress} / ${goal.target} ${goal.unit === "seconds" ? "sec" : goal.unit}</div>
      </div>
      <span class="goal-check">${goal.completed ? "✅" : "⏳"}</span>
    `;
    goalsList.appendChild(card);
  });
}

// Custom text counting & statistics
function updateCustomTextCounters() {
  const text = dom.customInput ? dom.customInput.value : "";
  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  
  // Est time: words / 60 WPM
  const estSecs = Math.round((words / 60) * 60);

  const charEl = document.getElementById("customCharCount");
  const wordEl = document.getElementById("customWordCount");
  const estEl = document.getElementById("customEstTime");

  if (charEl) charEl.textContent = chars;
  if (wordEl) wordEl.textContent = words;
  if (estEl) estEl.textContent = `${estSecs}s`;
}

// Save custom text to history of 5 recent pasted items
function saveCustomTextToRecent(text) {
  if (text.trim().length === 0) return;
  const recent = storage.get("typePlayRecentCustom", []);
  
  // Remove if exists
  const filtered = recent.filter(t => t !== text);
  filtered.unshift(text);
  
  // Cap at 5
  storage.set("typePlayRecentCustom", filtered.slice(0, 5));
}

// Render recent custom texts on the tab panel
function renderRecentCustomTexts() {
  const listEl = document.getElementById("recentTextsList");
  if (!listEl) return;

  const recent = storage.get("typePlayRecentCustom", []);
  listEl.innerHTML = "";

  if (recent.length === 0) {
    listEl.innerHTML = `<p style="font-size:12px;color:var(--text-muted);padding:10px 0;">No recent custom texts found.</p>`;
    return;
  }

  recent.forEach((text, idx) => {
    const item = document.createElement("div");
    item.className = "recent-text-item";
    item.innerHTML = `
      <span class="recent-text-preview">#${idx + 1}: ${text.substring(0, 60)}...</span>
      <button class="btn btn-sm btn-outline">Load</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      soundEngine.play("btnClick");
      if (dom.customInput) {
        dom.customInput.value = text;
        updateCustomTextCounters();
        toast.success("Loaded recent text!");
        
        // Load next paragraph
        if (!isTestActive) loadNextParagraph();
      }
    });

    listEl.appendChild(item);
  });
}

