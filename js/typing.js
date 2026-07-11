import { soundEngine } from "./utils.js";

export class TypingEngine {
  constructor(options) {
    this.paragraphDisplay = options.paragraphDisplay;
    this.hiddenInput = options.hiddenInput;
    this.progressBar = options.progressBar;
    this.wpmDisplay = options.wpmDisplay;
    this.cpmDisplay = options.cpmDisplay;
    this.accuracyDisplay = options.accuracyDisplay;
    this.mistakesDisplay = options.mistakesDisplay;
    this.remainingDisplay = options.remainingDisplay;
    this.typedDisplay = options.typedDisplay;
    
    this.onProgress = options.onProgress; // callback
    this.onComplete = options.onComplete; // callback
    
    this.reset();
  }

  reset() {
    this.paragraph = "";
    this.typedText = "";
    this.correctChars = 0;
    this.totalTypedKeys = 0;
    this.mistakesCount = 0;
    this.mistakeKeyMap = {}; // Tracks character: mistakeCount for heatmap
    this.mistypedWords = new Set(); // Tracks words containing errors
    this.prevInputLength = 0;
    this.charSpans = [];
    this.hiddenInput.value = "";
    this.hiddenInput.disabled = true;
    
    // Clear displays
    if (this.wpmDisplay) this.wpmDisplay.textContent = "0";
    if (this.cpmDisplay) this.cpmDisplay.textContent = "0";
    if (this.accuracyDisplay) this.accuracyDisplay.textContent = "100%";
    if (this.mistakesDisplay) this.mistakesDisplay.textContent = "0";
    if (this.remainingDisplay) this.remainingDisplay.textContent = "0";
    if (this.typedDisplay) this.typedDisplay.textContent = "0";
    if (this.progressBar) this.progressBar.style.width = "0%";
  }

  loadParagraph(text) {
    this.reset();
    this.paragraph = text.trim();
    
    // Split into characters and wrap in spans
    this.paragraphDisplay.innerHTML = "";
    this.charSpans = this.paragraph.split("").map((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "char gray";
      
      // Keep track of whitespace formatting for rendering
      if (char === " ") {
        span.classList.add("space-char");
      }
      
      this.paragraphDisplay.appendChild(span);
      return span;
    });

    if (this.charSpans.length > 0) {
      this.charSpans[0].classList.add("current");
    }

    if (this.remainingDisplay) {
      this.remainingDisplay.textContent = this.paragraph.length;
    }
  }

  start() {
    this.hiddenInput.disabled = false;
    this.hiddenInput.value = "";
    this.hiddenInput.focus();
    this.prevInputLength = 0;
  }

  focus() {
    if (!this.hiddenInput.disabled) {
      this.hiddenInput.focus();
    }
  }

