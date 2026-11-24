const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SettingsManager } = require('../../src/main/settings/settings_manager');

class MockStore {
  constructor() {
    this.data = {};
  }
  get(key, def) {
    return this.data[key] !== undefined ? this.data[key] : def;
  }
  set(key, val) {
    this.data[key] = val;
  }
}

test('SettingsManager retrieves, updates, and formats search URLs', () => {
  const store = new MockStore();
  const manager = new SettingsManager(store);

  assert.equal(manager.getSettings().defaultSearch, 'google');
  assert.equal(manager.getSearchUrl('vibez'), 'https://www.google.com/search?q=vibez');

  manager.updateSettings({ defaultSearch: 'duckduckgo' });
  assert.equal(manager.getSettings().defaultSearch, 'duckduckgo');
  assert.equal(manager.getSearchUrl('vibez'), 'https://duckduckgo.com/?q=vibez');
});
