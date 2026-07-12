// Synthesized Sound Engine using Web Audio API
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEngine = {
  enabled: localStorage.getItem("agTyperSound") !== "false",
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("agTyperSound", this.enabled);
    return this.enabled;
  },

  play(type) {
    if (!this.enabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      if (type === "click") {
        // Typing mechanical key sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
        
      } else if (type === "error") {
        // Warning buzz for wrong key
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
        
      } else if (type === "success") {
        // Chime for completing test
        const playNote = (freq, startOffset, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + startOffset);
          gain.gain.setValueAtTime(0.08, now + startOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
          osc.start(now + startOffset);
          osc.stop(now + startOffset + duration + 0.01);
        };
        playNote(523.25, 0, 0.12);    // C5
        playNote(659.25, 0.08, 0.12); // E5
        playNote(783.99, 0.16, 0.12); // G5
        playNote(1046.5, 0.24, 0.3);  // C6
        
      } else if (type === "btnClick") {
        // Interactive control buttons click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
        
      } else if (type === "combo") {
        // High pitched double-beep combo chime
        const playNote = (freq, startOffset, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + startOffset);
          gain.gain.setValueAtTime(0.08, now + startOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
          osc.start(now + startOffset);
          osc.stop(now + startOffset + duration + 0.01);
        };
        playNote(880, 0, 0.05);
        playNote(1200, 0.04, 0.08);
        
      } else if (type === "levelUp") {
        // Ascending chord progression
        const playChord = (freq1, freq2, startOffset, duration) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.type = "sine";
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(freq1, now + startOffset);
          osc2.frequency.setValueAtTime(freq2, now + startOffset);
          gain.gain.setValueAtTime(0.08, now + startOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
          osc1.start(now + startOffset);
          osc2.start(now + startOffset);
          osc1.stop(now + startOffset + duration + 0.01);
          osc2.stop(now + startOffset + duration + 0.01);
        };
        playChord(261.63, 329.63, 0, 0.15); // C4 + E4
        playChord(329.63, 392.00, 0.12, 0.15); // E4 + G4
        playChord(392.00, 523.25, 0.24, 0.15); // G4 + C5
        playChord(523.25, 659.25, 0.36, 0.4); // C5 + E5
        
      } else if (type === "victory") {
        // Melodic success sound
        const playNote = (freq, startOffset, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + startOffset);
          gain.gain.setValueAtTime(0.08, now + startOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
          osc.start(now + startOffset);
          osc.stop(now + startOffset + duration + 0.01);
        };
        playNote(523.25, 0, 0.1);   // C5
        playNote(587.33, 0.1, 0.1); // D5
        playNote(659.25, 0.2, 0.1); // E5
        playNote(783.99, 0.3, 0.15); // G5
        playNote(659.25, 0.45, 0.1); // E5
        playNote(783.99, 0.55, 0.3); // G5
        
      } else if (type === "achievement") {
        // Majestic notification sound
        const playNote = (freq, startOffset, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + startOffset);
          gain.gain.setValueAtTime(0.07, now + startOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
          osc.start(now + startOffset);
          osc.stop(now + startOffset + duration + 0.01);
        };
        playNote(587.33, 0, 0.08); // D5
        playNote(783.99, 0.08, 0.08); // G5
        playNote(987.77, 0.16, 0.08); // B5
        playNote(1174.66, 0.24, 0.25); // D6
      }
    } catch (e) {
      console.warn("Audio Context playback failed or was blocked by browser", e);
    }
  }
};

