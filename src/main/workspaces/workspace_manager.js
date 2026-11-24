/**
 * Workspace and Tab Lifecycle Manager for Vibez Browser.
 * Manages virtual browsing environments with strict tab isolation,
 * Split View pairing, and session persistence.
 */

const crypto = require('crypto');

class WorkspaceManager {
  constructor(store) {
    this.store = store;
    this.workspaces = [];
    this.activeWorkspaceId = null;

    this._load();
  }

  _generateId(prefix = 'item') {
    return `${prefix}_${crypto.randomBytes(4).toString('hex')}`;
  }

  _load() {
    const saved = this.store ? this.store.get('workspaces_data') : null;
    if (saved && Array.isArray(saved.workspaces) && saved.workspaces.length > 0) {
      this.workspaces = saved.workspaces;
      this.activeWorkspaceId = saved.activeWorkspaceId || this.workspaces[0].id;
    } else {
      // Default out-of-the-box workspaces
      this.workspaces = [
        {
          id: 'ws_work',
          name: 'Work',
          icon: '💼',
          color: '#3B82F6', // Blue
          tabs: [
            {
              id: 'tab_home_1',
              url: 'https://duckduckgo.com',
              title: 'DuckDuckGo — Privacy, simplified.',
              favicon: '',
              isLoading: false,
              canGoBack: false,
              canGoForward: false,
              isMuted: false,
              isPinned: false
            }
          ],
          activeTabIndex: 0,
          splitTabId: null
        },
        {
          id: 'ws_research',
          name: 'Research',
          icon: '🔬',
          color: '#10B981', // Green
          tabs: [
            {
              id: 'tab_wiki_1',
              url: 'https://en.wikipedia.org',
              title: 'Wikipedia, the free encyclopedia',
              favicon: '',
              isLoading: false,
              canGoBack: false,
              canGoForward: false,
              isMuted: false,
              isPinned: false
            }
          ],
          activeTabIndex: 0,
          splitTabId: null
        },
        {
          id: 'ws_dev',
          name: 'Dev',
          icon: '⚡',
          color: '#8B5CF6', // Purple
          tabs: [
            {
              id: 'tab_gh_1',
              url: 'https://github.com',
              title: 'GitHub: Let’s build from here',
              favicon: '',
              isLoading: false,
              canGoBack: false,
              canGoForward: false,
              isMuted: false,
              isPinned: false
            }
          ],
          activeTabIndex: 0,
          splitTabId: null
        },
        {
          id: 'ws_personal',
          name: 'Personal',
          icon: '🎮',
          color: '#F59E0B', // Amber
          tabs: [
            {
              id: 'tab_news_1',
              url: 'https://news.ycombinator.com',
              title: 'Hacker News',
              favicon: '',
              isLoading: false,
              canGoBack: false,
              canGoForward: false,
              isMuted: false,
              isPinned: false
            }
          ],
          activeTabIndex: 0,
          splitTabId: null
        }
      ];
      this.activeWorkspaceId = 'ws_work';
      this.save();
    }
  }

  save() {
    if (this.store) {
      this.store.set('workspaces_data', {
        workspaces: this.workspaces,
        activeWorkspaceId: this.activeWorkspaceId
      });
    }
  }

  getActiveWorkspace() {
    return this.workspaces.find(w => w.id === this.activeWorkspaceId) || this.workspaces[0];
  }

  setActiveWorkspace(workspaceId) {
    const ws = this.workspaces.find(w => w.id === workspaceId);
    if (ws) {
      this.activeWorkspaceId = ws.id;
      this.save();
      return ws;
    }
    return null;
  }

  createWorkspace(name, icon = '📁', color = '#3B82F6') {
    const newWs = {
      id: this._generateId('ws'),
      name: name.trim() || 'New Workspace',
      icon: icon || '📁',
      color: color || '#3B82F6',
      tabs: [
        {
          id: this._generateId('tab'),
          url: 'https://duckduckgo.com',
          title: 'New Tab',
          favicon: '',
          isLoading: false,
          canGoBack: false,
          canGoForward: false,
          isMuted: false,
          isPinned: false
        }
      ],
      activeTabIndex: 0,
      splitTabId: null
    };

    this.workspaces.push(newWs);
    this.activeWorkspaceId = newWs.id;
    this.save();
    return newWs;
  }

