const test = require('node:test');
const assert = require('node:assert/strict');
const { WorkspaceManager } = require('../../src/main/workspaces/workspace_manager');

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

test('WorkspaceManager initializes default workspaces', () => {
  const store = new MockStore();
  const manager = new WorkspaceManager(store);

  assert.equal(manager.workspaces.length >= 4, true);
  const activeWs = manager.getActiveWorkspace();
  assert.equal(activeWs.name, 'Work');
  assert.equal(activeWs.tabs.length >= 1, true);
});

test('WorkspaceManager tab lifecycle (create, switch, close)', () => {
  const store = new MockStore();
  const manager = new WorkspaceManager(store);

  const newTab = manager.createTab('https://example.org', true);
  assert.equal(newTab.url, 'https://example.org');

  const activeTab = manager.getActiveTab();
  assert.equal(activeTab.id, newTab.id);

  // Close tab
  manager.closeTab(newTab.id);
  const currentTab = manager.getActiveTab();
  assert.notEqual(currentTab.id, newTab.id);
});

test('WorkspaceManager split view toggle and pane swapping', () => {
  const store = new MockStore();
  const manager = new WorkspaceManager(store);

  const ws = manager.getActiveWorkspace();
  assert.equal(ws.splitTabId, null);

  // Toggle split view on
  const splitId = manager.toggleSplitView();
  assert.notEqual(splitId, null);
  assert.equal(manager.getSplitTab().id, splitId);

  // Swap panes
  const activeBefore = manager.getActiveTab().id;
  manager.swapSplitPanes();
  assert.equal(manager.getSplitTab().id, activeBefore);

  // Toggle split view off
  manager.toggleSplitView();
  assert.equal(manager.getActiveWorkspace().splitTabId, null);
});
