/* ═══════════════════════════════════════════════
   SoundManager — Web Audio API Sound System
   ═══════════════════════════════════════════════ */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.enabled = true;
    this.volume = 0.15;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('SoundManager: Web Audio API not available');
    }
  }

  setEnabled(val) {
    this.enabled = val;
  }

  _createOscillator(freq, type = 'sine', duration = 0.1, vol = this.volume) {
    if (!this.initialized || !this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  _playNoise(duration = 0.08, vol = 0.03) {
    if (!this.initialized || !this.enabled || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * vol;
    }
    const noise = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    noise.buffer = buffer;
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    noise.start();
  }

  boot() {
    this._createOscillator(200, 'sawtooth', 0.3, 0.06);
    setTimeout(() => this._createOscillator(400, 'sine', 0.2, 0.08), 150);
    setTimeout(() => this._createOscillator(800, 'sine', 0.4, 0.06), 300);
    setTimeout(() => this._playNoise(0.15, 0.04), 100);
  }

  hover() {
    this._createOscillator(1200, 'sine', 0.04, 0.03);
  }

  click() {
    this._createOscillator(600, 'square', 0.06, 0.05);
    setTimeout(() => this._createOscillator(900, 'sine', 0.05, 0.04), 30);
  }

  confirm() {
    this._createOscillator(523, 'sine', 0.12, 0.07);
    setTimeout(() => this._createOscillator(659, 'sine', 0.12, 0.07), 80);
    setTimeout(() => this._createOscillator(784, 'sine', 0.2, 0.06), 160);
  }

  panelOpen() {
    this._createOscillator(300, 'triangle', 0.15, 0.06);
    setTimeout(() => this._createOscillator(500, 'sine', 0.1, 0.05), 60);
    this._playNoise(0.06, 0.02);
  }

  panelClose() {
    this._createOscillator(500, 'triangle', 0.1, 0.04);
    setTimeout(() => this._createOscillator(300, 'sine', 0.15, 0.03), 50);
  }

  hologram() {
    this._createOscillator(800, 'sine', 0.3, 0.05);
    this._createOscillator(803, 'sine', 0.3, 0.05);
    setTimeout(() => this._playNoise(0.1, 0.02), 100);
  }

  error() {
    this._createOscillator(200, 'sawtooth', 0.15, 0.06);
    setTimeout(() => this._createOscillator(150, 'sawtooth', 0.2, 0.05), 100);
  }

  keystroke() {
    this._createOscillator(800 + Math.random() * 400, 'square', 0.02, 0.02);
  }
}

const soundManager = new SoundManager();
export default soundManager;