  handleInput(timeElapsedSeconds) {
    const typed = this.hiddenInput.value;
    const currentLen = typed.length;
    const isBackspace = currentLen < this.prevInputLength;
    
    if (currentLen > this.paragraph.length) {
      this.hiddenInput.value = typed.substring(0, this.paragraph.length);
      return;
    }

    this.typedText = typed;

    // Detect mistake on keystroke addition
    if (!isBackspace && currentLen > 0) {
      const idx = currentLen - 1;
      const expectedChar = this.paragraph[idx];
      const typedChar = typed[idx];
      
      this.totalTypedKeys++;

      if (expectedChar !== typedChar) {
        this.mistakesCount++;
        soundEngine.play("error");
        
        // Heatmap tracking
        const targetLower = expectedChar.toLowerCase();
        this.mistakeKeyMap[targetLower] = (this.mistakeKeyMap[targetLower] || 0) + 1;

        // Word-level mistake tracking (find word bounds in target text)
        this.trackMistypedWord(idx);
        
        // Visual shake effect on the current character
        if (this.charSpans[idx]) {
          this.charSpans[idx].classList.add("shake-anim");
          setTimeout(() => {
            if (this.charSpans[idx]) this.charSpans[idx].classList.remove("shake-anim");
          }, 300);
        }
      } else {
        soundEngine.play("click");
      }
    }

    this.updateCharacterStates(currentLen);
    this.updateMetrics(timeElapsedSeconds);

    this.prevInputLength = currentLen;

    // Fire progress callback
    if (this.onProgress) {
      this.onProgress(currentLen, this.paragraph.length);
    }

    // Auto complete when finished
    if (currentLen === this.paragraph.length && currentLen > 0) {
      this.hiddenInput.disabled = true;
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  updateCharacterStates(currentLen) {
    for (let i = 0; i < this.charSpans.length; i++) {
      const span = this.charSpans[i];
      span.className = "char";

      if (span.textContent === " ") {
        span.classList.add("space-char");
      }

      if (i < currentLen) {
        // Checked characters
        if (this.typedText[i] === this.paragraph[i]) {
          span.classList.add("correct");
        } else {
          span.classList.add("incorrect");
        }
      } else if (i === currentLen) {
        // Cursor character
        span.classList.add("current");
      } else {
        // Upcoming characters
        span.classList.add("gray");
      }
    }
  }

  updateMetrics(timeElapsedSeconds) {
    // Recalculate correct characters
    let correct = 0;
    for (let i = 0; i < this.typedText.length; i++) {
      if (this.typedText[i] === this.paragraph[i]) {
        correct++;
      }
    }
    this.correctChars = correct;

    // Time calculations
    const timeMinutes = timeElapsedSeconds > 0 ? (timeElapsedSeconds / 60) : 0.01;
    
    // WPM: Standard is 5 characters = 1 word
    const wpm = Math.round((this.correctChars / 5) / timeMinutes);
    // CPM: Characters per minute
    const cpm = Math.round(this.correctChars / timeMinutes);
    // Accuracy
    const accuracy = this.totalTypedKeys > 0 
      ? Math.round((this.correctChars / this.totalTypedKeys) * 100)
      : 100;

    // Update DOM
    if (this.wpmDisplay) this.wpmDisplay.textContent = wpm;
    if (this.cpmDisplay) this.cpmDisplay.textContent = cpm;
    if (this.accuracyDisplay) this.accuracyDisplay.textContent = `${accuracy}%`;
    if (this.mistakesDisplay) this.mistakesDisplay.textContent = this.mistakesCount;
    
    const remaining = this.paragraph.length - this.typedText.length;
    if (this.remainingDisplay) this.remainingDisplay.textContent = remaining;
    if (this.typedDisplay) this.typedDisplay.textContent = this.typedText.length;

    // Progress bar
    if (this.progressBar && this.paragraph.length > 0) {
      const percentage = (this.typedText.length / this.paragraph.length) * 100;
      this.progressBar.style.width = `${percentage}%`;
    }
  }

  trackMistypedWord(charIndex) {
    // Find the bounds of the word in which the error occurred
    let start = charIndex;
    while (start > 0 && this.paragraph[start - 1] !== " ") {
      start--;
    }
    let end = charIndex;
    while (end < this.paragraph.length && this.paragraph[end] !== " ") {
      end++;
    }
    
    const word = this.paragraph.slice(start, end).trim();
    if (word) {
      this.mistypedWords.add(word);
    }
  }

  getWPM(timeElapsedSeconds) {
    const timeMinutes = timeElapsedSeconds > 0 ? (timeElapsedSeconds / 60) : 0.01;
    return Math.round((this.correctChars / 5) / timeMinutes);
  }

  getAccuracy() {
    return this.totalTypedKeys > 0 
      ? Math.round((this.correctChars / this.totalTypedKeys) * 100)
      : 100;
  }

  getMistakes() {
    return this.mistakesCount;
  }

  getHeatmapData() {
    return this.mistakeKeyMap;
  }

  getReplayParagraph() {
    if (this.mistypedWords.size === 0) return "";
    return Array.from(this.mistypedWords).join(" ");
  }
}
