# TypePlay — Typing Learning & Gaming Platform 🚀

TypePlay is a state-of-the-art, feature-rich, high-performance glassmorphic typing speed assessment and gamified training platform. It is engineered to evaluate, analyze, and train keyboarding skills using modern web standards. By utilizing modular Vanilla JavaScript, CSS Custom Properties, and fully responsive layouts, TypePlay provides a gorgeous visual and auditory environment comparable to top-tier typing sites like Monkeytype, Keybr, and TypingClub.

---

## Live Demo & Screenshots
- **Live Demo**: [Check out the live deployment!](https://github.com/PavanRameshMalthi/typing-test)
- **Design Aesthetic**: Premium glassmorphism with 9 curated themes (including cyber neon, amoled, matrix green, and sunset gold).

---

## 📅 Key Features

### 1. Advanced Home Page Redesign
- **Hero Section**: Introduces the platform, features a quick description, and has primary CTA action triggers to immediately start practice.
- **Quick Stats HUD**: Embedded summary showing Tests Done, Best WPM, Active Streak, and Average Accuracy.
- **Daily Goals**: Interactive checklist panel showing 6 goals refreshed at midnight with progress bars and coins/XP rewards.
- **Collapsible Settings Menu**: Collapses advanced developer configurations, appearance adjustments, and reset controls to prevent clutter.

### 2. Difficulty Cards
- Modern interactive cards (Easy, Medium, Hard, Expert) replacing basic drop-down selects.
- Vibrant difficulty icons, descriptions, hover micro-animations, active highlight glows, and full keyboard navigation.

### 3. First-Time Onboarding
- Professional multi-step glassmorphic wizard welcoming users.
- Slide and fade step transitions, progress indicators, and keyboard shortcut walkthroughs.
- Stored locally to prompt only once.

### 4. Achievement System
- 25 achievements across 7 categories (Speed milestones, accuracy consistency, typing volume, daily streaks, campaign completion, gaming sessions, level thresholds).
- Special achievements unlock toasts, unlock confetti cascades, rarity badges (Common, Uncommon, Rare, Legendary), and completion percentage tracking.

### 5. Upgraded Stats Dashboard
- 16 detailed stats cards with real-time counting animations.
- Records Highest WPM, Average WPM, Best Accuracy, Total Words, Characters Typed, Hours Practiced, Streak, Games Played, Lessons Completed, and Best Typing Day.

### 6. Interactive Custom Text
- Allows copy-pasting custom paragraphs, uploading `.txt` and `.md` files, or selecting recent historical texts (up to 5 saved) with real-time character/word counts. Includes an AI paragraph generator placeholder.

### 7. Virtual Keyboard visualizer
- Dynamic glowing feedback: correct keys flash emerald green with press-down animations; incorrect keys flash ruby red with screen and key shake animations. Next-character keys glow soft blue.

### 8. Playable Typing Games
- **Fruit Catch**: Catch falling fruits by typing before they touch the ground.
- **Space Shooter**: Type debris and alien spaceship words to fire lasers.
- **Rocket Race**: Race against a CPU opponent. Correct keystrokes boost speed.
- **Car Racing**: Correct words drive your car, typos apply brakes.
- **Zombie Escape**: Escape a chasing zombie whose speed escalates.

### 9. Campaign Progression Map
- 17 structured levels (Home Row to Regex Experts, HTML5, JavaScript, SQL, and C syntax typing).
- HUD panel tracking rank, completion percentage, and score records.

### 10. Expanding Certificate System
- Dynamic HTML5 canvas drawing printable landscape achievement certificates. Auto-fills statistics and downloads as landscape PDF or PNG.

### 11. Accessibility Features
- Full keyboard tab navigation, visible focus rings, ARIA roles, dyslexia-friendly font face toggling, high-contrast theme overrides, and adjustable font sizes.

### 12. PWA Offline Support
- Service worker caching to enable full functionality offline.

---

## 🛠️ Technologies Used
- **Markup**: HTML5 (Semantic elements, ARIA landmarks)
- **Styling**: CSS3 (Glassmorphism, custom theme tokens, flexbox/grid layout, media queries)
- **Scripting**: Modular Vanilla ES6 JavaScript (ESM)
- **Charts**: Chart.js via CDN (lazy-loaded on statistics tab selection)
- **Animations**: Canvas Confetti via CDN
- **PDF exporter**: jsPDF via CDN
- **Audio Synthesizer**: Native Web Audio API oscillators

---

## 📂 Folder Structure

```text
typing-test/
├── assets/
│   └── logo.svg             # SVG logo and PWA icon
├── css/
│   └── style.css            # Stylesheet with variables, responsive grids, and animations
├── js/
│   ├── app.js               # Main hub coordinator, events listener, & SPA Router
│   ├── toast.js             # Reusable glassmorphic toast notification manager
│   ├── onboarding.js        # First-time welcome wizard & tutorial controller
│   ├── goals.js             # Daily goals progress tracker & midnight reset logic
│   ├── achievements.js      # Achievements check logic & rarity definition grid
│   ├── profile-page.js      # Upgraded profile page layout & badge rendering
│   ├── certificate.js       # HTML5 canvas certificate drawer & PDF exporter
│   ├── chart.js             # Chart.js wrapper with average lines (lazy loaded)
│   ├── history.js           # History CRUD logger & data exporters (CSV/JSON/PDF)
│   ├── theme.js             # Theme manager & persistent variable setter
│   ├── timer.js             # Timer class with pause/resume precision ticks
│   ├── typing.js            # Character validation engine & accuracy tracker
│   └── utils.js             # Sound synthesizers, paragraph dataset, & storage helpers
├── index.html               # Main entry HTML document
├── manifest.json            # PWA manifest configurations
├── sw.js                    # Service worker for offline asset caching
└── README.md                # Documentation manual
```

---

## 🚀 Installation & Local Development

This application runs entirely on static files, requiring no back-end servers!

1. Clone or download the repository to your local directory:
   ```bash
   git clone https://github.com/PavanRameshMalthi/typing-test.git
   ```
2. Open the project in your workspace.
3. Start a local development server. For example:
   - Using VS Code: Right-click `index.html` -> "Open with Live Server".
   - Using Node.js:
     ```bash
     npm install -g local-server
     local-server
     ```
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
4. Access the web interface in your browser at `http://localhost:8000`.

---

## ⌨️ Keyboard Shortcuts
- `Enter` ➔ Start typing test.
- `Escape` ➔ Pause / Resume test.
- `Ctrl + R` ➔ Restart test.
- `Alt + 1` to `Alt + 9` ➔ Navigate SPA tabs.

---

## 🔒 License
This project is licensed under the MIT License.

## 👤 Author
Developed by **Pavan Ramesh Malthi**. Assisted by Google DeepMind team.
