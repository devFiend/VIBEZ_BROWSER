const test = require('node:test');
const assert = require('node:assert/strict');
const { RuleEngine } = require('../../src/main/automation/rule_engine');

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

test('RuleEngine evaluates navigation and routes to target workspace', () => {
  const store = new MockStore();
  const engine = new RuleEngine(store);

  // Default rule: github.com -> ws_dev
  const match = engine.evaluateNavigation('https://github.com/facebook/react', 'tab_1', 'ws_work');
  assert.notEqual(match, null);
  assert.equal(match.type, 'route_workspace');
  assert.equal(match.targetWorkspaceId, 'ws_dev');

  // If already in ws_dev, does not trigger redundant route
  const noMatchSameWs = engine.evaluateNavigation('https://github.com/facebook/react', 'tab_1', 'ws_dev');
  assert.equal(noMatchSameWs, null);

  // Unmatched domain
  const noMatch = engine.evaluateNavigation('https://example.com', 'tab_1', 'ws_work');
  assert.equal(noMatch, null);
});

test('RuleEngine rule creation, toggle, and deletion', () => {
  const store = new MockStore();
  const engine = new RuleEngine(store);

  const initialCount = engine.getRules().length;
  const newRule = engine.addRule('Figma to Design', 'figma.com', 'ws_design');
  assert.equal(engine.getRules().length, initialCount + 1);

  // Toggle rule off
  const isEnabled = engine.toggleRule(newRule.id);
  assert.equal(isEnabled, false);

  // Delete rule
  const deleted = engine.deleteRule(newRule.id);
  assert.equal(deleted, true);
  assert.equal(engine.getRules().length, initialCount);
});
