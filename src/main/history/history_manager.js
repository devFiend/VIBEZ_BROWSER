/**
 * History Manager for Vibez Browser.
 * Tracks visited URLs locally with search, deletion, and privacy clearing.
 */

const crypto = require('crypto');

class HistoryManager {
  constructor(store) {
    this.store = store;
    this.history = this.store.get('history', []);
  }

  addEntry(url, title = '') {
    if (!url || url.startsWith('vibez://') || url.startsWith('about:') || url.startsWith('file://')) {
      return null;
    }

    const cleanTitle = title || url;
    const now = new Date().toISOString();

    // Check if URL was visited recently (update timestamp instead of duplicate spam)
    const existingIndex = this.history.findIndex(item => item.url === url);
    if (existingIndex !== -1) {
      this.history[existingIndex].title = cleanTitle || this.history[existingIndex].title;
      this.history[existingIndex].timestamp = now;
      this.history[existingIndex].visitCount = (this.history[existingIndex].visitCount || 1) + 1;
      const [updated] = this.history.splice(existingIndex, 1);
      this.history.unshift(updated);
      this._persist();
      return updated;
    }

    const entry = {
      id: crypto.randomUUID(),
      url,
      title: cleanTitle,
      timestamp: now,
      visitCount: 1
    };

    this.history.unshift(entry);
    // Keep max 2000 entries
    if (this.history.length > 2000) {
      this.history = this.history.slice(0, 2000);
    }

    this._persist();
    return entry;
  }

  getEntries(limit = 100) {
    return this.history.slice(0, limit);
  }

  search(query = '') {
    const q = (query || '').toLowerCase().trim();
    if (!q) return this.getEntries();

    return this.history.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.url && item.url.toLowerCase().includes(q))
    );
  }

  deleteEntry(id) {
    const prevLen = this.history.length;
    this.history = this.history.filter(item => item.id !== id);
    if (this.history.length !== prevLen) {
      this._persist();
      return true;
    }
    return false;
  }

  clear() {
    this.history = [];
    this._persist();
    return true;
  }

  _persist() {
    this.store.set('history', this.history);
  }
}

module.exports = { HistoryManager };
