const test = require('node:test');
const assert = require('node:assert/strict');
const { PrivacyShield } = require('../../src/main/privacy/shield');

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

test('PrivacyShield blocks known tracker and ad domains', () => {
  const store = new MockStore();
  const shield = new PrivacyShield(store);

  assert.equal(shield._isBlocked('google-analytics.com'), true);
  assert.equal(shield._isBlocked('sub.doubleclick.net'), true);
  assert.equal(shield._isBlocked('adservice.google.com'), false);
  assert.equal(shield._isBlocked('github.com'), false);
  assert.equal(shield._isBlocked('wikipedia.org'), false);
});

test('PrivacyShield manages blocked counters per origin', () => {
  const store = new MockStore();
  const shield = new PrivacyShield(store);

  assert.equal(shield.getBlockedCount('example.com'), 0);
  shield._incrementBlock('example.com');
  shield._incrementBlock('example.com');
  assert.equal(shield.getBlockedCount('example.com'), 2);
  assert.equal(shield.getBlockedCount('other.com'), 0);
});

test('PrivacyShield per-site whitelist toggle', () => {
  const store = new MockStore();
  const shield = new PrivacyShield(store);

  assert.equal(shield.isWhitelisted('news.com'), false);
  // Toggle off (whitelisted)
  const isEnabledAfterToggle = shield.toggleWhitelist('news.com');
  assert.equal(isEnabledAfterToggle, false);
  assert.equal(shield.isWhitelisted('news.com'), true);

  // Toggle on (un-whitelisted)
  const isEnabledSecondToggle = shield.toggleWhitelist('news.com');
  assert.equal(isEnabledSecondToggle, true);
  assert.equal(shield.isWhitelisted('news.com'), false);
});
