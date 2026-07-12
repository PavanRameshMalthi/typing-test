# Typing Learning & Gaming Platform 🚀

Typing Learning & Gaming Platform is a feature-rich, high-performance, glassmorphic typing speed assessment application. It is designed to evaluate, analyze, and train keyboarding skills using modern web standards. By utilizing modular Vanilla JavaScript, CSS Custom Properties, and responsive layout structures, this tool provides a visual and auditory environment that mimics top-tier competitive typing sites (like Monkeytype or Keybr).

![Logo](assets/logo.svg)

---

## 📅 Key Features

- **Character-by-Character Highlighting**: Real-time coloring updates:
  - Correct inputs are highlighted in emerald green.
  - Mistyped inputs are highlighted in ruby red with physical character shaking feedback.
  - Active caret/cursor is animated to represent current focus.
- **Synthesized Sound Effects**: Built with **Web Audio API** oscillators for offline click keystrokes, mistake buzzes, button press snaps, and test completion chimes.
- **Theme Selection Engine**: Support for 6 distinct themes: Light, Dark, Ocean Blue, Cyber Purple, Emerald Green, and AMOLED Black. Selections are stored locally.
- **Detailed History logs**: Log entries detailing date, WPM, accuracy, mistakes, paragraph length, and difficulty level. Support for searching, sorting, and single/all deletion.
- **Performance Charts**: Responsive dual-axis line charts (using Chart.js) illustrating speed and accuracy trajectories, supplemented with horizontal average lines.
- **Keyboard Error Heatmap**: Highlights keyboard layouts using red-to-orange color scaling to represent keys with frequent mistakes during typing.
- **Printable Certificates**: Auto-generates high-resolution certificates drawn on HTML5 canvas. Users can input names and download a landscape A4 PDF.
- **PWA Offline Operations**: A service worker pre-caches assets to enable 100% offline access. Includes "Install App" prompt compatibility.
- **Zen & Daily Modes**:
  - *Zen Mode*: Metric displays are hidden during typing, letting users type without speed anxiety.
  - *Daily Challenge*: Generates a deterministic daily paragraph to track competitive scores.
- **Keyboard Shortcuts**: Supports rapid hotkey controls:
  - `Enter` -> Start typing test.
  - `Escape` -> Pause/Resume.
  - `Ctrl + R` / `Tab + Enter` -> Restart test.

---

## 🛠️ Technologies Used

- **Markup & Styling**: HTML5 (Semantic Structure) & CSS3 (Flexbox, CSS Grid, Glassmorphic effects, Theme selectors)
- **Programming Logic**: Modular ECMAScript (ESM) Vanilla JavaScript
- **PWA Capabilities**: Service Worker & Web App Manifest (`manifest.json`)
- **Visual Charts**: [Chart.js](https://www.chartjs.org/) via CDN
- **Effects**: Canvas Confetti via CDN
- **PDF Exporter**: [jsPDF](https://github.com/parallax/jsPDF) via CDN
- **Audio Synthesizer**: Native Web Audio API (Triangular, Sine, Sawtooth sweeps)

---

## 📂 Folder Structure

```text
typing-test/
├── assets/
│   └── logo.svg             # SVG logo and PWA icon
├── css/
│   └── style.css            # Stylesheet with variables, responsive grids, and animations
├── js/
│   ├── app.js               # Main hub coordinator & PWA events listener
│   ├── certificate.js       # Canvas certificate drawing & PDF generator
│   ├── chart.js             # Chart.js wrapper with average lines
│   ├── history.js           # History CRUD logger & CSV/JSON/PDF exporters
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
   git clone https://github.com/username/typing-test.git
   ```
2. Open the project in your favorite IDE (e.g., VS Code).
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

## 🎮 Usage Guide

1. **Start Typing**: Click inside the transparent text box or press `Enter` to focus.
2. **Settings Panel**: Adjust the typing difficulty (Easy to Expert) and test duration. Choose any of the visual themes from the dropdown.
3. **Replaying Mistakes**: If you mistype words, click the "Replay Mistakes" button at the end to practice only the words you failed on.
4. **Get Certificate**: Once you complete a test, look at your test logs, click the "📜 Cert" button, enter your name, and download a digital certificate.
5. **Exporting Data**: In the test history section, choose CSV, JSON, or PDF to download your full typing history.

---

## 🎯 Future Improvements

- Add multiplayer online matchups via WebSockets.
- Implement an automated AI typing tutor that adapts target paragraphs based on mistake key heatmaps.
- Introduce additional game-like features like speed hurdles and typing space shooters.

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👤 Author

Developed by **TypePlay Team**. Assisted by Google DeepMind team.
