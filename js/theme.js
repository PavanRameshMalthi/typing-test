import { storage } from "./utils.js";

const THEMES = ["light", "dark", "blue", "purple", "green", "amoled", "neon", "sunset", "matrix"];

export const themeManager = {
  currentTheme: "dark",

  init() {
    this.currentTheme = storage.get("typePlayTheme", "dark");
    this.applyTheme(this.currentTheme);
  },

  applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "dark";
    
    // Remove all theme classes from document body
    THEMES.forEach((t) => {
      document.body.classList.remove(`theme-${t}`);
    });
    
    // Add the selected theme class
    document.body.classList.add(`theme-${theme}`);
    this.currentTheme = theme;
    storage.set("typePlayTheme", theme);
  },

  setTheme(theme) {
    this.applyTheme(theme);
  },

  getThemes() {
    return THEMES;
  }
};
