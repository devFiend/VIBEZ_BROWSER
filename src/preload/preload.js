/**
 * Preload script for Vibez Browser Shell UI (V2).
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

  // Workspaces
  switchWorkspace: (workspaceId) => ipcRenderer.send('workspace-switch', { workspaceId }),
  createWorkspace: (name, icon, color) => ipcRenderer.send('workspace-create', { name, icon, color }),

  // Split View
  toggleSplitView: () => ipcRenderer.send('split-toggle'),
  swapSplitPanes: () => ipcRenderer.send('split-swap'),
  setSplitRatio: (ratio) => ipcRenderer.send('split-resize', { ratio }),

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
  }
});
