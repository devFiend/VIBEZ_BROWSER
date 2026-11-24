const { test } = require('node:test');
const assert = require('node:assert/strict');
const { HistoryManager } = require('../../src/main/history/history_manager');

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

test('HistoryManager adds, searches, deletes, and clears navigation entries', () => {
  const store = new MockStore();
  const manager = new HistoryManager(store);

  // Add entries
  const e1 = manager.addEntry('https://google.com', 'Google');
  const e2 = manager.addEntry('https://github.com/devFiend', 'devFiend GitHub');
  assert.ok(e1);
  assert.ok(e2);
  assert.equal(manager.getEntries().length, 2);

  // Search
  const searchResults = manager.search('github');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].url, 'https://github.com/devFiend');

  // Delete
  const deleted = manager.deleteEntry(e1.id);
  assert.equal(deleted, true);
  assert.equal(manager.getEntries().length, 1);

  // Clear
  manager.clear();
  assert.equal(manager.getEntries().length, 0);

  // Internal URLs ignored
  const internal = manager.addEntry('vibez://newtab', 'New Tab');
  assert.equal(internal, null);
});
