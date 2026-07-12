import { storage, soundEngine } from "./utils.js";

const DEFAULT_PROFILE = {
  xp: 0,
  coins: 0,
  level: 1,
  selectedAvatar: "alien",
  selectedCursor: "line",
  selectedTheme: "dark",
  unlockedAvatars: ["alien", "fox"],
  unlockedCursors: ["line"],
  unlockedThemes: ["light", "dark", "blue"],
  unlockedBadges: []
};

export const profileManager = {
  xp: 0,
  coins: 0,
  level: 1,
  selectedAvatar: "alien",
  selectedCursor: "line",
  selectedTheme: "dark",
  unlockedAvatars: ["alien", "fox"],
  unlockedCursors: ["line"],
  unlockedThemes: ["light", "dark", "blue"],
  unlockedBadges: [],
  selectedBadge: "",
  
  onLevelUp: null, // Callback function (level)

  init() {
    const data = storage.get("typePlayUserProfile", DEFAULT_PROFILE);
    this.xp = data.xp ?? 0;
    this.coins = data.coins ?? 0;
    this.level = data.level ?? 1;
    this.selectedAvatar = data.selectedAvatar ?? "alien";
    this.selectedCursor = data.selectedCursor ?? "line";
    this.selectedTheme = data.selectedTheme ?? "dark";
    this.unlockedAvatars = data.unlockedAvatars ?? ["alien", "fox"];
    this.unlockedCursors = data.unlockedCursors ?? ["line"];
    this.unlockedThemes = data.unlockedThemes ?? ["light", "dark", "blue"];
    this.unlockedBadges = data.unlockedBadges ?? [];
    this.selectedBadge = data.selectedBadge ?? "";
    this.save();
  },

  save() {
    storage.set("typePlayUserProfile", {
      xp: this.xp,
      coins: this.coins,
      level: this.level,
      selectedAvatar: this.selectedAvatar,
      selectedCursor: this.selectedCursor,
      selectedTheme: this.selectedTheme,
      unlockedAvatars: this.unlockedAvatars,
      unlockedCursors: this.unlockedCursors,
      unlockedThemes: this.unlockedThemes,
      unlockedBadges: this.unlockedBadges,
      selectedBadge: this.selectedBadge
    });
  },

  addXP(amount) {
    if (amount <= 0) return false;
    this.xp += amount;
    
    // Level up calculation: XP req = (level * level) * 100
    let leveledUp = false;
    while (this.xp >= this.getXPNeededForNextLevel()) {
      this.level++;
      leveledUp = true;
    }
    
    this.save();
    
    if (leveledUp) {
      soundEngine.play("levelUp");
      if (this.onLevelUp) {
        this.onLevelUp(this.level);
      }
    }
    return leveledUp;
  },

  addCoins(amount) {
    if (amount <= 0) return;
    this.coins += amount;
    this.save();
  },

  getXPNeededForNextLevel() {
    return (this.level * this.level) * 100;
  },

  getCurrentLevelProgressXP() {
    const prevLevelXP = this.level === 1 ? 0 : ((this.level - 1) * (this.level - 1)) * 100;
    return this.xp - prevLevelXP;
  },

  getXPRequiredForCurrentLevelSpan() {
    const prevLevelXP = this.level === 1 ? 0 : ((this.level - 1) * (this.level - 1)) * 100;
    return this.getXPNeededForNextLevel() - prevLevelXP;
  },

  purchaseItem(type, itemId, price) {
    if (this.coins < price) {
      alert("Not enough coins!");
      return false;
    }

    if (type === "theme") {
      if (this.unlockedThemes.includes(itemId)) return true;
      this.unlockedThemes.push(itemId);
    } else if (type === "cursor") {
      if (this.unlockedCursors.includes(itemId)) return true;
      this.unlockedCursors.push(itemId);
    } else if (type === "avatar") {
      if (this.unlockedAvatars.includes(itemId)) return true;
      this.unlockedAvatars.push(itemId);
    } else if (type === "badge") {
      if (this.unlockedBadges.includes(itemId)) return true;
      this.unlockedBadges.push(itemId);
      
      // Also add to achievements list for badges grid integration
      const badges = storage.get("typePlayBadges", []);
      if (!badges.includes(itemId)) {
        badges.push(itemId);
        storage.set("typePlayBadges", badges);
      }
    } else {
      return false;
    }

    this.coins -= price;
    this.save();
    soundEngine.play("success");
    return true;
  },

  selectItem(type, itemId) {
    if (type === "theme") {
      if (!this.unlockedThemes.includes(itemId)) return false;
      this.selectedTheme = itemId;
    } else if (type === "cursor") {
      if (!this.unlockedCursors.includes(itemId)) return false;
      this.selectedCursor = itemId;
    } else if (type === "avatar") {
      if (!this.unlockedAvatars.includes(itemId)) return false;
      this.selectedAvatar = itemId;
    } else if (type === "badge") {
      if (!this.unlockedBadges.includes(itemId)) return false;
      this.selectedBadge = itemId;
    } else {
      return false;
    }
    
    this.save();
    return true;
  }
};