  getActiveTab() {
    const ws = this.getActiveWorkspace();
    if (!ws || !ws.tabs || ws.tabs.length === 0) return null;
    return ws.tabs[ws.activeTabIndex] || ws.tabs[0];
  }

  getSplitTab() {
    const ws = this.getActiveWorkspace();
    if (!ws || !ws.splitTabId) return null;
    return ws.tabs.find(t => t.id === ws.splitTabId) || null;
  }

  createTab(url = 'https://duckduckgo.com', activate = true) {
    const ws = this.getActiveWorkspace();
    const newTab = {
      id: this._generateId('tab'),
      url: url,
      title: 'New Tab',
      favicon: '',
      isLoading: true,
      canGoBack: false,
      canGoForward: false,
      isMuted: false,
      isPinned: false
    };

    ws.tabs.push(newTab);
    if (activate) {
      ws.activeTabIndex = ws.tabs.length - 1;
    }
    this.save();
    return newTab;
  }

  closeTab(tabId) {
    const ws = this.getActiveWorkspace();
    const index = ws.tabs.findIndex(t => t.id === tabId);
    if (index === -1) return null;

    if (ws.splitTabId === tabId) {
      ws.splitTabId = null;
    }

    ws.tabs.splice(index, 1);

    // Ensure at least one tab remains
    if (ws.tabs.length === 0) {
      ws.tabs.push({
        id: this._generateId('tab'),
        url: 'https://duckduckgo.com',
        title: 'New Tab',
        favicon: '',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isMuted: false,
        isPinned: false
      });
      ws.activeTabIndex = 0;
    } else {
      if (ws.activeTabIndex >= ws.tabs.length) {
        ws.activeTabIndex = ws.tabs.length - 1;
      }
    }

    this.save();
    return this.getActiveTab();
  }

  setActiveTab(tabId) {
    const ws = this.getActiveWorkspace();
    const index = ws.tabs.findIndex(t => t.id === tabId);
    if (index !== -1) {
      ws.activeTabIndex = index;
      this.save();
      return ws.tabs[index];
    }
    return null;
  }

  toggleSplitView(secondaryTabId = null) {
    const ws = this.getActiveWorkspace();
    if (ws.splitTabId) {
      // Already in split view -> disable it
      ws.splitTabId = null;
    } else {
      // Enable split view: pick specified tab, or next available tab, or create one
      if (secondaryTabId && ws.tabs.some(t => t.id === secondaryTabId)) {
        ws.splitTabId = secondaryTabId;
      } else if (ws.tabs.length > 1) {
        const nextIndex = (ws.activeTabIndex + 1) % ws.tabs.length;
        ws.splitTabId = ws.tabs[nextIndex].id;
      } else {
        const newTab = this.createTab('https://duckduckgo.com', false);
        ws.splitTabId = newTab.id;
      }
    }
    this.save();
    return ws.splitTabId;
  }

  swapSplitPanes() {
    const ws = this.getActiveWorkspace();
    if (!ws.splitTabId) return;

    const currentActive = this.getActiveTab();
    const splitTab = this.getSplitTab();
    if (currentActive && splitTab) {
      const splitIdx = ws.tabs.findIndex(t => t.id === splitTab.id);
      ws.activeTabIndex = splitIdx;
      ws.splitTabId = currentActive.id;
      this.save();
    }
  }

  updateTab(tabId, updates) {
    for (const ws of this.workspaces) {
      const tab = ws.tabs.find(t => t.id === tabId);
      if (tab) {
        Object.assign(tab, updates);
        this.save();
        return tab;
      }
    }
    return null;
  }
}

module.exports = { WorkspaceManager };
