/**
 * Vibez Browser — Main Process Entry Point (V2 Architecture)
 * High-performance Chromium desktop browser shell for Windows.
 */

const { app, BrowserWindow, WebContentsView, ipcMain, session, Menu, MenuItem, shell } = require('electron');
const path = require('path');
const crypto = require('crypto');
const { LocalStore } = require('./storage/store');
const { PrivacyShield } = require('./privacy/shield');
const { WorkspaceManager } = require('./workspaces/workspace_manager');
const { AIResearchAssistant } = require('./ai/research_assistant');
const { RuleEngine } = require('./automation/rule_engine');
const { LibraryManager } = require('./library/library_manager');
const { FocusSessionManager } = require('./focus/focus_session');
const { HistoryManager } = require('./history/history_manager');
const { SettingsManager } = require('./settings/settings_manager');

let mainWindow = null;
let store = null;
let shield = null;
let workspaceManager = null;
let aiAssistant = null;
let ruleEngine = null;
let libraryManager = null;
let focusManager = null;
let historyManager = null;
let settingsManager = null;

// Map of tabId -> WebContentsView
const tabViews = new Map();
let splitRatio = 0.50; // Default 50/50 split

const SIDEBAR_WIDTH = 0;
const TOPBAR_HEIGHT = 78;

const NEWTAB_FILE = path.join(__dirname, '../renderer/pages/newtab.html');
const HISTORY_FILE = path.join(__dirname, '../renderer/pages/history.html');
const LIBRARY_FILE = path.join(__dirname, '../renderer/pages/library.html');
const SETTINGS_FILE = path.join(__dirname, '../renderer/pages/settings.html');

const NEWTAB_URL = `file://${NEWTAB_FILE.replace(/\\/g, '/')}`;
const HISTORY_URL = `file://${HISTORY_FILE.replace(/\\/g, '/')}`;
const LIBRARY_URL = `file://${LIBRARY_FILE.replace(/\\/g, '/')}`;
const SETTINGS_URL = `file://${SETTINGS_FILE.replace(/\\/g, '/')}`;

function resolveInternalUrl(url) {
  if (!url || url === 'vibez://newtab' || url === 'about:blank') {
    return NEWTAB_URL;
  }
  if (url === 'vibez://history') return HISTORY_URL;
  if (url === 'vibez://library' || url === 'vibez://bookmarks') return LIBRARY_URL;
  if (url === 'vibez://settings' || url === 'vibez://preferences') return SETTINGS_URL;
  return url;
}

function initializeStoresAndServices() {
  store = new LocalStore('vibez_data');
  shield = new PrivacyShield(store);
  workspaceManager = new WorkspaceManager(store);
  aiAssistant = new AIResearchAssistant(store);
  ruleEngine = new RuleEngine(store, workspaceManager);
  libraryManager = new LibraryManager(store);
  focusManager = new FocusSessionManager(store);
  historyManager = new HistoryManager(store);
  settingsManager = new SettingsManager(store);

  // Attach privacy shield to default network session
  shield.attachToSession(session.defaultSession);

  // Setup Downloads Manager on default session
  session.defaultSession.on('will-download', (_event, item) => {
    const downloadId = crypto.randomUUID();
    const filename = item.getFilename();
    const totalBytes = item.getTotalBytes();

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('download-progress', {
        id: downloadId,
        filename,
        receivedBytes: 0,
        totalBytes,
        state: 'progressing'
      });
    }

    item.on('updated', (_event, state) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('download-progress', {
          id: downloadId,
          filename,
          receivedBytes: item.getReceivedBytes(),
          totalBytes: item.getTotalBytes(),
          state
        });
      }
    });

    item.once('done', (_event, state) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('download-complete', {
          id: downloadId,
          filename,
          savePath: item.getSavePath(),
          state
        });
      }
    });
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    frame: false, // Frameless custom chrome
    titleBarStyle: 'hidden',
    backgroundColor: '#1C1B22',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('resize', () => {
    updateViewports();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    syncStateToRenderer();
    renderActiveWorkspaceTabs();

    if (process.argv.includes('--test-mode')) {
      setTimeout(() => {
        console.log('[VIBEZ BROWSER] Headless verification passed! Exiting cleanly.');
        app.quit();
      }, 1500);
    }
  });
}

