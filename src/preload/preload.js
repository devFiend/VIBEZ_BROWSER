/**
 * Preload script for Vibez Browser Shell UI.
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

  // Command Center
  openDevTools: () => ipcRenderer.send('open-devtools'),
  searchAll: (query) => ipcRenderer.invoke('search-all', { query }),

  // Events from Main process
  onStateUpdate: (callback) => {
    ipcRenderer.on('state-update', (_event, state) => callback(state));
  },
  onShieldUpdate: (callback) => {
    ipcRenderer.on('shield-update', (_event, data) => callback(data));
  }
});