// 52 Unique Typing Paragraphs grouped by Difficulty
export const PARAGRAPHS = {
  easy: [
    "the sun is warm today and the sky is blue",
    "dogs love to run in the green park with a ball",
    "we went to the lake to fish and swim last week",
    "cats like to sleep in a warm spot on the floor",
    "she has a nice red car that goes fast and quiet",
    "he ate a big apple and drank a glass of water",
    "they walked to the store to buy some fresh food",
    "the birds sing sweet songs in the tree branches",
    "my home is warm and safe during the cold night",
    "please write your name on the clean white paper",
    "look at the green grass and the bright red rose",
    "it is good to read books and learn new things",
    "he came back to the office to do his work today"
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog.",
    "Reading books is a great way to expand your knowledge and vocabulary.",
    "Always drink plenty of water to stay hydrated throughout the hot day.",
    "Learning to play a musical instrument takes time, effort, and patience.",
    "Technology is changing the way we communicate, work, and live our lives.",
    "The rain fell softly on the roof, creating a soothing sound for sleep.",
    "We plan to go on a long road trip across the country next summer vacation.",
    "A healthy diet and regular exercise are key components of a long life.",
    "She decided to learn a new language to help with her international career.",
    "He spent the afternoon cooking a delicious dinner for his close friends.",
    "The ocean waves crashed gently against the golden sand of the beach.",
    "It is important to double-check your work for any minor spelling mistakes.",
    "They built a wooden treehouse in the backyard for the kids to play in."
  ],
  highlightedHard: [
    // We call this hard to match the difficulty selection
  ],
  hard: [
    "It's a well-known fact—though often ignored—that coding requires constant, undivided focus; indeed, one typo can break everything!",
    "Are you ready for a challenge? Keep typing, maintain your speed, and don't let the punctuation marks trip you up!",
    "The project's success was, to put it mildly, a huge relief; however, we still have a lot of debugging left to do.",
    "She queried: \"Can we finish the release by Friday?\" The manager replied with a shrug, saying, \"It depends on our velocity.\"",
    "Self-discipline is the bridge between goals and accomplishment; therefore, practicing daily is essential for mastery.",
    "To be, or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune...",
    "Wait! Did you notice the semi-colons? They are tricky, but with a bit of practice, you'll type them without looking.",
    "Modern web design is more than just HTML and CSS; it involves animations, performance, accessibility, and user-centric logic.",
    "The developer's keyboard was clacking late into the night: coding, testing, debugging, and refactoring continuously.",
    "A developer's life is full of challenges—from fixing bugs to learning new frameworks—but it's incredibly rewarding.",
    "Keep calm and type on! Even if you make mistakes, just backspace, correct them, and carry on with the rest of the text.",
    "\"Success is not final, failure is not fatal: it is the courage to continue that counts,\" Winston Churchill once remarked.",
    "The quick, nimble fingers of the experienced typist flew across the mechanical keyboard with precision, speed, and grace."
  ],
  expert: [
    "In JS, we define constants with `const PI = 3.14159;` and function arrow syntax `const f = x => x * x;` which yields f(10) === 100.",
    "For loop syntax: `for (let i = 0; i < array.length; i++) { console.log(array[i]); }` is standard, though array.forEach() is cleaner.",
    "JSON data structure: { \"id\": 99, \"name\": \"User_1\", \"roles\": [\"admin\", \"dev\"], \"active\": true, \"metrics\": { \"score\": 98.7 } }",
    "Math formula: x = (-b +- Math.sqrt(b*b - 4*a*c)) / (2*a); calculate discriminant D = b^2 - 4ac first to verify real roots.",
    "CSS grid properties: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; justify-content: center;",
    "Regular Expression query: const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$/; test email syntax input validation.",
    "SQL Database command: SELECT id, username, COUNT(tests) FROM users WHERE active = 1 GROUP BY id ORDER BY WPM DESC LIMIT 10;",
    "Terminal command execution: `git commit -am \"feat(auth): add OAuth2 login flow (#43)\" && git push origin main --force-with-lease`",
    "React Hook syntax: const [stats, setStats] = useState({ wpm: 0, acc: 100, mistakes: 0 }); useEffect(() => { init(); }, []);",
    "Markdown symbols formatting: # Title\\n## Section\\n- **Bold text**\\n- *Italic text*\\n- `inline code`\\n[link](http://site.org)",
    "Object Destructuring: const { wpm, accuracy, mistakes, date: testDate } = testHistory.reduce((acc, curr) => curr.wpm > acc.wpm ? curr : acc);",
    "API fetch handler: fetch('https://api.quotable.io/random').then(r => r.json()).then(data => { showQuote(data.content); });",
    "Complexity check: O(n log n) is typical for efficient sorting algorithms like Quicksort & Mergesort, while Bubblesort is O(n^2)."
  ]
};

// LocalStorage helpers
export const storage = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }
};

