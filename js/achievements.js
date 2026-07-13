/**
 * achievements.js — Enhanced Achievement System
 * Manages 15+ achievements with unlock detection, toast notifications,
 * progress tracking, and LocalStorage persistence.
 */

import { storage } from "./utils.js";
import { showAchievementToast } from "./toast.js";

const ACHIEVEMENTS_KEY = "typePlayAchievements";

/**
 * Full achievement definitions.
 * Each achievement has: id, title, desc, icon, rarity, and a
 * check(stats) function that returns true/false.
 */
export const ACHIEVEMENT_DEFINITIONS = [
  // ── Practice Milestones ──────────────────────────────────────────
  {
    id: "first_test",
    title: "First Flight",
    desc: "Complete your very first typing test",
    icon: "🚀",
    rarity: "common",
    check: (s) => s.totalTests >= 1
  },
  {
    id: "tests_10",
    title: "Daily Typist",
    desc: "Complete 10 typing tests",
    icon: "📚",
    rarity: "common",
    check: (s) => s.totalTests >= 10
  },
  {
    id: "tests_50",
    title: "Dedicated Learner",
    desc: "Complete 50 typing tests",
    icon: "🎖️",
    rarity: "uncommon",
    check: (s) => s.totalTests >= 50
  },
  {
    id: "tests_100",
    title: "Keyboard Warrior",
    desc: "Complete 100 typing tests",
    icon: "⚔️",
    rarity: "rare",
    check: (s) => s.totalTests >= 100
  },

  // ── Speed Achievements ────────────────────────────────────────────
  {
    id: "wpm_30",
    title: "Getting Started",
    desc: "Reach 30 WPM in a single test",
    icon: "🐢",
    rarity: "common",
    check: (s) => s.bestWpm >= 30
  },
  {
    id: "wpm_50",
    title: "Speedy Cadet",
    desc: "Reach 50 WPM in a single test",
    icon: "⚡",
    rarity: "common",
    check: (s) => s.bestWpm >= 50
  },
  {
    id: "wpm_80",
    title: "Speed Racer",
    desc: "Reach 80 WPM in a single test",
    icon: "🏎️",
    rarity: "uncommon",
    check: (s) => s.bestWpm >= 80
  },
  {
    id: "wpm_100",
    title: "Key Legend",
    desc: "Reach 100 WPM in a single test",
    icon: "🌌",
    rarity: "rare",
    check: (s) => s.bestWpm >= 100
  },
  {
    id: "wpm_120",
    title: "Keyboard God",
    desc: "Reach 120 WPM in a single test",
    icon: "🌟",
    rarity: "legendary",
    check: (s) => s.bestWpm >= 120
  },

  // ── Accuracy Achievements ─────────────────────────────────────────
  {
    id: "acc_95",
    title: "Sharp Shooter",
    desc: "Achieve 95% accuracy in a test",
    icon: "🎯",
    rarity: "uncommon",
    check: (s) => s.bestAcc >= 95
  },
  {
    id: "acc_100",
    title: "Perfectionist",
    desc: "Achieve 100% accuracy in a single test",
    icon: "💎",
    rarity: "rare",
    check: (s) => s.bestAcc === 100
  },

  // ── Volume Achievements ───────────────────────────────────────────
  {
    id: "words_1k",
    title: "Word Builder",
    desc: "Type 1,000 total words",
    icon: "📝",
    rarity: "common",
    check: (s) => s.totalWords >= 1000
  },
  {
    id: "words_10k",
    title: "Word Giant",
    desc: "Type 10,000 total words",
    icon: "🐉",
    rarity: "rare",
    check: (s) => s.totalWords >= 10000
  },
  {
    id: "chars_50k",
    title: "Character Master",
    desc: "Type 50,000 total characters",
    icon: "🔤",
    rarity: "uncommon",
    check: (s) => s.totalChars >= 50000
  },

  // ── Streak Achievements ───────────────────────────────────────────
  {
    id: "streak_3",
    title: "Habit Forming",
    desc: "Maintain a 3-day typing streak",
    icon: "🔥",
    rarity: "common",
    check: (s) => s.streak >= 3
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    desc: "Maintain a 7-day typing streak",
    icon: "🗓️",
    rarity: "uncommon",
    check: (s) => s.streak >= 7
  },
  {
    id: "streak_30",
    title: "Unstoppable",
    desc: "Maintain a 30-day typing streak",
    icon: "🌊",
    rarity: "legendary",
    check: (s) => s.streak >= 30
  },

  // ── Games Achievements ────────────────────────────────────────────
  {
    id: "games_1",
    title: "First Player",
    desc: "Play your first typing game",
    icon: "🎮",
    rarity: "common",
    check: (s) => s.gamesPlayed >= 1
  },
  {
    id: "games_10",
    title: "Game Addict",
    desc: "Play 10 typing games",
    icon: "🕹️",
    rarity: "uncommon",
    check: (s) => s.gamesPlayed >= 10
  },

  // ── Lessons Achievements ──────────────────────────────────────────
  {
    id: "lessons_1",
    title: "First Step",
    desc: "Complete your first campaign level",
    icon: "📖",
    rarity: "common",
    check: (s) => s.lessonsCompleted >= 1
  },
  {
    id: "lessons_all",
    title: "Campaign Master",
    desc: "Complete all 17 campaign levels",
    icon: "🏆",
    rarity: "legendary",
    check: (s) => s.lessonsCompleted >= 17
  },

  // ── Level Achievements ────────────────────────────────────────────
  {
    id: "level_5",
    title: "Rising Star",
    desc: "Reach Level 5",
    icon: "⭐",
    rarity: "common",
    check: (s) => s.userLevel >= 5
  },
  {
    id: "level_10",
    title: "Typing Elite",
    desc: "Reach Level 10",
    icon: "💫",
    rarity: "uncommon",
    check: (s) => s.userLevel >= 10
  },
  {
    id: "level_25",
    title: "Grand Master",
    desc: "Reach Level 25",
    icon: "🔱",
    rarity: "legendary",
    check: (s) => s.userLevel >= 25
  }
];

