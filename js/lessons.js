import { storage } from "./utils.js";

export const LEVELS = [
  {
    id: 1,
    title: "Level 1 - Home Row",
    description: "Learn the home row keys: A, S, D, F, J, K, L, and semicolon (;). Rest your fingers on these keys.",
    text: "aaa sss ddd fff jjj kkk lll ;;; asdf jkl; fdsa ;lkj asdf jkl; a s d f j k l ;",
    requiredAcc: 80,
    requiredWpm: 15
  },
  {
    id: 2,
    title: "Level 2 - Common Words",
    description: "Practice typing short, highly frequent English words.",
    text: "the quick brown fox jumps over the lazy dog and she went to a store",
    requiredAcc: 80,
    requiredWpm: 20
  },
  {
    id: 3,
    title: "Level 3 - Numbers",
    description: "Get comfortable typing characters on the top numeric row.",
    text: "1234567890 9876543210 1122334455 1998 2026 2012 1776",
    requiredAcc: 82,
    requiredWpm: 20
  },
  {
    id: 4,
    title: "Level 4 - Symbols",
    description: "Master braces, brackets, and common logic operators.",
    text: "!@# $%^ &*() _++- =={ }}[] \\| :\" ;' <.> ?/",
    requiredAcc: 82,
    requiredWpm: 20
  },
  {
    id: 5,
    title: "Level 5 - Easy Sentences",
    description: "Practice capital letters and basic punctuation.",
    text: "The sun is warm today. Dogs love to run in the green park with a ball.",
    requiredAcc: 84,
    requiredWpm: 22
  },
  {
    id: 6,
    title: "Level 6 - Medium Sentences",
    description: "Type sentences with subclauses and multiple punctuation styles.",
    text: "Reading books is a great way to expand your knowledge and vocabulary.",
    requiredAcc: 84,
    requiredWpm: 25
  },
  {
    id: 7,
    title: "Level 7 - Hard Paragraphs",
    description: "Typing complex sentence structures, dashes, and semicolons.",
    text: "It's a well-known fact—though often ignored—that coding requires constant, undivided focus; indeed, one typo can break everything!",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 8,
    title: "Level 8 - JavaScript",
    description: "Practice typing JavaScript variables, loop structures, and objects.",
    text: "const user = { name: \"John\", age: 30 }; for (let i = 0; i < 10; i++) { console.log(i); }",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 9,
    title: "Level 9 - HTML",
    description: "Practice HTML5 tag hierarchies, classes, and elements.",
    text: "<div class=\"container\"><h1 id=\"title\">Hello World</h1><p>Welcome to typing lessons.</p></div>",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 10,
    title: "Level 10 - CSS",
    description: "Type CSS layouts, selectors, styling properties, and values.",
    text: ".card { display: flex; justify-content: center; align-items: center; border-radius: 8px; }",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 11,
    title: "Level 11 - Python",
    description: "Practice indentation levels, function declarations, and printing.",
    text: "def greet(name):\n    for i in range(5):\n        print(f\"Hello, {name} {i}\")",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 12,
    title: "Level 12 - SQL",
    description: "Master database search filters, columns, aggregates, and limits.",
    text: "SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY score DESC LIMIT 10;",
    requiredAcc: 85,
    requiredWpm: 25
  },
  {
    id: 13,
    title: "Level 13 - C Programming",
    description: "Practice header imports, integer mains, printf, and return statements.",
    text: "#include <stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",
    requiredAcc: 86,
    requiredWpm: 26
  },
  {
    id: 14,
    title: "Level 14 - SQL Queries",
    description: "Type complex database table joins and query grouping structures.",
    text: "SELECT u.id, u.name, COUNT(t.id) FROM users u JOIN tests t ON u.id = t.user_id GROUP BY u.id;",
    requiredAcc: 86,
    requiredWpm: 26
  },
  {
    id: 15,
    title: "Level 15 - Java Structures",
    description: "Practice public static void main, string arrays, and system outputs.",
    text: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
    requiredAcc: 86,
    requiredWpm: 26
  },
  {
    id: 16,
    title: "Level 16 - Expert Punctuation",
    description: "Double quotes, brackets, capitalization, and quick character turns.",
    text: "\"Wait! Did you notice the semi-colons? They are tricky, but with a bit of practice, you'll type them without looking.\"",
    requiredAcc: 88,
    requiredWpm: 28
  },
  {
    id: 17,
    title: "Level 17 - Matrix Run",
    description: "The ultimate typing challenge: regular expressions and raw speed.",
    text: "const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$/; test email syntax input validation.",
    requiredAcc: 90,
    requiredWpm: 30
  }
];

export const lessonsManager = {
  unlockedLevels: [1], // Level IDs unlocked
  completedLevels: [], // Level IDs completed
  levelScores: {},     // { levelId: { maxWpm: X, maxAcc: Y } }

  init() {
    this.unlockedLevels = storage.get("agTyperUnlockedLevels", [1]);
    this.completedLevels = storage.get("agTyperCompletedLevels", []);
    this.levelScores = storage.get("agTyperLevelScores", {});
    this.save();
  },

  save() {
    storage.set("agTyperUnlockedLevels", this.unlockedLevels);
    storage.set("agTyperCompletedLevels", this.completedLevels);
    storage.set("agTyperLevelScores", this.levelScores);
  },

  getLevels() {
    return LEVELS.map((level) => {
      const isCompleted = this.completedLevels.includes(level.id);
      const isUnlocked = this.unlockedLevels.includes(level.id);
      const score = this.levelScores[level.id] || { maxWpm: 0, maxAcc: 0 };
      
      return {
        ...level,
        completed: isCompleted,
        unlocked: isUnlocked,
        maxWpm: score.maxWpm,
        maxAcc: score.maxAcc
      };
    });
  },

  completeLevel(levelId, wpm, accuracy) {
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level) return false;

    // Check if user meets unlock criteria
    const passed = wpm >= level.requiredWpm && accuracy >= level.requiredAcc;
    
    // Save/Update score
    const currentScore = this.levelScores[levelId] || { maxWpm: 0, maxAcc: 0 };
    this.levelScores[levelId] = {
      maxWpm: Math.max(currentScore.maxWpm, wpm),
      maxAcc: Math.max(currentScore.maxAcc, accuracy)
    };

    let newlyUnlocked = false;

    if (passed) {
      if (!this.completedLevels.includes(levelId)) {
        this.completedLevels.push(levelId);
      }
      
      // Unlock the next level automatically
      const nextLevelId = levelId + 1;
      const nextLevelExists = LEVELS.some((l) => l.id === nextLevelId);
      
      if (nextLevelExists && !this.unlockedLevels.includes(nextLevelId)) {
        this.unlockedLevels.push(nextLevelId);
        newlyUnlocked = true;
      }
    }

    this.save();
    return newlyUnlocked;
  },

  getHighestUnlockedLevel() {
    return Math.max(...this.unlockedLevels);
  },

  getCampaignCompletionPercentage() {
    if (LEVELS.length === 0) return 0;
    const completedCount = this.completedLevels.length;
    return Math.round((completedCount / LEVELS.length) * 100);
  }
};
