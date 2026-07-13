/**
 * goals.js — Daily Goals System
 * Manages daily typing goals with progress tracking, progress bars,
 * completion rewards, and automatic daily reset at midnight.
 */

import { storage } from "./utils.js";

// Helper to get a "YYYY-MM-DD" date string for today
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Goal definitions
const GOAL_DEFINITIONS = [
  {
    id: "complete_tests",
    icon: "🎯",
    title: "Complete 3 Tests",
    description: "Finish 3 typing tests today",
    target: 3,
    unit: "tests",
    xpReward: 75,
    coinReward: 30,
    category: "practice"
  },
  {
    id: "practice_time",
    icon: "⏱️",
    title: "Practice 5 Minutes",
    description: "Accumulate 5 minutes of active typing today",
    target: 300, // seconds
    unit: "seconds",
    displayTarget: "5 min",
    xpReward: 50,
    coinReward: 20,
    category: "practice"
  },
  {
    id: "reach_accuracy",
    icon: "🎯",
    title: "95% Accuracy",
    description: "Complete a test with at least 95% accuracy",
    target: 1,
    unit: "tests",
    xpReward: 100,
    coinReward: 40,
    category: "accuracy"
  },
  {
    id: "earn_xp",
    icon: "⚡",
    title: "Earn 100 XP",
    description: "Earn at least 100 XP from typing today",
    target: 100,
    unit: "XP",
    xpReward: 25,
    coinReward: 15,
    category: "xp"
  },
  {
    id: "play_game",
    icon: "🎮",
    title: "Play One Game",
    description: "Complete at least one typing game session",
    target: 1,
    unit: "games",
    xpReward: 60,
    coinReward: 25,
    category: "games"
  },
  {
    id: "finish_lesson",
    icon: "📖",
    title: "Finish One Lesson",
    description: "Complete at least one campaign level",
    target: 1,
    unit: "lessons",
    xpReward: 80,
    coinReward: 35,
    category: "lessons"
  }
];

export const goalsManager = {
  todayStr: "",
  progress: {},       // { goalId: currentProgress }
  completed: {},      // { goalId: boolean }
  rewardsClaimed: {}, // { goalId: boolean }

  /** Callbacks set by app.js */
  onGoalComplete: null, // (goal) => void
  onAllGoalsComplete: null, // () => void

  /**
   * Initialize — load or reset progress for today.
   */
  init() {
    this.todayStr = getTodayStr();
    const saved = storage.get("typePlayDailyGoals", null);

    if (saved && saved.date === this.todayStr) {
      // Same day — restore progress
      this.progress = saved.progress || {};
      this.completed = saved.completed || {};
      this.rewardsClaimed = saved.rewardsClaimed || {};
    } else {
      // New day — reset
      this.resetProgress();
    }
  },

  /**
   * Reset all progress (new day).
   */
  resetProgress() {
    this.progress = {};
    this.completed = {};
    this.rewardsClaimed = {};
    GOAL_DEFINITIONS.forEach(g => {
      this.progress[g.id] = 0;
      this.completed[g.id] = false;
      this.rewardsClaimed[g.id] = false;
    });
    this.save();
  },

  /**
   * Save current state to localStorage.
   */
  save() {
    storage.set("typePlayDailyGoals", {
      date: this.todayStr,
      progress: this.progress,
      completed: this.completed,
      rewardsClaimed: this.rewardsClaimed
    });
  },

  /**
   * Update progress for a specific goal.
   * @param {string} goalId
   * @param {number} amount — Amount to add (or absolute value for one-time goals)
   * @param {boolean} absolute — If true, set instead of add
   * @returns {boolean} — Whether this update completed the goal
   */
  updateProgress(goalId, amount, absolute = false) {
    // Check for day change
    const currentDay = getTodayStr();
    if (currentDay !== this.todayStr) {
      this.todayStr = currentDay;
      this.resetProgress();
    }

    const goal = GOAL_DEFINITIONS.find(g => g.id === goalId);
    if (!goal || this.completed[goalId]) return false;

    if (absolute) {
      this.progress[goalId] = Math.max(this.progress[goalId] || 0, amount);
    } else {
      this.progress[goalId] = (this.progress[goalId] || 0) + amount;
    }

    let justCompleted = false;
    if (!this.completed[goalId] && this.progress[goalId] >= goal.target) {
      this.completed[goalId] = true;
      justCompleted = true;

      if (this.onGoalComplete) {
        this.onGoalComplete(goal);
      }

      // Check if all goals done
      const allDone = GOAL_DEFINITIONS.every(g => this.completed[g.id]);
      if (allDone && this.onAllGoalsComplete) {
        this.onAllGoalsComplete();
      }
    }

    this.save();
    return justCompleted;
  },

  /**
   * Get all goals with current progress data.
   * @returns {Array}
   */
  getGoals() {
    return GOAL_DEFINITIONS.map(goal => ({
      ...goal,
      currentProgress: this.progress[goal.id] || 0,
      completed: !!this.completed[goal.id],
      rewardClaimed: !!this.rewardsClaimed[goal.id],
      progressPercent: Math.min(100, Math.round(((this.progress[goal.id] || 0) / goal.target) * 100))
    }));
  },

  /**
   * Get overall daily completion percentage.
   * @returns {number}
   */
  getCompletionPercent() {
    const completed = GOAL_DEFINITIONS.filter(g => this.completed[g.id]).length;
    return Math.round((completed / GOAL_DEFINITIONS.length) * 100);
  },

  /**
   * Get count of completed goals today.
   * @returns {number}
   */
  getCompletedCount() {
    return GOAL_DEFINITIONS.filter(g => this.completed[g.id]).length;
  },

  /**
   * Total XP available from goals today.
   * @returns {number}
   */
  getTotalXPReward() {
    return GOAL_DEFINITIONS.reduce((sum, g) => sum + g.xpReward, 0);
  },

  /**
   * XP earned from completed goals today.
   * @returns {number}
   */
  getEarnedXP() {
    return GOAL_DEFINITIONS
      .filter(g => this.completed[g.id])
      .reduce((sum, g) => sum + g.xpReward, 0);
  }
};
