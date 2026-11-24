/**
 * Settings Manager for Vibez Browser.
 * Manages user preferences: default search engine, privacy shields, theme, focus duration.
 */

const DEFAULT_SETTINGS = {
  defaultSearch: 'google', // 'google' | 'duckduckgo'
  privacyPreset: 'balanced', // 'balanced' | 'strict'
  blockTrackers: true,
  blockFingerprinting: true,
  blockCryptoMiners: true,
  focusDuration: 25,
  theme: 'dark'
};

class SettingsManager {
  constructor(store) {
    this.store = store;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, this.store.get('settings', {}));
  }

  getSettings() {
    return Object.assign({}, this.settings);
  }

  updateSettings(newSettings) {
    this.settings = Object.assign({}, this.settings, newSettings);
    this.store.set('settings', this.settings);
    return this.settings;
  }

  getSearchUrl(query) {
    const encoded = encodeURIComponent(query || '');
    if (this.settings.defaultSearch === 'duckduckgo') {
      return `https://duckduckgo.com/?q=${encoded}`;
    }
    return `https://www.google.com/search?q=${encoded}`;
  }
}

module.exports = { SettingsManager, DEFAULT_SETTINGS };
