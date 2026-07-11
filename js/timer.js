export class Timer {
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.duration = 60;
    this.timeLeft = 60;
    this.elapsed = 0;
    this.timerId = null;
    this._isRunning = false;
    this._isPaused = false;
    this.startTime = null;
    this.accumulatedTime = 0;
  }

  start(duration) {
    this.stop();
    this.duration = duration;
    this.timeLeft = duration;
    this.elapsed = 0;
    this._isRunning = true;
    this._isPaused = false;
    this.startTime = Date.now();
    this.accumulatedTime = 0;

    this.onTick(this.timeLeft);
    this.tick();
  }

  tick() {
    if (!this._isRunning || this._isPaused) return;

    this.timerId = setTimeout(() => {
      const now = Date.now();
      const totalElapsedMs = now - this.startTime + this.accumulatedTime;
      const secondsElapsed = Math.floor(totalElapsedMs / 1000);
      
      this.elapsed = secondsElapsed;
      this.timeLeft = Math.max(0, this.duration - secondsElapsed);
      
      this.onTick(this.timeLeft);

      if (this.timeLeft <= 0) {
        this._isRunning = false;
        this.onComplete();
      } else {
        this.tick();
      }
    }, 100); // Poll more frequently than 1s to feel incredibly responsive and precise
  }

  pause() {
    if (!this._isRunning || this._isPaused) return;
    this._isPaused = true;
    clearTimeout(this.timerId);
    this.accumulatedTime += (Date.now() - this.startTime);
  }

  resume() {
    if (!this._isRunning || !this._isPaused) return;
    this._isPaused = false;
    this.startTime = Date.now();
    this.tick();
  }

  stop() {
    this._isRunning = false;
    this._isPaused = false;
    clearTimeout(this.timerId);
    this.timerId = null;
    this.timeLeft = 0;
    this.elapsed = 0;
  }

  isRunning() {
    return this._isRunning;
  }

  isPaused() {
    return this._isPaused;
  }

  getTimeElapsed() {
    if (!this._isRunning) return this.elapsed;
    if (this._isPaused) return Math.floor(this.accumulatedTime / 1000);
    const totalMs = (Date.now() - this.startTime) + this.accumulatedTime;
    return Math.floor(totalMs / 1000);
  }
}
