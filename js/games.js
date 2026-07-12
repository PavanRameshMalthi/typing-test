import { PARAGRAPHS, soundEngine } from "./utils.js";
import { profileManager } from "./profile.js";

// A vocabulary list for games, synthesized from paragraph pools
const GAME_VOCABULARY = [
  "apple", "house", "coding", "computer", "keyboard", "typing", "random", "gravity", "rocket",
  "space", "planet", "laser", "zombie", "escape", "forest", "shield", "energy", "system",
  "hunter", "runner", "danger", "wizard", "dragon", "avatar", "sensor", "matrix", "vector",
  "nebula", "galaxy", "meteor", "comet", "plasma", "portal", "vertex", "cursor", "arcade",
  "player", "battle", "future", "engine", "source", "binary", "string", "symbol", "output"
];

export const typingGames = {
  canvas: null,
  ctx: null,
  activeGame: null, // "fruitCatch", "spaceShooter", "rocketRace", "carRacing", "zombieEscape"
  isRunning: false,
  score: 0,
  lives: 3,
  level: 1,
  
  // Game entities
  entities: [], // Words, fruits, meteors, etc.
  particles: [],
  player: {},
  opponent: {},
  bullets: [],
  
  // Input tracking
  currentTarget: null, // The active word entity the user is typing
  typedBuffer: "", // What has been typed correctly for the current target
  
  // Timers and spawning
  spawnTimer: 0,
  spawnInterval: 2500, // ms
  gameTime: 0,
  
  // Loop & Tracking additions
  loopId: null,
  totalKeysTyped: 0,
  correctKeysTyped: 0,
  mistakesCount: 0,
  
  onGameOver: null, // Callback when game completes (score, coinsEarned, xpEarned)

  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.resetState();
  },

  resetState() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.entities = [];
    this.particles = [];
    this.bullets = [];
    this.player = {};
    this.opponent = {};
    this.currentTarget = null;
    this.typedBuffer = "";
    this.spawnTimer = 0;
    this.spawnInterval = 2500;
    this.gameTime = 0;
    this.totalKeysTyped = 0;
    this.correctKeysTyped = 0;
    this.mistakesCount = 0;
    
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
  },

  startGame(gameType) {
    if (!this.canvas) return;
    
    // Stop any existing loop first
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    
    this.activeGame = gameType;
    this.resetState();
    this.isRunning = true;
    
    // Initialize specific game parameters
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    if (gameType === "rocketRace" || gameType === "carRacing") {
      this.player = { x: 50, y: h * 0.4, speed: 0, targetX: 50, distance: 0 };
      this.opponent = { x: 50, y: h * 0.6, speed: 3, distance: 0 }; // constant CPU speed
      this.spawnInterval = 10000; // not spawning enemies, just showing words to type
      this.spawnWordTrack();
    } else if (gameType === "zombieEscape") {
      this.player = { x: w * 0.6, y: h * 0.6, speed: 5 };
      this.opponent = { x: w * 0.2, y: h * 0.6, speed: 4.8 }; // zombie starts chasing
      this.spawnInterval = 3000;
      this.spawnEscapeWord();
    } else {
      // Space shooter and Fruit catch spawn continuously
      this.spawnInterval = 2500;
    }

    this.lastTime = performance.now();
    this.loopId = requestAnimationFrame((t) => this.loop(t));
  },

  stopGame() {
    this.isRunning = false;
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }
    this.resetState();
  },

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = (timestamp - this.lastTime) / 1000; // seconds
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.loopId = requestAnimationFrame((t) => this.loop(t));
  },

  update(dt) {
    this.gameTime += dt * 1000;
    this.updateParticles(dt);

    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Spawning Logic
    this.spawnTimer += dt * 1000;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      
      if (this.activeGame === "fruitCatch") {
        this.spawnFruit();
      } else if (this.activeGame === "spaceShooter") {
        this.spawnMeteor();
      } else if (this.activeGame === "zombieEscape") {
        this.spawnEscapeWord();
      }
    }

    // 2. Entity movement and collision checks
    if (this.activeGame === "fruitCatch") {
      this.entities.forEach((fruit) => {
        fruit.y += fruit.vy * dt;
        // Check if fruit missed (hit bottom)
        if (fruit.y > h - 30) {
          fruit.toRemove = true;
          this.lives--;
          soundEngine.play("error");
          this.triggerScreenShake();
          if (this.currentTarget === fruit) {
            this.currentTarget = null;
            this.typedBuffer = "";
          }
        }
      });
    } else if (this.activeGame === "spaceShooter") {
      // Update bullets
      this.bullets.forEach((bullet) => {
        bullet.x += bullet.vx * dt;
        bullet.y += bullet.vy * dt;
        // Collision with meteor
        this.entities.forEach((meteor) => {
          if (!meteor.toRemove && Math.hypot(bullet.x - meteor.x, bullet.y - meteor.y) < 30) {
            bullet.toRemove = true;
            meteor.toRemove = true;
            this.explode(meteor.x, meteor.y, "#ef4444");
            this.score += 100;
            soundEngine.play("success");
          }
        });
        if (bullet.y < 0 || bullet.x < 0 || bullet.x > w) {
          bullet.toRemove = true;
        }
      });
      this.bullets = this.bullets.filter(b => !b.toRemove);

      // Update meteors
      this.entities.forEach((meteor) => {
        meteor.y += meteor.vy * dt;
        if (meteor.y > h - 60) {
          meteor.toRemove = true;
          this.lives--;
          soundEngine.play("error");
          this.triggerScreenShake();
          if (this.currentTarget === meteor) {
            this.currentTarget = null;
            this.typedBuffer = "";
          }
        }
      });
    } else if (this.activeGame === "rocketRace" || this.activeGame === "carRacing") {
      // Opponent moves at steady rate
      this.opponent.distance += this.opponent.speed * 20 * dt;
      this.player.distance += this.player.speed * 20 * dt;
      
      // Decelerate player speed gradually
      this.player.speed = Math.max(0, this.player.speed - 1.5 * dt);

      // Check victory condition
      const trackLength = 2000; // target distance
      if (this.player.distance >= trackLength || this.opponent.distance >= trackLength) {
        this.isRunning = false;
        const playerWon = this.player.distance >= this.opponent.distance;
        this.endGame(playerWon);
      }
    } else if (this.activeGame === "zombieEscape") {
      // Zombie chases player
      // Zombie speed increases over time
      const zombieSpeed = (this.opponent.speed + this.gameTime / 60000) * 20;
      const playerSpeed = this.player.speed * 20;
      
      this.opponent.x += zombieSpeed * dt;
      this.player.x += playerSpeed * dt;

      // Ensure zombie is visible and moves relative to screen
      // If player typed a word, they boost forward
      this.player.speed = Math.max(2, this.player.speed - 2 * dt);
      
      // Keep player centered and adjust zombie position relative
      const relativeDist = this.player.x - this.opponent.x;
      
      if (relativeDist <= 20) {
        this.lives = 0; // zombie caught player
      }

      this.entities.forEach((word) => {
        word.x -= 30 * dt; // words scroll left
        if (word.x < 50) {
          word.toRemove = true;
          if (this.currentTarget === word) {
            this.currentTarget = null;
            this.typedBuffer = "";
          }
        }
      });
    }

    // Clean up entities
    this.entities = this.entities.filter(e => !e.toRemove);

    // 3. Game Over check
    if (this.lives <= 0) {
      this.isRunning = false;
      this.endGame(false);
    }
  },

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Clear Canvas with sleek game background gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#0c0a1c");
    gradient.addColorStop(1, "#171236");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Draw background grid lines for premium space/cyber arcade feel
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Game Entities & Elements
    if (this.activeGame === "fruitCatch") {
      this.renderFruitCatch(ctx, w, h);
    } else if (this.activeGame === "spaceShooter") {
      this.renderSpaceShooter(ctx, w, h);
    } else if (this.activeGame === "rocketRace") {
      this.renderRocketRace(ctx, w, h);
    } else if (this.activeGame === "carRacing") {
      this.renderCarRacing(ctx, w, h);
    } else if (this.activeGame === "zombieEscape") {
      this.renderZombieEscape(ctx, w, h);
    }

    // Draw Bullets (Space Shooter)
    if (this.bullets.length > 0) {
      ctx.fillStyle = "#60a5fa";
      this.bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Particles
    this.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Game HUD (Score, Level, Hearts)
    this.renderHUD(ctx, w, h);
  },

  // Render sub-game: FRUIT CATCH
  renderFruitCatch(ctx, w, h) {
    // Draw basket at bottom center
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 40, h - 35, 80, 20, 5);
    ctx.fill();

    // Draw fruits
    this.entities.forEach((fruit) => {
      ctx.fillStyle = fruit.color;
      ctx.beginPath();
      ctx.arc(fruit.x, fruit.y, 22, 0, Math.PI * 2);
      ctx.fill();

      // Leaf
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.ellipse(fruit.x + 8, fruit.y - 20, 4, 8, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Text Word
      this.drawWordText(ctx, fruit.word, fruit.x, fruit.y + 5, fruit === this.currentTarget);
    });
  },

  // Render sub-game: SPACE SHOOTER
  renderSpaceShooter(ctx, w, h) {
    // Draw player ship at bottom center
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(w / 2, h - 45);
    ctx.lineTo(w / 2 - 20, h - 20);
    ctx.lineTo(w / 2 + 20, h - 20);
    ctx.closePath();
    ctx.fill();
    // Thruster glow
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(w / 2, h - 18, 5 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw meteors
    this.entities.forEach((meteor) => {
      ctx.fillStyle = "#78716c";
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crater drawings
      ctx.fillStyle = "#57534e";
      ctx.beginPath();
      ctx.arc(meteor.x - 8, meteor.y - 8, 6, 0, Math.PI * 2);
      ctx.arc(meteor.x + 8, meteor.y + 6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Text Word
      this.drawWordText(ctx, meteor.word, meteor.x, meteor.y + 5, meteor === this.currentTarget);
    });
  },

  // Render sub-game: ROCKET RACE
  renderRocketRace(ctx, w, h) {
    const trackLength = 2000;
    
    // Draw race tracks
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(50, h * 0.4); ctx.lineTo(w - 50, h * 0.4);
    ctx.moveTo(50, h * 0.6); ctx.lineTo(w - 50, h * 0.6);
    ctx.stroke();

    // Finish Line
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(w - 70, h * 0.3);
    ctx.lineTo(w - 70, h * 0.7);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate screen positions based on distances
    const trackWidth = w - 150;
    const playerX = 50 + (this.player.distance / trackLength) * trackWidth;
    const opponentX = 50 + (this.opponent.distance / trackLength) * trackWidth;

    // Draw Opponent Rocket (Red)
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.ellipse(opponentX, h * 0.6, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b"; // fire
    ctx.beginPath();
    ctx.ellipse(opponentX - 25, h * 0.6, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText("CPU", opponentX - 10, h * 0.6 - 12);

    // Draw Player Rocket (Blue)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.ellipse(playerX, h * 0.4, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b"; // fire
    ctx.beginPath();
    ctx.ellipse(playerX - 25, h * 0.4, 8 + Math.random() * 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText("YOU", playerX - 10, h * 0.4 - 12);

    // Render active target word in center top
    if (this.entities[0]) {
      this.drawWordText(ctx, this.entities[0].word, w / 2, h * 0.8, true);
    }
  },

  // Render sub-game: CAR RACING
  renderCarRacing(ctx, w, h) {
    const trackLength = 2000;
    
    // Draw highway road (gray block in the middle)
    ctx.fillStyle = "#334155";
    ctx.fillRect(50, h * 0.3, w - 100, h * 0.4);

    // Draw road stripes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(50, h * 0.5);
    ctx.lineTo(w - 50, h * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Finish Line flag texture
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(w - 80, h * 0.3, 10, h * 0.4);

    const trackWidth = w - 200;
    const playerX = 60 + (this.player.distance / trackLength) * trackWidth;
    const opponentX = 60 + (this.opponent.distance / trackLength) * trackWidth;

    // Draw CPU Car (Orange)
    ctx.fillStyle = "#f97316";
    ctx.fillRect(opponentX, h * 0.55 - 10, 35, 18);
    ctx.fillStyle = "#000000"; // wheels
    ctx.fillRect(opponentX + 4, h * 0.55 - 13, 8, 3);
    ctx.fillRect(opponentX + 22, h * 0.55 - 13, 8, 3);
    ctx.fillRect(opponentX + 4, h * 0.55 + 8, 8, 3);
    ctx.fillRect(opponentX + 22, h * 0.55 + 8, 8, 3);

    // Draw Player Car (Teal)
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(playerX, h * 0.41 - 10, 35, 18);
    ctx.fillStyle = "#000000"; // wheels
    ctx.fillRect(playerX + 4, h * 0.41 - 13, 8, 3);
    ctx.fillRect(playerX + 22, h * 0.41 - 13, 8, 3);
    ctx.fillRect(playerX + 4, h * 0.41 + 8, 8, 3);
    ctx.fillRect(playerX + 22, h * 0.41 + 8, 8, 3);

    // Render active word
    if (this.entities[0]) {
      this.drawWordText(ctx, this.entities[0].word, w / 2, h * 0.8, true);
    }
  },

  // Render sub-game: ZOMBIE ESCAPE
  renderZombieEscape(ctx, w, h) {
    // Draw ground line
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w, h * 0.7);
    ctx.stroke();

    // Draw Player running (Teal stickman or block)
    const px = this.player.x;
    const py = this.player.y;
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath();
    ctx.arc(px, py - 30, 8, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2dd4bf";
    ctx.beginPath();
    ctx.moveTo(px, py - 22); ctx.lineTo(px, py - 8); // torso
    ctx.moveTo(px, py - 18); ctx.lineTo(px - 10, py - 10); // arms
    ctx.moveTo(px, py - 18); ctx.lineTo(px + 10, py - 10);
    ctx.moveTo(px, py - 8); ctx.lineTo(px - 8, py); // legs
    ctx.moveTo(px, py - 8); ctx.lineTo(px + 8, py);
    ctx.stroke();

    // Draw Zombie chasing (Green stickman with arms reaching forward)
    const zx = this.opponent.x;
    const zy = this.opponent.y;
    ctx.fillStyle = "#84cc16";
    ctx.beginPath();
    ctx.arc(zx, zy - 30, 8, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.strokeStyle = "#84cc16";
    ctx.beginPath();
    ctx.moveTo(zx, zy - 22); ctx.lineTo(zx, zy - 8); // torso
    ctx.moveTo(zx, zy - 18); ctx.lineTo(zx + 15, zy - 18); // reaching arms
    ctx.moveTo(zx, zy - 16); ctx.lineTo(zx + 15, zy - 16);
    ctx.moveTo(zx, zy - 8); ctx.lineTo(zx - 5, zy); // legs
    ctx.moveTo(zx, zy - 8); ctx.lineTo(zx + 5, zy);
    ctx.stroke();

    // Words scrolling left in front of player
    this.entities.forEach((word) => {
      this.drawWordText(ctx, word.word, word.x, py - 20, word === this.currentTarget);
    });
  },

  // Draw word with highlights
  drawWordText(ctx, wordText, x, y, isActive) {
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    
    // Draw background card for text
    const textWidth = ctx.measureText(wordText).width;
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.beginPath();
    ctx.roundRect(x - textWidth / 2 - 8, y - 18, textWidth + 16, 26, 4);
    ctx.fill();

    if (isActive && this.currentTarget && this.currentTarget.word === wordText) {
      // Draw typed characters in green
      const typed = this.typedBuffer;
      const untyped = wordText.substring(typed.length);
      
      const typedWidth = ctx.measureText(typed).width;
      const startX = x - textWidth / 2;

      ctx.fillStyle = "#10b981"; // Green for typed
      ctx.textAlign = "left";
      ctx.fillText(typed, startX, y);

      ctx.fillStyle = "#94a3b8"; // Gray for untyped
      ctx.fillText(untyped, startX + typedWidth, y);
    } else {
      ctx.fillStyle = isActive ? "#f59e0b" : "#e2e8f0";
      ctx.fillText(wordText, x, y);
    }
  },

  // Render HUD overlays
  renderHUD(ctx, w, h) {
    // Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${this.score}`, 20, 30);

    // Hearts / Health
    let heartString = "";
    for (let i = 0; i < this.lives; i++) heartString += "❤️";
    ctx.textAlign = "right";
    ctx.fillText(heartString, w - 20, 30);

    // Current Buffers or distance indicators
    if (this.activeGame === "rocketRace" || this.activeGame === "carRacing") {
      ctx.textAlign = "center";
      ctx.font = "14px sans-serif";
      ctx.fillText(`YOU: ${Math.round(this.player.distance)}m  |  CPU: ${Math.round(this.opponent.distance)}m`, w / 2, 30);
    } else if (this.activeGame === "zombieEscape") {
      const distance = Math.round(this.player.x - this.opponent.x);
      ctx.textAlign = "center";
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = distance < 100 ? "#ef4444" : "#ffffff";
      ctx.fillText(`ZOMBIE DISTANCE: ${distance}m`, w / 2, 30);
    }
  },

  // Dynamic Spawners
  spawnFruit() {
    const word = this.getRandomWord();
    this.entities.push({
      x: 50 + Math.random() * (this.canvas.width - 100),
      y: 10,
      vy: 40 + Math.random() * 30 + (this.score / 1000) * 10,
      word,
      color: ["#ef4444", "#f59e0b", "#a855f7", "#ec4899"][Math.floor(Math.random() * 4)],
      toRemove: false
    });
  },

  spawnMeteor() {
    const word = this.getRandomWord();
    this.entities.push({
      x: 50 + Math.random() * (this.canvas.width - 100),
      y: 10,
      vy: 30 + Math.random() * 20 + (this.score / 1000) * 10,
      word,
      toRemove: false
    });
  },

  spawnWordTrack() {
    this.entities = [{
      word: this.getRandomWord(),
      toRemove: false
    }];
  },

  spawnEscapeWord() {
    const w = this.canvas.width;
    this.entities.push({
      x: w - 100,
      word: this.getRandomWord(),
      toRemove: false
    });
  },

  getRandomWord() {
    const index = Math.floor(Math.random() * GAME_VOCABULARY.length);
    return GAME_VOCABULARY[index];
  },

  // Particles Explosion
  explode(x, y, color) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 150,
        vy: (Math.random() - 0.5) * 150,
        size: Math.random() * 4 + 2,
        color,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1
      });
    }
  },

  updateParticles(dt) {
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  },

  // Keystroke matcher for games
  handleKeystroke(key) {
    if (!this.isRunning) return;
    
    // Ignore non-character keys
    if (key.length !== 1) return;
    const char = key.toLowerCase();

    this.totalKeysTyped++;

    // 1. Spawning / Matching logic
    if (!this.currentTarget) {
      // Find a word starting with this letter
      let match = null;
      if (this.activeGame === "rocketRace" || this.activeGame === "carRacing") {
        match = this.entities[0]; // strictly match the front word in races
      } else {
        // Find closest/lowest word matching the starting letter
        let lowestY = -1;
        this.entities.forEach((entity) => {
          if (entity.word[0] === char && !entity.toRemove) {
            if (entity.y === undefined || entity.y > lowestY) {
              match = entity;
              if (entity.y !== undefined) lowestY = entity.y;
            }
          }
        });
      }

      if (match) {
        this.currentTarget = match;
        this.typedBuffer = char;
        this.correctKeysTyped++;
        soundEngine.play("click");
        this.checkWordCompletion();
      } else {
        // Penalty for mistake
        this.mistakesCount++;
        soundEngine.play("error");
        this.triggerScreenShake();
      }
    } else {
      // Check if next letter matches
      const expectedChar = this.currentTarget.word[this.typedBuffer.length];
      if (char === expectedChar) {
        this.typedBuffer += char;
        this.correctKeysTyped++;
        soundEngine.play("click");
        this.checkWordCompletion();
      } else {
        // Wrong letter
        this.mistakesCount++;
        soundEngine.play("error");
        this.triggerScreenShake();
        // Reset matches
        this.currentTarget = null;
        this.typedBuffer = "";
      }
    }
  },

  checkWordCompletion() {
    if (this.typedBuffer === this.currentTarget.word) {
      const entity = this.currentTarget;
      entity.toRemove = true;
      this.currentTarget = null;
      this.typedBuffer = "";
      
      // Visual feedback and score based on game type
      if (this.activeGame === "fruitCatch") {
        this.explode(entity.x, entity.y, entity.color);
        this.score += 50;
        soundEngine.play("success");
      } else if (this.activeGame === "spaceShooter") {
        // Shoot laser bullet from bottom center to meteor coordinate
        const w = this.canvas.width;
        const h = this.canvas.height;
        const speed = 600;
        const dx = entity.x - w / 2;
        const dy = entity.y - (h - 45);
        const dist = Math.hypot(dx, dy);
        this.bullets.push({
          x: w / 2,
          y: h - 45,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          toRemove: false
        });
      } else if (this.activeGame === "rocketRace" || this.activeGame === "carRacing") {
        this.player.speed = Math.min(25, this.player.speed + 6); // push velocity forward!
        this.score += 100;
        soundEngine.play("success");
        // Spawn next race word
        this.spawnWordTrack();
      } else if (this.activeGame === "zombieEscape") {
        this.player.speed = Math.min(20, this.player.speed + 7);
        this.score += 100;
        soundEngine.play("success");
        this.explode(entity.x, this.player.y - 30, "#2dd4bf");
      }
    }
  },

  endGame(playerWon = false) {
    this.isRunning = false;
    let finalRewardXP = 0;
    let finalRewardCoins = 0;

    if (this.activeGame === "rocketRace" || this.activeGame === "carRacing") {
      if (playerWon) {
        finalRewardXP = 150;
        finalRewardCoins = 50;
        soundEngine.play("success");
      } else {
        finalRewardXP = 30;
        finalRewardCoins = 10;
      }
    } else {
      // Score based rewards
      finalRewardXP = Math.round(this.score / 5);
      finalRewardCoins = Math.round(this.score / 15);
    }

    // Award XP and Coins
    profileManager.addXP(finalRewardXP);
    profileManager.addCoins(finalRewardCoins);
    
    // Calculate stats
    const accuracy = this.totalKeysTyped > 0 
      ? Math.round((this.correctKeysTyped / this.totalKeysTyped) * 100)
      : 100;
    const elapsedSeconds = Math.max(1, Math.round(this.gameTime / 1000));
    const timeMinutes = elapsedSeconds / 60;
    const cpm = Math.round(this.correctKeysTyped / timeMinutes);
    const wpm = Math.round(cpm / 5);

    if (this.onGameOver) {
      this.onGameOver(this.score, finalRewardCoins, finalRewardXP, playerWon, accuracy, elapsedSeconds, wpm, cpm, this.mistakesCount);
    }
  },

  triggerScreenShake() {
    const container = document.getElementById("typingContainer") || document.body;
    container.classList.add("screen-shake-anim");
    setTimeout(() => {
      container.classList.remove("screen-shake-anim");
    }, 300);
  }
};
