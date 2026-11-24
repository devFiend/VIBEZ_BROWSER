/**
 * Vibez Browser — Renderer UI Controller
 * Manages reactive DOM state, tab strip rendering, workspaces,
 * Split View divider dragging, Command Center, and Privacy Shield.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State Cache
  let currentWorkspaces = [];
  let currentActiveWsId = null;
  let currentActiveTab = null;
  let currentSplitTab = null;
  let currentSplitRatio = 0.50;
  let currentShield = { domain: '', blocked: 0, enabled: true };

  // DOM Elements
  const workspacesList = document.getElementById('workspaces-list');
  const tabStrip = document.getElementById('tab-strip');
  const btnNewTab = document.getElementById('btn-new-tab');
  const urlInput = document.getElementById('url-input');
  const splitUrlContainer = document.getElementById('split-url-container');
  const splitUrlInput = document.getElementById('split-url-input');
  const splitDivider = document.getElementById('split-divider');

  const btnBack = document.getElementById('btn-back');
  const btnForward = document.getElementById('btn-forward');
  const btnReload = document.getElementById('btn-reload');

  const btnToggleSplit = document.getElementById('btn-toggle-split');
  const btnSwapSplit = document.getElementById('btn-swap-split');
  const btnCommandCenter = document.getElementById('btn-command-center');
  const btnDevtools = document.getElementById('btn-devtools');
  const btnAddWorkspace = document.getElementById('btn-add-workspace');

  const btnShield = document.getElementById('btn-shield');
  const shieldBadge = document.getElementById('shield-count-badge');
  const shieldModal = document.getElementById('shield-modal');
  const btnCloseShield = document.getElementById('btn-close-shield');
  const shieldDomainLabel = document.getElementById('shield-domain-label');
  const shieldStatBlocked = document.getElementById('shield-stat-blocked');
  const shieldToggleInput = document.getElementById('shield-toggle-input');

  const commandModal = document.getElementById('command-modal');
  const commandSearchInput = document.getElementById('command-search-input');
  const commandResults = document.getElementById('command-results');

  const workspaceModal = document.getElementById('workspace-modal');
  const btnCloseWsModal = document.getElementById('btn-close-ws-modal');
  const wsNameInput = document.getElementById('ws-name-input');
  const wsIconInput = document.getElementById('ws-icon-input');
  const btnSubmitCreateWs = document.getElementById('btn-submit-create-ws');
  let selectedWsColor = '#3B82F6';

  // Window Controls
  document.getElementById('win-min').addEventListener('click', () => window.vibezApi.minimizeWindow());
  document.getElementById('win-max').addEventListener('click', () => window.vibezApi.maximizeWindow());
  document.getElementById('win-close').addEventListener('click', () => window.vibezApi.closeWindow());

  // --------------------------------------------------------------------------
  // Reactive State Sync from Main Process
  // --------------------------------------------------------------------------
  window.vibezApi.onStateUpdate((state) => {
    currentWorkspaces = state.workspaces || [];
    currentActiveWsId = state.activeWorkspaceId;
    currentActiveTab = state.activeTab;
    currentSplitTab = state.splitTab;
    currentSplitRatio = state.splitRatio || 0.50;
    if (state.shieldInfo) {
      currentShield = state.shieldInfo;
      updateShieldUI();
    }

    renderWorkspaces();
    renderTabs();
    updateNavigationControls();
    updateSplitViewUI();
  });

  window.vibezApi.onShieldUpdate((data) => {
    currentShield = data;
    updateShieldUI();
  });

  // --------------------------------------------------------------------------
  // Workspace Rendering
  // --------------------------------------------------------------------------
  function renderWorkspaces() {
    workspacesList.innerHTML = '';
    currentWorkspaces.forEach((ws, idx) => {
      const btn = document.createElement('button');
      btn.className = `ws-btn ${ws.id === currentActiveWsId ? 'active' : ''}`;
      btn.title = `${ws.name} (Ctrl+${idx + 1})`;
      btn.style.setProperty('--ws-color', ws.color);
      btn.textContent = ws.icon || '📁';

      btn.addEventListener('click', () => {
        window.vibezApi.switchWorkspace(ws.id);
      });

      workspacesList.appendChild(btn);
    });
  }

  // --------------------------------------------------------------------------
  // Tab Strip Rendering
  // --------------------------------------------------------------------------
  function renderTabs() {
    const activeWs = currentWorkspaces.find(w => w.id === currentActiveWsId);
    if (!activeWs) return;

    tabStrip.innerHTML = '';
    activeWs.tabs.forEach((tab) => {
      const tabEl = document.createElement('div');
      const isActive = currentActiveTab && currentActiveTab.id === tab.id;
      const isSplit = currentSplitTab && currentSplitTab.id === tab.id;

      tabEl.className = `tab-item ${isActive ? 'active' : ''} ${isSplit ? 'split-active' : ''}`;
      tabEl.title = tab.title || tab.url;

      const titleSpan = document.createElement('span');
      titleSpan.className = 'tab-title';
      titleSpan.textContent = tab.isLoading ? 'Loading...' : (tab.title || 'New Tab');

      const closeBtn = document.createElement('span');
      closeBtn.className = 'tab-close';
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.vibezApi.closeTab(tab.id);
      });

      tabEl.appendChild(titleSpan);
      tabEl.appendChild(closeBtn);

      tabEl.addEventListener('click', () => {
        window.vibezApi.switchTab(tab.id);
      });

      tabStrip.appendChild(tabEl);
    });

    // Update Omnibox inputs
    if (currentActiveTab && document.activeElement !== urlInput) {
      urlInput.value = currentActiveTab.url || '';
    }
    if (currentSplitTab && document.activeElement !== splitUrlInput) {
      splitUrlInput.value = currentSplitTab.url || '';
    }
  }

  function updateNavigationControls() {
    if (currentActiveTab) {
      btnBack.style.opacity = currentActiveTab.canGoBack ? '1' : '0.4';
      btnForward.style.opacity = currentActiveTab.canGoForward ? '1' : '0.4';
      btnReload.textContent = currentActiveTab.isLoading ? '✕' : '↻';
    }
  }

  // --------------------------------------------------------------------------
  // Navigation Events
  // --------------------------------------------------------------------------
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      window.vibezApi.navigate(urlInput.value, false);
      urlInput.blur();
    }
  });

  splitUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      window.vibezApi.navigate(splitUrlInput.value, true);
      splitUrlInput.blur();
    }
  });

  btnBack.addEventListener('click', () => window.vibezApi.goBack(false));
  btnForward.addEventListener('click', () => window.vibezApi.goForward(false));
  btnReload.addEventListener('click', () => {
    if (currentActiveTab && currentActiveTab.isLoading) {
      window.vibezApi.stop(false);
    } else {
      window.vibezApi.reload(false);
    }
  });

  btnNewTab.addEventListener('click', () => {
    window.vibezApi.createTab('https://duckduckgo.com');
  });

  // --------------------------------------------------------------------------
  // Split View
  // --------------------------------------------------------------------------
  function updateSplitViewUI() {
    const isSplit = !!currentSplitTab;
    btnToggleSplit.style.color = isSplit ? 'var(--accent-blue)' : 'var(--text-secondary)';
    btnSwapSplit.style.display = isSplit ? 'flex' : 'none';
    splitUrlContainer.style.display = isSplit ? 'flex' : 'none';
    splitDivider.style.display = isSplit ? 'flex' : 'none';

    if (isSplit) {
      const containerWidth = window.innerWidth - 58;
      const dividerX = 58 + Math.floor(containerWidth * currentSplitRatio) - 3;
      splitDivider.style.left = `${dividerX}px`;
    }
  }

  btnToggleSplit.addEventListener('click', () => window.vibezApi.toggleSplitView());
  btnSwapSplit.addEventListener('click', () => window.vibezApi.swapSplitPanes());

  // Split Divider Dragging
  let isDraggingDivider = false;
  splitDivider.addEventListener('mousedown', (e) => {
    isDraggingDivider = true;
    document.body.style.cursor = 'col-resize';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingDivider) return;
    const containerWidth = window.innerWidth - 58;
    const offset = e.clientX - 58;
    const ratio = Math.max(0.2, Math.min(0.8, offset / containerWidth));
    window.vibezApi.setSplitRatio(ratio);
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingDivider) {
      isDraggingDivider = false;
      document.body.style.cursor = 'default';
    }
  });

  // --------------------------------------------------------------------------
  // Privacy Shield Modal
  // --------------------------------------------------------------------------
  function updateShieldUI() {
    shieldBadge.textContent = currentShield.blocked || 0;
    shieldBadge.style.color = currentShield.enabled ? 'var(--accent-green)' : 'var(--text-muted)';
    shieldDomainLabel.textContent = currentShield.domain || 'This website';
    shieldStatBlocked.textContent = currentShield.blocked || 0;
    shieldToggleInput.checked = currentShield.enabled;
  }

  btnShield.addEventListener('click', () => {
    updateShieldUI();
    shieldModal.style.display = 'flex';
  });

  btnCloseShield.addEventListener('click', () => {
    shieldModal.style.display = 'none';
  });

  shieldToggleInput.addEventListener('change', () => {
    if (currentShield.domain) {
      window.vibezApi.toggleShield(currentShield.domain);
    }
  });

  // --------------------------------------------------------------------------
  // Command Center (Ctrl+K)
  // --------------------------------------------------------------------------
  let commandResultsCache = [];
  let selectedCommandIndex = 0;

  function openCommandCenter() {
    commandModal.style.display = 'flex';
    commandSearchInput.value = '';
    commandSearchInput.focus();
    executeCommandSearch('');
  }

  function closeCommandCenter() {
    commandModal.style.display = 'none';
  }

  async function executeCommandSearch(query) {
    commandResultsCache = await window.vibezApi.searchAll(query);
    selectedCommandIndex = 0;
    renderCommandResults();
  }

  function renderCommandResults() {
    commandResults.innerHTML = '';
    if (commandResultsCache.length === 0) {
      commandResults.innerHTML = '<div style="padding: 16px; color: var(--text-muted); font-size: 13px; text-align: center;">No matching tabs or commands</div>';
      return;
    }

    commandResultsCache.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `command-item ${idx === selectedCommandIndex ? 'selected' : ''}`;

      const titleEl = document.createElement('div');
      titleEl.className = 'command-item-title';
      titleEl.textContent = item.title;

      const subEl = document.createElement('div');
      subEl.className = 'command-item-sub';
      subEl.textContent = item.subtitle;

      el.appendChild(titleEl);
      el.appendChild(subEl);

      el.addEventListener('click', () => {
        executeCommandItem(item);
      });

      commandResults.appendChild(el);
    });
  }

  function executeCommandItem(item) {
    closeCommandCenter();
    if (item.type === 'tab') {
      window.vibezApi.switchWorkspace(item.workspaceId);
      window.vibezApi.switchTab(item.tabId);
    } else if (item.type === 'command') {
      if (item.commandId === 'cmd_new_tab') window.vibezApi.createTab();
      if (item.commandId === 'cmd_split_view') window.vibezApi.toggleSplitView();
      if (item.commandId === 'cmd_swap_split') window.vibezApi.swapSplitPanes();
      if (item.commandId === 'cmd_devtools') window.vibezApi.openDevTools();
      if (item.commandId === 'cmd_toggle_shield' && currentShield.domain) {
        window.vibezApi.toggleShield(currentShield.domain);
      }
    }
  }

  btnCommandCenter.addEventListener('click', openCommandCenter);
  btnDevtools.addEventListener('click', () => window.vibezApi.openDevTools());

  commandSearchInput.addEventListener('input', (e) => {
    executeCommandSearch(e.target.value);
  });

  commandSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedCommandIndex = (selectedCommandIndex + 1) % commandResultsCache.length;
      renderCommandResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedCommandIndex = (selectedCommandIndex - 1 + commandResultsCache.length) % commandResultsCache.length;
      renderCommandResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (commandResultsCache[selectedCommandIndex]) {
        executeCommandItem(commandResultsCache[selectedCommandIndex]);
      }
    } else if (e.key === 'Escape') {
      closeCommandCenter();
    }
  });

  // --------------------------------------------------------------------------
  // Workspace Creation Modal
  // --------------------------------------------------------------------------
  btnAddWorkspace.addEventListener('click', () => {
    workspaceModal.style.display = 'flex';
    wsNameInput.value = '';
    wsNameInput.focus();
  });

  btnCloseWsModal.addEventListener('click', () => {
    workspaceModal.style.display = 'none';
  });

  document.querySelectorAll('.color-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedWsColor = btn.dataset.color;
    });
  });

  btnSubmitCreateWs.addEventListener('click', () => {
    const name = wsNameInput.value.trim();
    const icon = wsIconInput.value.trim() || '📁';
    if (name) {
      window.vibezApi.createWorkspace(name, icon, selectedWsColor);
      workspaceModal.style.display = 'none';
    }
  });

  // --------------------------------------------------------------------------
  // Global Keyboard Shortcuts
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // Ctrl + K -> Command Center
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandModal.style.display === 'flex' ? closeCommandCenter() : openCommandCenter();
    }
    // Ctrl + \ -> Toggle Split View
    if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
      e.preventDefault();
      window.vibezApi.toggleSplitView();
    }
    // Ctrl + T -> New Tab
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      window.vibezApi.createTab();
    }
    // Ctrl + W -> Close Tab
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if (currentActiveTab) window.vibezApi.closeTab(currentActiveTab.id);
    }
    // Ctrl + 1..9 -> Switch Workspace
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key) - 1;
      if (currentWorkspaces[idx]) {
        e.preventDefault();
        window.vibezApi.switchWorkspace(currentWorkspaces[idx].id);
      }
    }
    // Escape closes modals
    if (e.key === 'Escape') {
      closeCommandCenter();
      shieldModal.style.display = 'none';
      workspaceModal.style.display = 'none';
    }
  });
});