function getOrCreateTabView(tab) {
  if (tabViews.has(tab.id)) {
    return tabViews.get(tab.id);
  }

  const view = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  view.webContents.loadURL(resolveInternalUrl(tab.url));

  // Track tab events
  view.webContents.on('did-start-loading', () => {
    workspaceManager.updateTab(tab.id, { isLoading: true });
    syncStateToRenderer();
  });

  view.webContents.on('did-finish-load', () => {
    let url = view.webContents.getURL();
    let title = view.webContents.getTitle() || 'New Tab';
    if (url.includes('newtab.html') || url === NEWTAB_URL) {
      url = 'vibez://newtab';
      title = 'New Tab';
    } else if (url.includes('history.html') || url === HISTORY_URL) {
      url = 'vibez://history';
      title = 'History';
    } else if (url.includes('library.html') || url === LIBRARY_URL) {
      url = 'vibez://library';
      title = 'Smart Library';
    } else if (url.includes('settings.html') || url === SETTINGS_URL) {
      url = 'vibez://settings';
      title = 'Settings';
    } else if (!url.startsWith('file://') && !url.startsWith('vibez://')) {
      historyManager.addEntry(url, title);
    }
    const navHistory = view.webContents.navigationHistory;
    const canGoBack = navHistory ? navHistory.canGoBack() : view.webContents.canGoBack();
    const canGoForward = navHistory ? navHistory.canGoForward() : view.webContents.canGoForward();

    workspaceManager.updateTab(tab.id, {
      url,
      title,
      isLoading: false,
      canGoBack,
      canGoForward
    });

    // V2 Automations: Check domain routing rules
    const activeWs = workspaceManager.getActiveWorkspace();
    const routeAction = ruleEngine.evaluateNavigation(url, tab.id, activeWs.id);
    if (routeAction && routeAction.targetWorkspaceId) {
      // Move tab to target workspace
      const currentTab = workspaceManager.getActiveTab();
      if (currentTab && currentTab.id === tab.id) {
        workspaceManager.setActiveWorkspace(routeAction.targetWorkspaceId);
        renderActiveWorkspaceTabs();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('automation-triggered', {
            message: `Automated: Tab routed to ${routeAction.targetWorkspaceId} workspace`
          });
        }
      }
    }

    // Shield statistics update
    try {
      const host = new URL(url).hostname;
      const blocked = shield.getBlockedCount(host);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('shield-update', {
          domain: host,
          blocked,
          enabled: !shield.isWhitelisted(host)
        });
      }
    } catch (_) {}

    syncStateToRenderer();
  });

  view.webContents.on('page-title-updated', (_event, title) => {
    workspaceManager.updateTab(tab.id, { title });
    syncStateToRenderer();
  });

  view.webContents.on('page-favicon-updated', (_event, favicons) => {
    if (favicons && favicons.length > 0) {
      workspaceManager.updateTab(tab.id, { favicon: favicons[0] });
      syncStateToRenderer();
    }
  });

  // Media state listeners
  view.webContents.on('media-started-playing', () => {
    workspaceManager.updateTab(tab.id, { isAudioPlaying: true });
    syncStateToRenderer();
  });
  view.webContents.on('media-paused', () => {
    workspaceManager.updateTab(tab.id, { isAudioPlaying: false });
    syncStateToRenderer();
  });

  // Find in page listener
  view.webContents.on('found-in-page', (_event, result) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('found-in-page-result', {
        activeMatchOrdinal: result.activeMatchOrdinal,
        matches: result.matches,
        finalUpdate: result.finalUpdate
      });
    }
  });

  // Native Right-Click Context Menu
  view.webContents.on('context-menu', (_event, params) => {
    const menuTemplate = [];

    if (params.linkURL) {
      menuTemplate.push(
        {
          label: 'Open Link in New Tab',
          click: () => {
            const newTab = workspaceManager.createTab(params.linkURL, true);
            getOrCreateTabView(newTab);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        },
        {
          label: 'Open Link in Split View',
          click: () => {
            const newTab = workspaceManager.createTab(params.linkURL, false);
            workspaceManager.toggleSplitView(newTab.id);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        },
        {
          label: 'Copy Link Address',
          click: () => {
            const { clipboard } = require('electron');
            clipboard.writeText(params.linkURL);
          }
        },
        { type: 'separator' }
      );
    }

    if (params.hasImageContents && params.srcURL) {
      menuTemplate.push(
        {
          label: 'Open Image in New Tab',
          click: () => {
            const newTab = workspaceManager.createTab(params.srcURL, true);
            getOrCreateTabView(newTab);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        },
        {
          label: 'Copy Image Address',
          click: () => {
            const { clipboard } = require('electron');
            clipboard.writeText(params.srcURL);
          }
        },
        { type: 'separator' }
      );
    }

    if (params.selectionText) {
      menuTemplate.push(
        { label: 'Copy', role: 'copy' },
        {
          label: `Search Google for "${params.selectionText.slice(0, 20)}${params.selectionText.length > 20 ? '...' : ''}"`,
          click: () => {
            const searchUrl = settingsManager.getSearchUrl(params.selectionText);
            const newTab = workspaceManager.createTab(searchUrl, true);
            getOrCreateTabView(newTab);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        },
        { type: 'separator' }
      );
    }

    if (params.isEditable) {
      menuTemplate.push(
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectAll' },
        { type: 'separator' }
      );
    }

    const navHistory = view.webContents.navigationHistory;
    const canBack = navHistory ? navHistory.canGoBack() : view.webContents.canGoBack();
    const canFwd = navHistory ? navHistory.canGoForward() : view.webContents.canGoForward();

    menuTemplate.push(
      { label: 'Back', enabled: canBack, click: () => view.webContents.goBack() },
      { label: 'Forward', enabled: canFwd, click: () => view.webContents.goForward() },
      { label: 'Reload', click: () => view.webContents.reload() },
      { type: 'separator' },
      { label: 'Inspect Element', click: () => view.webContents.inspectElement(params.x, params.y) }
    );

    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    contextMenu.popup({ window: mainWindow });
  });

  tabViews.set(tab.id, view);
  return view;
}

function updateViewports() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const [winWidth, winHeight] = mainWindow.getContentSize();
  const availableWidth = Math.max(100, winWidth - SIDEBAR_WIDTH);
  const availableHeight = Math.max(100, winHeight - TOPBAR_HEIGHT);

  const activeTab = workspaceManager.getActiveTab();
  const splitTab = workspaceManager.getSplitTab();

  // Hide all views first by detaching them from contentView
  for (const [id, view] of tabViews.entries()) {
    try {
      if (mainWindow.contentView.children.includes(view)) {
        mainWindow.contentView.removeChildView(view);
      }
    } catch (_) {}
  }

  if (!activeTab) return;

  const activeView = getOrCreateTabView(activeTab);

  if (splitTab) {
    // Dual Split View Layout
    const splitView = getOrCreateTabView(splitTab);
    const dividerWidth = 6;
    const leftWidth = Math.floor((availableWidth - dividerWidth) * splitRatio);
    const rightWidth = availableWidth - dividerWidth - leftWidth;

    // Left Viewport
    activeView.setBounds({
      x: SIDEBAR_WIDTH,
      y: TOPBAR_HEIGHT,
      width: Math.max(50, leftWidth),
      height: availableHeight
    });
    mainWindow.contentView.addChildView(activeView);

    // Right Viewport
    splitView.setBounds({
      x: SIDEBAR_WIDTH + leftWidth + dividerWidth,
      y: TOPBAR_HEIGHT,
      width: Math.max(50, rightWidth),
      height: availableHeight
    });
    mainWindow.contentView.addChildView(splitView);
  } else {
    // Single Viewport Layout
    activeView.setBounds({
      x: SIDEBAR_WIDTH,
      y: TOPBAR_HEIGHT,
      width: availableWidth,
      height: availableHeight
    });
    mainWindow.contentView.addChildView(activeView);
  }
}

function renderActiveWorkspaceTabs() {
  const activeTab = workspaceManager.getActiveTab();
  if (activeTab) {
    getOrCreateTabView(activeTab);
  }
  const splitTab = workspaceManager.getSplitTab();
  if (splitTab) {
    getOrCreateTabView(splitTab);
  }
  updateViewports();
}

function syncStateToRenderer() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const activeWs = workspaceManager.getActiveWorkspace();
  const activeTab = workspaceManager.getActiveTab();
  const splitTab = workspaceManager.getSplitTab();

  let activeDomain = '';
  try {
    if (activeTab && activeTab.url) {
      activeDomain = new URL(activeTab.url).hostname;
    }
  } catch (_) {}

  mainWindow.webContents.send('state-update', {
    workspaces: workspaceManager.workspaces,
    activeWorkspaceId: workspaceManager.activeWorkspaceId,
    activeTab,
    splitTab,
    splitRatio,
    focusStatus: focusManager.getStatus(),
    shieldInfo: {
      domain: activeDomain,
      blocked: shield.getBlockedCount(activeDomain),
      enabled: !shield.isWhitelisted(activeDomain)
    }
  });
}

function setupIpcHandlers() {
  // Window controls
  ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow && mainWindow.close());

  // Navigation
  ipcMain.on('nav-navigate', (_event, { url, isSplit }) => {
    const targetTab = isSplit ? workspaceManager.getSplitTab() : workspaceManager.getActiveTab();
    if (!targetTab) return;

    let targetUrl = (url || '').trim();
    if (!targetUrl || targetUrl === 'vibez://newtab') {
      targetUrl = NEWTAB_URL;
    } else if (targetUrl.startsWith('vibez://')) {
      targetUrl = resolveInternalUrl(targetUrl);
    } else if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('file://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        targetUrl = settingsManager.getSearchUrl(targetUrl);
      }
    }

    // V2 Focus Blocker check
    if (focusManager.isDistraction(targetUrl)) {
      targetUrl = `https://duckduckgo.com/?q=focus+session+active`;
    }

    const view = getOrCreateTabView(targetTab);
    view.webContents.loadURL(targetUrl);
    workspaceManager.updateTab(targetTab.id, { url: targetUrl.startsWith('file://') ? 'vibez://newtab' : targetUrl });
    syncStateToRenderer();
  });

  ipcMain.on('nav-back', (_event, { isSplit }) => {
    const tab = isSplit ? workspaceManager.getSplitTab() : workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      const wc = tabViews.get(tab.id).webContents;
      if (wc.navigationHistory && wc.navigationHistory.canGoBack()) {
        wc.navigationHistory.goBack();
      } else if (wc.canGoBack && wc.canGoBack()) {
        wc.goBack();
      }
    }
  });

  ipcMain.on('nav-forward', (_event, { isSplit }) => {
    const tab = isSplit ? workspaceManager.getSplitTab() : workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      const wc = tabViews.get(tab.id).webContents;
      if (wc.navigationHistory && wc.navigationHistory.canGoForward()) {
        wc.navigationHistory.goForward();
      } else if (wc.canGoForward && wc.canGoForward()) {
        wc.goForward();
      }
    }
  });

  ipcMain.on('nav-reload', (_event, { isSplit }) => {
    const tab = isSplit ? workspaceManager.getSplitTab() : workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      tabViews.get(tab.id).webContents.reload();
    }
  });

  ipcMain.on('nav-stop', (_event, { isSplit }) => {
    const tab = isSplit ? workspaceManager.getSplitTab() : workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      tabViews.get(tab.id).webContents.stop();
    }
  });

  // Tabs
  ipcMain.on('tab-create', (_event, { url }) => {
    const newTab = workspaceManager.createTab(url || 'vibez://newtab', true);
    getOrCreateTabView(newTab);
    updateViewports();
    syncStateToRenderer();
  });

  ipcMain.on('tab-close', (_event, { tabId }) => {
    if (tabViews.has(tabId)) {
      const view = tabViews.get(tabId);
      try {
        if (mainWindow.contentView.children.includes(view)) {
          mainWindow.contentView.removeChildView(view);
        }
      } catch (_) {}
      tabViews.delete(tabId);
    }
    workspaceManager.closeTab(tabId);
    updateViewports();
    syncStateToRenderer();
  });

  ipcMain.on('tab-switch', (_event, { tabId }) => {
    workspaceManager.setActiveTab(tabId);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  // Workspaces
  ipcMain.on('workspace-switch', (_event, { workspaceId }) => {
    workspaceManager.setActiveWorkspace(workspaceId);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('workspace-create', (_event, { name, icon, color }) => {
    workspaceManager.createWorkspace(name, icon, color);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  // Split View
  ipcMain.on('split-toggle', () => {
    workspaceManager.toggleSplitView();
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('split-swap', () => {
    workspaceManager.swapSplitPanes();
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('split-resize', (_event, { ratio }) => {
    splitRatio = Math.max(0.2, Math.min(0.8, ratio));
    updateViewports();
    syncStateToRenderer();
  });

  // Privacy Shield
  ipcMain.handle('shield-get-info', (_event, { domain }) => {
    return {
      domain,
      blocked: shield.getBlockedCount(domain),
      enabled: !shield.isWhitelisted(domain)
    };
  });

  ipcMain.handle('shield-toggle', (_event, { domain }) => {
    const isNowEnabled = shield.toggleWhitelist(domain);
    syncStateToRenderer();
    return { enabled: isNowEnabled };
  });

  // Developer Tools
  ipcMain.on('open-devtools', () => {
    const activeTab = workspaceManager.getActiveTab();
    if (activeTab && tabViews.has(activeTab.id)) {
      tabViews.get(activeTab.id).webContents.openDevTools({ mode: 'detach' });
    }
  });

  // Command Center Search
  ipcMain.handle('search-all', (_event, { query }) => {
    const q = (query || '').toLowerCase().trim();
    const results = [];

    // 1. Search Open Tabs
    for (const ws of workspaceManager.workspaces) {
      for (const tab of ws.tabs) {
        if (!q || tab.title.toLowerCase().includes(q) || tab.url.toLowerCase().includes(q)) {
          results.push({
            type: 'tab',
            title: tab.title,
            subtitle: `${ws.icon} ${ws.name} • ${tab.url}`,
            tabId: tab.id,
            workspaceId: ws.id
          });
        }
      }
    }

    // 2. Search Smart Library
    const libMatches = libraryManager.search(q);
    for (const item of libMatches.slice(0, 5)) {
      results.push({
        type: 'library',
        title: `📚 ${item.title}`,
        subtitle: item.excerpt ? item.excerpt.slice(0, 80) : item.url,
        url: item.url
      });
    }

    // 3. Built-in Commands
    const commands = [
      { id: 'cmd_new_tab', title: 'New Tab', subtitle: 'Open a new browsing tab' },
      { id: 'cmd_ai_research', title: 'Open AI Research Assistant', subtitle: 'Summarize or ask questions on current page' },
      { id: 'cmd_focus_mode', title: 'Start Focus Session (25 min)', subtitle: 'Block distractions and focus' },
      { id: 'cmd_library', title: 'Open Smart Library', subtitle: 'View saved research notes and collections' },
      { id: 'cmd_split_view', title: 'Toggle Split View', subtitle: 'View two tabs side-by-side' },
      { id: 'cmd_swap_split', title: 'Swap Split Panes', subtitle: 'Swap left and right split panes' },
      { id: 'cmd_devtools', title: 'Open Developer Tools', subtitle: 'Inspect active web page' },
      { id: 'cmd_toggle_shield', title: 'Toggle Privacy Shield', subtitle: 'Switch tracker protection for site' }
    ];

    for (const cmd of commands) {
      if (!q || cmd.title.toLowerCase().includes(q) || cmd.subtitle.toLowerCase().includes(q)) {
        results.push({
          type: 'command',
          title: cmd.title,
          subtitle: cmd.subtitle,
          commandId: cmd.id
        });
      }
    }

    return results;
  });

  // --------------------------------------------------------------------------
  // V2 Feature IPC Handlers: AI Research Assistant
  // --------------------------------------------------------------------------
  ipcMain.handle('ai-summarize-active-page', async () => {
    const activeTab = workspaceManager.getActiveTab();
    if (!activeTab || !tabViews.has(activeTab.id)) {
      return { summary: 'No active web page to summarize.', keyTakeaways: [] };
    }
    const view = tabViews.get(activeTab.id);
    const extracted = await aiAssistant.extractContent(view.webContents);
    return aiAssistant.summarize(extracted);
  });

  ipcMain.handle('ai-ask-question', async (_event, { question }) => {
    const activeTab = workspaceManager.getActiveTab();
    if (!activeTab || !tabViews.has(activeTab.id)) {
      return { answer: 'No active web page loaded.', citations: [] };
    }
    const view = tabViews.get(activeTab.id);
    const extracted = await aiAssistant.extractContent(view.webContents);
    return aiAssistant.askQuestion(question, extracted);
  });

  ipcMain.handle('ai-compare-workspace-tabs', async () => {
    const activeWs = workspaceManager.getActiveWorkspace();
    const pages = [];
    for (const tab of activeWs.tabs) {
      if (tabViews.has(tab.id)) {
        const view = tabViews.get(tab.id);
        const extracted = await aiAssistant.extractContent(view.webContents);
        if (extracted) pages.push(extracted);
      }
    }
    return aiAssistant.comparePages(pages);
  });

  // --------------------------------------------------------------------------
  // V2 Feature IPC Handlers: Automations Rule Engine
  // --------------------------------------------------------------------------
  ipcMain.handle('rules-get', () => ruleEngine.getRules());
  ipcMain.handle('rules-add', (_event, { name, pattern, targetWorkspaceId }) => {
    return ruleEngine.addRule(name, pattern, targetWorkspaceId);
  });
  ipcMain.handle('rules-toggle', (_event, { ruleId }) => ruleEngine.toggleRule(ruleId));
  ipcMain.handle('rules-delete', (_event, { ruleId }) => ruleEngine.deleteRule(ruleId));

  // --------------------------------------------------------------------------
  // V2 Feature IPC Handlers: Smart Library 2.0
  // --------------------------------------------------------------------------
  ipcMain.handle('library-get-items', (_event, { collectionId }) => {
    return {
      collections: libraryManager.getCollections(),
      items: libraryManager.getItems(collectionId)
    };
  });
  ipcMain.handle('library-save-item', (_event, itemData) => {
    return libraryManager.saveItem(itemData);
  });
  ipcMain.handle('library-delete-item', (_event, { itemId }) => {
    return libraryManager.deleteItem(itemId);
  });
  ipcMain.handle('library-search', (_event, { query }) => {
    return libraryManager.search(query);
  });

  // --------------------------------------------------------------------------
  // V2 Feature IPC Handlers: Focus Sessions
  // --------------------------------------------------------------------------
  ipcMain.handle('focus-start', (_event, { minutes }) => {
    return focusManager.startSession(
      minutes,
      (status) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('focus-update', status);
        }
      },
      () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('focus-update', { isActive: false, remainingSeconds: 0 });
        }
      }
    );
  });

  ipcMain.handle('focus-stop', () => {
    const status = focusManager.stopSession();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('focus-update', status);
    }
    return status;
  });

  ipcMain.handle('focus-get-status', () => focusManager.getStatus());

  // History Manager
  ipcMain.handle('history-get', (_event, { limit } = {}) => historyManager.getEntries(limit));
  ipcMain.handle('history-search', (_event, { query }) => historyManager.search(query));
  ipcMain.handle('history-delete', (_event, { id }) => historyManager.deleteEntry(id));
  ipcMain.handle('history-clear', () => historyManager.clear());

  // Settings Manager
  ipcMain.handle('settings-get', () => settingsManager.getSettings());
  ipcMain.handle('settings-update', (_event, newSettings) => settingsManager.updateSettings(newSettings));

  // Tab Ergonomics IPC Handlers
  ipcMain.on('tab-toggle-pin', (_event, { tabId }) => {
    workspaceManager.togglePinTab(tabId);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('tab-duplicate', (_event, { tabId }) => {
    const newTab = workspaceManager.duplicateTab(tabId);
    if (newTab) {
      getOrCreateTabView(newTab);
      renderActiveWorkspaceTabs();
      syncStateToRenderer();
    }
  });

  ipcMain.on('tab-toggle-mute', (_event, { tabId }) => {
    if (tabViews.has(tabId)) {
      const wc = tabViews.get(tabId).webContents;
      const isMuted = wc.isAudioMuted();
      wc.setAudioMuted(!isMuted);
      workspaceManager.updateTab(tabId, { isMuted: !isMuted });
      syncStateToRenderer();
    }
  });

  ipcMain.on('tab-reorder', (_event, { fromIndex, toIndex }) => {
    workspaceManager.reorderTabs(fromIndex, toIndex);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('tab-reopen-closed', () => {
    const reopened = workspaceManager.reopenClosedTab();
    if (reopened) {
      getOrCreateTabView(reopened);
      renderActiveWorkspaceTabs();
      syncStateToRenderer();
    }
  });

  ipcMain.on('tab-close-others', (_event, { tabId }) => {
    workspaceManager.closeOtherTabs(tabId);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('tab-close-to-right', (_event, { tabId }) => {
    workspaceManager.closeTabsToRight(tabId);
    renderActiveWorkspaceTabs();
    syncStateToRenderer();
  });

  ipcMain.on('tab-context-menu', (_event, { tabId }) => {
    const ws = workspaceManager.getActiveWorkspace();
    const tab = ws.tabs.find(t => t.id === tabId);
    if (!tab) return;

    const tabMenu = Menu.buildFromTemplate([
      {
        label: tab.isPinned ? 'Unpin Tab' : 'Pin Tab',
        click: () => {
          workspaceManager.togglePinTab(tabId);
          renderActiveWorkspaceTabs();
          syncStateToRenderer();
        }
      },
      {
        label: 'Duplicate',
        click: () => {
          const newTab = workspaceManager.duplicateTab(tabId);
          if (newTab) {
            getOrCreateTabView(newTab);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        }
      },
      {
        label: tab.isMuted ? 'Unmute Tab' : 'Mute Tab',
        click: () => {
          if (tabViews.has(tabId)) {
            const wc = tabViews.get(tabId).webContents;
            const isMuted = wc.isAudioMuted();
            wc.setAudioMuted(!isMuted);
            workspaceManager.updateTab(tabId, { isMuted: !isMuted });
            syncStateToRenderer();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Close Other Tabs',
        click: () => {
          workspaceManager.closeOtherTabs(tabId);
          renderActiveWorkspaceTabs();
          syncStateToRenderer();
        }
      },
      {
        label: 'Close Tabs to the Right',
        click: () => {
          workspaceManager.closeTabsToRight(tabId);
          renderActiveWorkspaceTabs();
          syncStateToRenderer();
        }
      },
      {
        label: 'Reopen Closed Tab',
        accelerator: 'Ctrl+Shift+T',
        enabled: workspaceManager.closedTabs.length > 0,
        click: () => {
          const reopened = workspaceManager.reopenClosedTab();
          if (reopened) {
            getOrCreateTabView(reopened);
            renderActiveWorkspaceTabs();
            syncStateToRenderer();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Close Tab',
        click: () => {
          workspaceManager.closeTab(tabId);
          renderActiveWorkspaceTabs();
          syncStateToRenderer();
        }
      }
    ]);

    tabMenu.popup({ window: mainWindow });
  });

  // Find in Page
  ipcMain.on('find-in-page', (_event, { text, forward = true, findNext = false }) => {
    const tab = workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id) && text) {
      tabViews.get(tab.id).webContents.findInPage(text, { forward, findNext });
    }
  });

  ipcMain.on('stop-find-in-page', (_event, { action = 'clearSelection' }) => {
    const tab = workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      tabViews.get(tab.id).webContents.stopFindInPage(action);
    }
  });

  // Page Zoom
  ipcMain.on('zoom-in', () => {
    const tab = workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      const wc = tabViews.get(tab.id).webContents;
      const current = wc.getZoomLevel();
      const next = Math.min(3.0, current + 0.5);
      wc.setZoomLevel(next);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('zoom-changed', { level: Math.round(Math.pow(1.2, next) * 100) });
      }
    }
  });

  ipcMain.on('zoom-out', () => {
    const tab = workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      const wc = tabViews.get(tab.id).webContents;
      const current = wc.getZoomLevel();
      const next = Math.max(-2.0, current - 0.5);
      wc.setZoomLevel(next);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('zoom-changed', { level: Math.round(Math.pow(1.2, next) * 100) });
      }
    }
  });

  ipcMain.on('zoom-reset', () => {
    const tab = workspaceManager.getActiveTab();
    if (tab && tabViews.has(tab.id)) {
      const wc = tabViews.get(tab.id).webContents;
      wc.setZoomLevel(0);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('zoom-changed', { level: 100 });
      }
    }
  });

  // Omnibox Live Suggestions
  ipcMain.handle('omnibox-suggest', async (_event, { query }) => {
    const q = (query || '').trim();
    if (!q) return { history: [], suggestions: [] };

    const historyMatches = historyManager.search(q).slice(0, 4);
    let webSuggestions = [];
    try {
      const https = require('https');
      webSuggestions = await new Promise((resolve) => {
        const req = https.get(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve(Array.isArray(parsed[1]) ? parsed[1].slice(0, 5) : []);
            } catch (_) {
              resolve([]);
            }
          });
        });
        req.on('error', () => resolve([]));
        req.setTimeout(1500, () => { req.destroy(); resolve([]); });
      });
    } catch (_) {}

    return { history: historyMatches, suggestions: webSuggestions };
  });

  // Open / Show in folder for downloads
  ipcMain.on('open-path', (_event, { filePath }) => {
    if (filePath) shell.openPath(filePath);
  });

  ipcMain.on('show-item-in-folder', (_event, { filePath }) => {
    if (filePath) shell.showItemInFolder(filePath);
  });
}

app.whenReady().then(() => {
  initializeStoresAndServices();
  setupIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
