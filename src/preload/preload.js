/**
 * Preload script for Vibez Browser Shell UI (V2 Daily Driver).
 * Exposes a strictly isolated, secure bridge between the browser chrome and the main process.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vibezApi', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // Navigation
  navigate: (url, isSplit = false) => ipcRenderer.send('nav-navigate', { url, isSplit }),
  goBack: (isSplit = false) => ipcRenderer.send('nav-back', { isSplit }),
  goForward: (isSplit = false) => ipcRenderer.send('nav-forward', { isSplit }),
  reload: (isSplit = false) => ipcRenderer.send('nav-reload', { isSplit }),
  stop: (isSplit = false) => ipcRenderer.send('nav-stop', { isSplit }),

  // Tabs
  createTab: (url) => ipcRenderer.send('tab-create', { url }),
  closeTab: (tabId) => ipcRenderer.send('tab-close', { tabId }),
  switchTab: (tabId) => ipcRenderer.send('tab-switch', { tabId }),
  togglePinTab: (tabId) => ipcRenderer.send('tab-toggle-pin', { tabId }),
  duplicateTab: (tabId) => ipcRenderer.send('tab-duplicate', { tabId }),
  toggleMuteTab: (tabId) => ipcRenderer.send('tab-toggle-mute', { tabId }),
  reorderTabs: (fromIndex, toIndex) => ipcRenderer.send('tab-reorder', { fromIndex, toIndex }),
  reopenClosedTab: () => ipcRenderer.send('tab-reopen-closed'),
  closeOtherTabs: (tabId) => ipcRenderer.send('tab-close-others', { tabId }),
  closeTabsToRight: (tabId) => ipcRenderer.send('tab-close-to-right', { tabId }),
  showTabContextMenu: (tabId) => ipcRenderer.send('tab-context-menu', { tabId }),

  // Workspaces
  switchWorkspace: (workspaceId) => ipcRenderer.send('workspace-switch', { workspaceId }),
  createWorkspace: (name, icon, color) => ipcRenderer.send('workspace-create', { name, icon, color }),

  // Split View
  toggleSplitView: () => ipcRenderer.send('split-toggle'),
  swapSplitPanes: () => ipcRenderer.send('split-swap'),
  setSplitRatio: (ratio) => ipcRenderer.send('split-resize', { ratio }),

  // Find in Page (Ctrl+F)
  findInPage: (text, forward = true, findNext = false) => ipcRenderer.send('find-in-page', { text, forward, findNext }),
  stopFindInPage: (action = 'clearSelection') => ipcRenderer.send('stop-find-in-page', { action }),

  // Page Zoom Controls
  zoomIn: () => ipcRenderer.send('zoom-in'),
  zoomOut: () => ipcRenderer.send('zoom-out'),
  zoomReset: () => ipcRenderer.send('zoom-reset'),

  // Omnibox Live Suggestions
  getOmniboxSuggestions: (query) => ipcRenderer.invoke('omnibox-suggest', { query }),

  // Downloads helper actions
  openPath: (filePath) => ipcRenderer.send('open-path', { filePath }),
  showItemInFolder: (filePath) => ipcRenderer.send('show-item-in-folder', { filePath }),

  // Privacy Shield
  getShieldInfo: (domain) => ipcRenderer.invoke('shield-get-info', { domain }),
  toggleShield: (domain) => ipcRenderer.invoke('shield-toggle', { domain }),

  // Command Center & DevTools
  openDevTools: () => ipcRenderer.send('open-devtools'),
  searchAll: (query) => ipcRenderer.invoke('search-all', { query }),

  // V2 Feature: AI Research Assistant
  aiSummarizeActivePage: () => ipcRenderer.invoke('ai-summarize-active-page'),
  aiAskQuestion: (question) => ipcRenderer.invoke('ai-ask-question', { question }),
  aiCompareWorkspaceTabs: () => ipcRenderer.invoke('ai-compare-workspace-tabs'),

  // V2 Feature: Automations Engine
  getAutomationRules: () => ipcRenderer.invoke('rules-get'),
  addAutomationRule: (name, pattern, targetWorkspaceId) => ipcRenderer.invoke('rules-add', { name, pattern, targetWorkspaceId }),
  toggleAutomationRule: (ruleId) => ipcRenderer.invoke('rules-toggle', { ruleId }),
  deleteAutomationRule: (ruleId) => ipcRenderer.invoke('rules-delete', { ruleId }),

  // V2 Feature: Smart Library 2.0
  getLibraryItems: (collectionId) => ipcRenderer.invoke('library-get-items', { collectionId }),
  saveLibraryItem: (item) => ipcRenderer.invoke('library-save-item', item),
  deleteLibraryItem: (itemId) => ipcRenderer.invoke('library-delete-item', { itemId }),
  searchLibrary: (query) => ipcRenderer.invoke('library-search', { query }),

  // V2 Feature: Focus Sessions
  startFocusSession: (minutes) => ipcRenderer.invoke('focus-start', { minutes }),
  stopFocusSession: () => ipcRenderer.invoke('focus-stop'),
  getFocusStatus: () => ipcRenderer.invoke('focus-get-status'),

  // History Manager
  getHistory: (limit) => ipcRenderer.invoke('history-get', { limit }),
  searchHistory: (query) => ipcRenderer.invoke('history-search', { query }),
  deleteHistoryEntry: (id) => ipcRenderer.invoke('history-delete', { id }),
  clearHistory: () => ipcRenderer.invoke('history-clear'),

  // Settings Manager
  getSettings: () => ipcRenderer.invoke('settings-get'),
  updateSettings: (newSettings) => ipcRenderer.invoke('settings-update', newSettings),

  // Events from Main process
  onStateUpdate: (callback) => {
    ipcRenderer.on('state-update', (_event, state) => callback(state));
  },
  onShieldUpdate: (callback) => {
    ipcRenderer.on('shield-update', (_event, data) => callback(data));
  },
  onFocusUpdate: (callback) => {
    ipcRenderer.on('focus-update', (_event, status) => callback(status));
  },
  onAutomationTriggered: (callback) => {
    ipcRenderer.on('automation-triggered', (_event, msg) => callback(msg));
  },
  onFoundInPageResult: (callback) => {
    ipcRenderer.on('found-in-page-result', (_event, res) => callback(res));
  },
  onZoomChanged: (callback) => {
    ipcRenderer.on('zoom-changed', (_event, data) => callback(data));
  },
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (_event, data) => callback(data));
  },
  onDownloadComplete: (callback) => {
    ipcRenderer.on('download-complete', (_event, data) => callback(data));
  }
});
