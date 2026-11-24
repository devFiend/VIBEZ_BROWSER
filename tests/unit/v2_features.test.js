const test = require('node:test');
const assert = require('node:assert/strict');
const { LibraryManager } = require('../../src/main/library/library_manager');
const { FocusSessionManager } = require('../../src/main/focus/focus_session');

class MockStore {
  constructor() {
    this.data = {};
  }
  get(key, def) {
    return this.data[key] || def;
  }
  set(key, val) {
    this.data[key] = val;
  }
}

test('LibraryManager saves, searches, and deletes research excerpts', () => {
  const store = new MockStore();
  const lib = new LibraryManager(store);

  const item = lib.saveItem({
    title: 'Quantum Computing Overview',
    url: 'https://nature.com/articles/qc',
    excerpt: 'Qubits exploit superposition and entanglement.',
    notes: 'Key reference for physics seminar',
    tags: ['physics', 'quantum']
  });

  assert.equal(item.title, 'Quantum Computing Overview');

  // Search by tag
  const searchByTag = lib.search('quantum');
  assert.equal(searchByTag.length >= 1, true);

  // Search by text in excerpt
  const searchByText = lib.search('superposition');
  assert.equal(searchByText.length >= 1, true);

  // Delete
  const deleted = lib.deleteItem(item.id);
  assert.equal(deleted, true);
});

test('FocusSessionManager enforces distraction blocking and session state', () => {
  const store = new MockStore();
  const focus = new FocusSessionManager(store);

  assert.equal(focus.isActive, false);
  assert.equal(focus.isDistraction('https://twitter.com/home'), false); // Not active yet

  // Start 25 minute focus session
  const status = focus.startSession(25);
  assert.equal(status.isActive, true);
  assert.equal(status.remainingSeconds, 25 * 60);

  // Distraction blocking active
  assert.equal(focus.isDistraction('https://twitter.com/home'), true);
  assert.equal(focus.isDistraction('https://reddit.com/r/programming'), true);
  assert.equal(focus.isDistraction('https://docs.github.com'), false);

  // Stop session
  const stoppedStatus = focus.stopSession();
  assert.equal(stoppedStatus.isActive, false);
  assert.equal(focus.isDistraction('https://twitter.com/home'), false);
});
