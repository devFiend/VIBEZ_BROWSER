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

test('WorkspaceManager tab pinning, reordering, duplicate, and reopen closed tab', () => {
  const store = new MockStore();
  const manager = new WorkspaceManager(store);

  const t1 = manager.createTab('https://a.com', true);
  const t2 = manager.createTab('https://b.com', true);

  // Pin t2
  const pinned = manager.togglePinTab(t2.id);
  assert.equal(pinned.isPinned, true);
  // Pinned tabs are placed at index 0
  const ws = manager.getActiveWorkspace();
  assert.equal(ws.tabs[0].id, t2.id);

  // Duplicate t1
  const dup = manager.duplicateTab(t1.id);
  assert.ok(dup);
  assert.equal(dup.url, 'https://a.com');

  // Reorder
  const initialFirst = ws.tabs[0].id;
  manager.reorderTabs(0, 1);
  assert.notEqual(ws.tabs[0].id, initialFirst);

  // Close and Reopen
  const toClose = manager.createTab('https://recoverable.org', true);
  manager.closeTab(toClose.id);
  const reopened = manager.reopenClosedTab();
  assert.ok(reopened);
  assert.equal(reopened.url, 'https://recoverable.org');
});
