/**
 * Focus Sessions & Distraction Blocker for Vibez Browser V2.
 * Manages Pomodoro focus timers, intentional browsing sessions,
 * and distraction-free domain enforcement.
 */

class FocusSessionManager {
  constructor(store) {
    this.store = store;
    this.isActive = false;
    this.startTime = null;
    this.durationMinutes = 25;
    this.remainingSeconds = 0;
    this.timerInterval = null;
    this.distractionDomains = new Set([
      'twitter.com',
      'x.com',
      'reddit.com',
      'facebook.com',
      'instagram.com',
      'tiktok.com',
      'youtube.com',
      'twitch.tv'
    ]);

    this._load();
  }

  _load() {
    if (this.store) {
      const saved = this.store.get('focus_settings', {
        durationMinutes: 25,
        distractions: Array.from(this.distractionDomains)
      });
      this.durationMinutes = saved.durationMinutes || 25;
      if (Array.isArray(saved.distractions)) {
        this.distractionDomains = new Set(saved.distractions);
      }
    }
  }

  save() {
    if (this.store) {
      this.store.set('focus_settings', {
        durationMinutes: this.durationMinutes,
        distractions: Array.from(this.distractionDomains)
      });
    }
  }

  startSession(minutes = 25, onTick = null, onComplete = null) {
    this.stopSession();
    this.isActive = true;
    this.durationMinutes = minutes;
    this.remainingSeconds = minutes * 60;
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) {
        this.stopSession();
        if (onComplete) onComplete();
      } else {
        if (onTick) onTick(this.getStatus());
      }
    }, 1000);

    return this.getStatus();
  }

  stopSession() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isActive = false;
    this.remainingSeconds = 0;
    return this.getStatus();
  }

  getStatus() {
    return {
      isActive: this.isActive,
      durationMinutes: this.durationMinutes,
      remainingSeconds: this.remainingSeconds,
      formattedTime: this._formatTime(this.remainingSeconds)
    };
  }

  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  isDistraction(url) {
    if (!this.isActive || !url) return false;
    try {
      const host = new URL(url).hostname.toLowerCase();
      for (const d of this.distractionDomains) {
        if (host === d || host.endsWith('.' + d)) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  toggleDistractionDomain(domain) {
    const clean = domain.toLowerCase().trim();
    if (this.distractionDomains.has(clean)) {
      this.distractionDomains.delete(clean);
    } else {
      this.distractionDomains.add(clean);
    }
    this.save();
    return Array.from(this.distractionDomains);
  }
}

module.exports = { FocusSessionManager };