export const achievementsManager = {
  unlockedIds: [],

  /** Initialize — load saved unlocked achievements. */
  init() {
    this.unlockedIds = storage.get(ACHIEVEMENTS_KEY, []);
  },

  /**
   * Check all achievements against current stats.
   * Shows toast for newly unlocked ones.
   * @param {Object} stats — Current user stats
   * @returns {Array} Newly unlocked achievement objects
   */
  check(stats) {
    const newlyUnlocked = [];

    ACHIEVEMENT_DEFINITIONS.forEach(ach => {
      if (this.unlockedIds.includes(ach.id)) return; // Already unlocked
      if (ach.check(stats)) {
        this.unlockedIds.push(ach.id);
        newlyUnlocked.push(ach);
        showAchievementToast(ach.title, ach.desc, ach.icon);
      }
    });

    if (newlyUnlocked.length > 0) {
      storage.set(ACHIEVEMENTS_KEY, this.unlockedIds);
    }

    return newlyUnlocked;
  },

  /**
   * Get all achievements with unlock status.
   * @returns {Array}
   */
  getAll() {
    return ACHIEVEMENT_DEFINITIONS.map(ach => ({
      ...ach,
      unlocked: this.unlockedIds.includes(ach.id)
    }));
  },

  /**
   * Get completion percentage.
   * @returns {number}
   */
  getCompletionPercent() {
    return Math.round((this.unlockedIds.length / ACHIEVEMENT_DEFINITIONS.length) * 100);
  },

  /**
   * Get count of unlocked achievements.
   * @returns {number}
   */
  getUnlockedCount() {
    return this.unlockedIds.length;
  },

  /**
   * Get total achievement count.
   * @returns {number}
   */
  getTotalCount() {
    return ACHIEVEMENT_DEFINITIONS.length;
  },

  /**
   * Check if a specific achievement is unlocked.
   * @param {string} id
   * @returns {boolean}
   */
  isUnlocked(id) {
    return this.unlockedIds.includes(id);
  }
};
