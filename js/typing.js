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
    
    // Callbacks
    this.onProgress = options.onProgress;
    this.onComplete = options.onComplete;
    this.onKeyPress = options.onKeyPress; // (key, isCorrect)
    this.onNextKey = options.onNextKey;     // (nextChar, finger)
    this.onCombo = options.onCombo;         // (currentCombo)
    
    this.floatingCursor = null;
    this.isRunning = false;
    this.isCompleted = false;
    
    this.reset();
  }

  reset() {
    this.paragraph = "";
    this.typedText = "";
    this.correctChars = 0;
    this.totalTypedKeys = 0;
    this.mistakesCount = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.mistakeKeyMap = {};
    this.mistypedWords = new Set();
    this.prevInputLength = 0;
    this.charSpans = [];
    
    this.isRunning = false;
    this.isCompleted = false;
    
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
    
    if (this.floatingCursor) {
      this.floatingCursor.classList.add("hidden");
    }
  }

  loadParagraph(text) {
    this.reset();
    this.paragraph = text.trim();
    
    this.paragraphDisplay.innerHTML = "";
    
    // Create floating cursor element
    this.floatingCursor = document.createElement("div");
    this.floatingCursor.id = "floatingCursor";
    this.floatingCursor.className = "floating-cursor hidden";
    this.paragraphDisplay.appendChild(this.floatingCursor);

    // Split into characters and wrap in spans
    this.charSpans = this.paragraph.split("").map((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "char gray";
      
      if (char === " ") {
        span.classList.add("space-char");
      }
      
      this.paragraphDisplay.appendChild(span);
      return span;
    });

    if (this.charSpans.length > 0) {
      this.charSpans[0].classList.add("current");
      setTimeout(() => this.updateCursorPosition(0), 10);
      this.emitNextKey(0);
    }

    if (this.remainingDisplay) {
      this.remainingDisplay.textContent = this.paragraph.length;
    }
  }

  start() {
    this.isRunning = true;
    this.isCompleted = false;
    this.hiddenInput.disabled = false;
    this.hiddenInput.value = "";
    this.hiddenInput.focus();
    this.prevInputLength = 0;
    if (this.charSpans.length > 0) {
      this.updateCursorPosition(0);
    }
  }

  focus() {
    if (this.isRunning && !this.isCompleted && !this.hiddenInput.disabled) {
      this.hiddenInput.focus();
    }
  }

  handleInput(timeElapsedSeconds) {
    // Before processing any keyboard input, check if already completed
    if (this.isCompleted || !this.isRunning) {
      this.hiddenInput.value = this.typedText;
      this.hiddenInput.disabled = true;
      this.hiddenInput.blur();
      return;
    }

    const typed = this.hiddenInput.value;
    const currentLen = typed.length;
    const isBackspace = currentLen < this.prevInputLength;
    
    if (currentLen > this.paragraph.length) {
      this.hiddenInput.value = typed.substring(0, this.paragraph.length);
      return;
    }

    this.typedText = typed;

    // Detect mistake or correct press on key addition
    if (!isBackspace && currentLen > 0) {
      const idx = currentLen - 1;
      const expectedChar = this.paragraph[idx];
      const typedChar = typed[idx];
      
      this.totalTypedKeys++;

      const isCorrect = expectedChar === typedChar;
      
      if (!isCorrect) {
        this.mistakesCount++;
        this.combo = 0; // reset combo
        soundEngine.play("error");
        
        // Visual shake effect on paragraph display
        this.paragraphDisplay.classList.add("screen-shake-anim");
        setTimeout(() => {
          this.paragraphDisplay.classList.remove("screen-shake-anim");
        }, 300);

        // Heatmap tracking
        const targetLower = expectedChar.toLowerCase();
        this.mistakeKeyMap[targetLower] = (this.mistakeKeyMap[targetLower] || 0) + 1;

        // Word-level mistake tracking
        this.trackMistypedWord(idx);
        
        if (this.charSpans[idx]) {
          this.charSpans[idx].classList.add("shake-anim");
          setTimeout(() => {
            if (this.charSpans[idx]) this.charSpans[idx].classList.remove("shake-anim");
          }, 300);
        }
      } else {
        this.combo++;
        if (this.combo > this.maxCombo) {
          this.maxCombo = this.combo;
        }
        
        soundEngine.play("click");
        
        if (this.combo > 0 && this.combo % 25 === 0) {
          soundEngine.play("combo");
        }
        if (this.onCombo) {
          this.onCombo(this.combo);
        }
      }

      // Keyboard Visualizer Callback
      if (this.onKeyPress) {
        this.onKeyPress(expectedChar, isCorrect);
      }
    }

    this.updateCharacterStates(currentLen);
    this.updateCursorPosition(currentLen);
    this.updateMetrics(timeElapsedSeconds);
    this.emitNextKey(currentLen);

    this.prevInputLength = currentLen;

    if (this.onProgress) {
      this.onProgress(currentLen, this.paragraph.length);
    }

    // End test instantly upon typing the last character correctly
    if (currentLen === this.paragraph.length && currentLen > 0) {
      // Check if last character typed is correct
      const lastIdx = this.paragraph.length - 1;
      if (this.typedText[lastIdx] === this.paragraph[lastIdx]) {
        this.isCompleted = true;
        this.isRunning = false;
        this.hiddenInput.disabled = true;
        this.hiddenInput.blur();
        
        if (this.onComplete) {
          this.onComplete();
        }
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
        if (this.typedText[i] === this.paragraph[i]) {
          span.classList.add("correct");
        } else {
          span.classList.add("incorrect");
        }
      } else if (i === currentLen) {
        span.classList.add("current");
      } else {
        span.classList.add("gray");
      }
    }
  }

  updateCursorPosition(currentLen) {
    if (!this.floatingCursor) return;
    
    // Hide floating cursor if test completed
    if (this.isCompleted) {
      this.floatingCursor.classList.add("hidden");
      return;
    }

    if (currentLen < this.charSpans.length) {
      const currentSpan = this.charSpans[currentLen];
      if (currentSpan) {
        this.floatingCursor.style.left = `${currentSpan.offsetLeft}px`;
        this.floatingCursor.style.top = `${currentSpan.offsetTop}px`;
        this.floatingCursor.style.height = `${currentSpan.offsetHeight}px`;
        this.floatingCursor.style.width = `${currentSpan.offsetWidth}px`;
        this.floatingCursor.classList.remove("hidden");
      }
    } else {
      const lastSpan = this.charSpans[this.charSpans.length - 1];
      if (lastSpan) {
        this.floatingCursor.style.left = `${lastSpan.offsetLeft + lastSpan.offsetWidth}px`;
        this.floatingCursor.style.top = `${lastSpan.offsetTop}px`;
        this.floatingCursor.style.height = `${lastSpan.offsetHeight}px`;
        this.floatingCursor.style.width = "4px";
        this.floatingCursor.classList.remove("hidden");
      }
    }
  }

  emitNextKey(currentLen) {
    if (this.isCompleted) {
      if (this.onNextKey) this.onNextKey(null, "");
      return;
    }

    if (this.onNextKey && currentLen < this.paragraph.length) {
      const nextChar = this.paragraph[currentLen];
      const finger = this.getFingerForChar(nextChar);
      this.onNextKey(nextChar, finger);
    } else if (this.onNextKey) {
      this.onNextKey(null, "");
    }
  }

  getFingerForChar(char) {
    if (!char) return "";
    const c = char.toLowerCase();
    
    const leftPinky = "1qaz~`!\t";
    const leftRing = "2wsx@";
    const leftMiddle = "3edc#";
    const leftIndex = "45rtfgvb$%";
    const rightIndex = "67yuhjnm^&";
    const rightMiddle = "8ik,*";
    const rightRing = "9ol.(";
    const rightPinky = "0-p[];';/=\\|_+\n\r{})?:\">"; 

    if (c === " ") return "Thumbs";
    if (leftPinky.includes(c)) return "Left Pinky";
    if (leftRing.includes(c)) return "Left Ring Finger";
    if (leftMiddle.includes(c)) return "Left Middle Finger";
    if (leftIndex.includes(c)) return "Left Index Finger";
    if (rightIndex.includes(c)) return "Right Index Finger";
    if (rightMiddle.includes(c)) return "Right Middle Finger";
    if (rightRing.includes(c)) return "Right Ring Finger";
    if (rightPinky.includes(c)) return "Right Pinky";
    
    return "Right Pinky";
  }

  updateMetrics(timeElapsedSeconds) {
    let correct = 0;
    for (let i = 0; i < this.typedText.length; i++) {
      if (this.typedText[i] === this.paragraph[i]) {
        correct++;
      }
    }
    this.correctChars = correct;

    const timeMinutes = timeElapsedSeconds > 0 ? (timeElapsedSeconds / 60) : 0.01;
    const wpm = Math.round((this.correctChars / 5) / timeMinutes);
    const cpm = Math.round(this.correctChars / timeMinutes);
    const accuracy = this.totalTypedKeys > 0 
      ? Math.round((this.correctChars / this.totalTypedKeys) * 100)
      : 100;

    if (this.wpmDisplay) this.wpmDisplay.textContent = wpm;
    if (this.cpmDisplay) this.cpmDisplay.textContent = cpm;
    if (this.accuracyDisplay) this.accuracyDisplay.textContent = `${accuracy}%`;
    if (this.mistakesDisplay) this.mistakesDisplay.textContent = this.mistakesCount;
    
    const remaining = this.paragraph.length - this.typedText.length;
    if (this.remainingDisplay) this.remainingDisplay.textContent = remaining;
    if (this.typedDisplay) this.typedDisplay.textContent = this.typedText.length;

    if (this.progressBar && this.paragraph.length > 0) {
      const percentage = (this.typedText.length / this.paragraph.length) * 100;
      this.progressBar.style.width = `${percentage}%`;
    }
  }

  trackMistypedWord(charIndex) {
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
