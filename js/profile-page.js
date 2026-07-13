/**
 * profile-page.js — Profile Dashboard Module
 * Renders the upgraded user profile page displaying user statistics,
 * Level progress, XP, coins, unlocked achievements preview, and active theme.
 */

import { profileManager } from "./profile.js";
import { achievementsManager } from "./achievements.js";
import { historyManager } from "./history.js";
import { storage } from "./utils.js";

const AVATAR_MAP = {
  alien: "👽",
  fox: "🦊",
  cat: "🐱",
  dog: "🐶",
  robot: "🤖",
  ninja: "🥷",
  wizard: "🧙",
  dragon: "🐉",
  astronaut: "👩‍🚀",
  unicorn: "🦄"
};

export const profilePageManager = {
  /**
   * Renders the full profile dashboard panel on the Profile Tab.
   */
  render() {
    const avatarEl = document.getElementById("profileAvatarLarge");
    const usernameEl = document.getElementById("profilePageUsername");
    const levelEl = document.getElementById("profilePageLevel");
    const xpLabelEl = document.getElementById("profilePageXpLabel");
    const xpNeededEl = document.getElementById("profilePageXpNeeded");
    const xpFillEl = document.getElementById("profilePageXpFill");
    const coinsEl = document.getElementById("profilePageCoins");
    const streakEl = document.getElementById("profilePageStreak");
    const achsCountEl = document.getElementById("profilePageAchs");

    const currentStreakEl = document.getElementById("profileCurrentStreak");
    const longestStreakEl = document.getElementById("profileLongestStreak");
    const favThemeEl = document.getElementById("profileFavTheme");

    // Profile Stats Cards
    const bestWpmEl = document.getElementById("profileBestWpm");
    const avgWpmEl = document.getElementById("profileAvgWpm");
    const avgAccEl = document.getElementById("profileAvgAcc");
    const totalTestsEl = document.getElementById("profileTotalTests");
    const totalWordsEl = document.getElementById("profileTotalWords");
    const hoursEl = document.getElementById("profileHours");

    // Achievements Preview
    const achsRowEl = document.getElementById("profileAchievementsRow");

    if (!avatarEl) return; // Tab not loaded or elements missing

    // Set Avatar (emoji mapping)
    const activeAvatar = profileManager.selectedAvatar;
    avatarEl.textContent = AVATAR_MAP[activeAvatar] || "👽";

    // Set Header Info
    const username = storage.get("typePlayUsername", "Typer Cadet");
    usernameEl.textContent = username;
    levelEl.textContent = `Level ${profileManager.level}`;
    
    // XP Details
    const progressXP = profileManager.getCurrentLevelProgressXP();
    const spanXP = profileManager.getXPRequiredForCurrentLevelSpan();
    const percent = Math.min(100, Math.round((progressXP / spanXP) * 100));

    xpLabelEl.textContent = `${progressXP} / ${spanXP} XP`;
    xpNeededEl.textContent = `${spanXP - progressXP} XP to next level`;
    xpFillEl.style.width = `${percent}%`;

    // General Summary
    coinsEl.textContent = profileManager.coins;
    
    const records = historyManager.getRecords();
    const totalTests = records.length;
    
    // Streaks
    const streak = storage.get("typePlayStreak", 0);
    const longestStreak = storage.get("typePlayLongestStreak", streak);
    streakEl.textContent = streak;
    currentStreakEl.innerHTML = `🔥 ${streak}<br><small>Current Streak</small>`;
    longestStreakEl.innerHTML = `🏆 ${longestStreak}<br><small>Longest Streak</small>`;
    
    const themeName = profileManager.selectedTheme;
    favThemeEl.innerHTML = `🎨 ${themeName.toUpperCase()}<br><small>Equipped Theme</small>`;

    // Stats calculations
    let bestWpm = 0;
    let sumWpm = 0;
    let sumAcc = 0;
    let totalWords = 0;
    let totalChars = 0;

    records.forEach(r => {
      if (r.wpm > bestWpm) bestWpm = r.wpm;
      sumWpm += r.wpm;
      sumAcc += r.accuracy;
      // Estimate words (char length / 5)
      totalWords += Math.round((r.paragraph || "").split(" ").length);
      totalChars += (r.paragraph || "").length;
    });

    const avgWpm = totalTests > 0 ? Math.round(sumWpm / totalTests) : 0;
    const avgAcc = totalTests > 0 ? Math.round(sumAcc / totalTests) : 0;

    // Estimate typing hours (duration is in seconds)
    const totalSecs = records.reduce((sum, r) => sum + (r.duration || 60), 0);
    const hours = (totalSecs / 3600).toFixed(1);

    // Apply values to stats cards
    bestWpmEl.textContent = bestWpm;
    avgWpmEl.textContent = avgWpm;
    avgAccEl.textContent = `${avgAcc}%`;
    totalTestsEl.textContent = totalTests;
    totalWordsEl.textContent = totalWords.toLocaleString();
    hoursEl.textContent = `${hours}h`;

    // achievements count
    const unlockedCount = achievementsManager.getUnlockedCount();
    achsCountEl.textContent = unlockedCount;

    // Render achievements preview (show max 8 unlocked or locked)
    const allAchs = achievementsManager.getAll();
    achsRowEl.innerHTML = "";
    
    const previewAchs = allAchs.slice(0, 8);
    previewAchs.forEach(ach => {
      const achBadge = document.createElement("div");
      achBadge.className = `profile-ach-badge ${ach.unlocked ? "unlocked" : "locked"}`;
      achBadge.title = `${ach.title}: ${ach.desc}`;
      achBadge.innerHTML = `
        <span class="profile-ach-badge-icon">${ach.unlocked ? ach.icon : "🔒"}</span>
        <span class="profile-ach-badge-name">${ach.title}</span>
      `;
      achsRowEl.appendChild(achBadge);
    });
  }
};