// Get a random paragraph by difficulty
export function getRandomParagraph(difficulty) {
  const pool = PARAGRAPHS[difficulty] || PARAGRAPHS.medium;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

// Deterministic paragraph for the Daily Challenge
export function getDailyParagraph() {
  // Combine all pools into one giant list
  const allParagraphs = [...PARAGRAPHS.easy, ...PARAGRAPHS.medium, ...PARAGRAPHS.hard, ...PARAGRAPHS.expert];
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % allParagraphs.length;
  return allParagraphs[index];
}

// Fetch a quote from public API with a fallback
export async function fetchQuote() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout
    
    const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://api.quotable.io/random?minLength=100&maxLength=250"), {
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (response.ok) {
      const data = await response.json();
      const quoteObj = JSON.parse(data.contents);
      if (quoteObj && quoteObj.content) {
        return quoteObj.content;
      }
    }
  } catch (error) {
    console.warn("Quote API fetch failed. Using fallback.", error);
  }
  
  // Local fallbacks representing quotes
  const quotesFallback = [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep moving forward.",
    "In the middle of difficulty lies opportunity. Keep your focus high, your typing clean, and your mind peaceful.",
    "Your typing speed represents how fast your thoughts flow into the machine. Practice brings thoughts and keys in sync."
  ];
  return quotesFallback[Math.floor(Math.random() * quotesFallback.length)];
}

// Practice Preset Databases
const PRACTICE_PRESETS = {
  letters: {
    home: "aaa sss ddd fff jjj kkk lll ;;; asdf jkl; fdsa ;lkj asdf jkl; a s d f j k l ;",
    top: "qqq www eee rrr ttt yyy uuu iii ooo ppp qwer tyuiop pqwoeiruty rewt yuio qwer tyuiop",
    bottom: "zzz xxx ccc vvv bbb nnn mmm ,,, ... /// zxcv bnm,./ czxvn m,./ zxcv bnm,./ vn zx",
    all: "asdf jkl; qwer tyuiop zxcv bnm,./ a s d f j k l ; q w e r t y u i o p z x c v b n m , . /"
  },
  words: {
    easy: "apple house green water lemon melon table beach bread dream light plant sleep smile trace paper earth stone grass river",
    medium: "computer keyboard coding developer gravity rocket space planet portal energy shield engine future arcade runner danger dynamic",
    hard: "programming javascript dictionary complexity intelligence certification documentation standardisation vulnerability accessibility infrastructure"
  },
  sentences: {
    easy: "the sun is warm today. cats like to sleep on floors. a dog ran in the park. please write your name.",
    medium: "Reading books is a great way to expand your vocabulary. Technology is changing the way we live and work.",
    hard: "It's a well-known fact—though often ignored—that coding requires constant, undivided focus; indeed, one typo can break everything!"
  },
  numbers: {
    phone: "(123) 456-7890 987-654-3210 (555) 019-2834 800-555-0199 (111) 222-3333 444-555-6666",
    years: "1998 2026 2012 1776 1945 1066 1492 2001 2049 1984 2077 1865 2000 2030",
    prices: "$19.99 $5.00 $100.50 $1250.00 $0.99 $45.75 $350.00 $12.45 $99.90 $499.00 $2499.95",
    random: "1234567890 9876543210 1122334455 9988776655 1020304050 5432167890 121234345656"
  },
  symbols: {
    brackets: "{} [] () <> {[]} ([]) {()} <[]> ({[]}) [({<>})] {([<>])}",
    operators: "+=-_ *&^% +=-- +=* /++ -=-- && || != == !== === <= >= += -= *= /=",
    mixed: "!@#$%^&*()_+ {[]}\\|;':\",./<>? `~-_=+[{]};:'\",<.>/?!@#$%"
  },
  programming: {
    js: "const name = 'John'; for(let i=0;i<10;i++) { console.log(i); }",
    html: "<div class='container'><h1 id='title'>Hello World</h1><p>Welcome to our typing game!</p></div>",
    css: ".card { display: flex; justify-content: center; align-items: center; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }",
    python: "def greet(name):\n    for i in range(5):\n        print(f'Hello {name} {i}')",
    sql: "SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY score DESC LIMIT 10;",
    c: "#include <stdio.h>\nint main() {\n    printf('Hello, World!\\n');\n    return 0;\n}",
    java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println('Hello World');\n    }\n}"
  }
};

export function getPracticeContent(type, subtype) {
  const group = PRACTICE_PRESETS[type];
  if (!group) return "The quick brown fox jumps over the lazy dog.";
  
  const text = group[subtype] || Object.values(group)[0];
  
  // For words, we can randomize words to keep it fresh
  if (type === "words") {
    const list = text.split(" ");
    let selected = [];
    for (let i = 0; i < 12; i++) {
      selected.push(list[Math.floor(Math.random() * list.length)]);
    }
    return selected.join(" ");
  }
  
  // For sentences, pick a random sentence if multiple are separated by dot
  if (type === "sentences") {
    const list = text.split(". ");
    const pick = list[Math.floor(Math.random() * list.length)];
    return pick.trim() + (pick.endsWith(".") ? "" : ".");
  }
  
  return text;
}
