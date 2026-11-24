/**
 * Vibez Browser — Renderer UI Controller
 * High-performance, clean architecture matching Mozilla Firefox & DuckDuckGo.
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
  const btnWorkspaceMenu = document.getElementById('btn-workspace-menu');
  const workspaceDropdown = document.getElementById('workspace-dropdown');
  const wsIndicatorDot = document.getElementById('ws-indicator-dot');
  const wsCurrentName = document.getElementById('ws-current-name');

  const tabStrip = document.getElementById('tab-strip');
  const btnNewTab = document.getElementById('btn-new-tab');
  const urlInput = document.getElementById('url-input');
  const splitUrlContainer = document.getElementById('split-url-container');
  const splitUrlInput = document.getElementById('split-url-input');
  const splitDivider = document.getElementById('split-divider');

  const btnBack = document.getElementById('btn-back');
  const btnForward = document.getElementById('btn-forward');
  const btnReload = document.getElementById('btn-reload');

  const btnFire = document.getElementById('btn-fire');
  const btnToggleSplit = document.getElementById('btn-toggle-split');
  const btnSwapSplit = document.getElementById('btn-swap-split');
  const btnAiAssistant = document.getElementById('btn-ai-assistant');
  const btnLibrary = document.getElementById('btn-library');
  const btnFocus = document.getElementById('btn-focus');
  const btnBrowserMenu = document.getElementById('btn-browser-menu');
  const browserMenuDropdown = document.getElementById('browser-menu-dropdown');

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
  const btnAddWorkspace = document.getElementById('btn-add-workspace');
  const btnCloseWsModal = document.getElementById('btn-close-ws-modal');
  const wsNameInput = document.getElementById('ws-name-input');
  const wsIconInput = document.getElementById('ws-icon-input');
  const btnSubmitCreateWs = document.getElementById('btn-submit-create-ws');
  let selectedWsColor = '#0060DF';

  // Populate all SVG icons across the chrome
  function initIcons() {
    if (typeof ICONS !== 'undefined') {
      document.querySelectorAll('[data-icon]').forEach(slot => {
        const iconName = slot.dataset.icon;
        if (ICONS[iconName]) {
          slot.innerHTML = ICONS[iconName];
        }
      });
    }
  }
  initIcons();

  // Window Controls (Windows Fluent)
  const winMin = document.getElementById('win-min');
  const winMax = document.getElementById('win-max');
  const winClose = document.getElementById('win-close');
  if (winMin) winMin.addEventListener('click', () => window.vibezApi.minimizeWindow());
  if (winMax) winMax.addEventListener('click', () => window.vibezApi.maximizeWindow());
  if (winClose) winClose.addEventListener('click', () => window.vibezApi.closeWindow());

  // Omnibox Bookmark & Share
  const btnStarBookmark = document.getElementById('btn-star-bookmark');
  if (btnStarBookmark) {
    btnStarBookmark.addEventListener('click', async () => {
      if (currentActiveTab && currentActiveTab.url) {
        await window.vibezApi.saveLibraryExcerpt({
          url: currentActiveTab.url,
          title: currentActiveTab.title || 'Bookmarked Page',
          excerpt: `Saved from ${currentActiveTab.url}`
        });
        showShellToast('Page bookmarked');
      }
    });
  }

  const btnSharePage = document.getElementById('btn-share-page');
  if (btnSharePage) {
    btnSharePage.addEventListener('click', () => {
      if (currentActiveTab && currentActiveTab.url) {
        navigator.clipboard?.writeText(currentActiveTab.url);
        showShellToast('URL copied to clipboard');
      }
    });
  }

  // DuckDuckGo Fire Button
  if (btnFire) {
    btnFire.addEventListener('click', () => {
      triggerFireAnimation();
      if (currentActiveTab) {
        window.vibezApi.navigate('vibez://newtab');
        showShellToast('Fire: Browsing session burned');
      }
    });
  }

  function triggerFireAnimation() {
    const chromeEl = document.getElementById('browser-chrome');
    if (chromeEl) {
      chromeEl.classList.add('fire-burning');
      setTimeout(() => chromeEl.classList.remove('fire-burning'), 600);
    }
  }

  // Workspaces Dropdown
  if (btnWorkspaceMenu && workspaceDropdown) {
    btnWorkspaceMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      workspaceDropdown.style.display = workspaceDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (browserMenuDropdown) browserMenuDropdown.style.display = 'none';
    });
  }

  // Application Menu (Hamburger)
  if (btnBrowserMenu && browserMenuDropdown) {
    btnBrowserMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      browserMenuDropdown.style.display = browserMenuDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (workspaceDropdown) workspaceDropdown.style.display = 'none';
    });
  }

  // Close dropdowns on outside click
  window.addEventListener('click', () => {
    if (workspaceDropdown) workspaceDropdown.style.display = 'none';
    if (browserMenuDropdown) browserMenuDropdown.style.display = 'none';
    if (downloadsDropdown) downloadsDropdown.style.display = 'none';
  });

  // Menu items click events
  const menuItemNewTab = document.getElementById('menu-new-tab');
  if (menuItemNewTab) menuItemNewTab.addEventListener('click', () => window.vibezApi.createTab());

  const menuItemSplit = document.getElementById('menu-split');
  if (menuItemSplit) menuItemSplit.addEventListener('click', () => window.vibezApi.toggleSplitView());

  const menuItemCommand = document.getElementById('menu-command');
  if (menuItemCommand) menuItemCommand.addEventListener('click', () => openCommandCenter());

  const menuItemAutomations = document.getElementById('menu-automations');
  if (menuItemAutomations) menuItemAutomations.addEventListener('click', () => openAutomationsModal());

  const menuItemDevtools = document.getElementById('menu-devtools');
  if (menuItemDevtools) menuItemDevtools.addEventListener('click', () => window.vibezApi.openDevTools());

  const menuItemFire = document.getElementById('menu-fire');
  if (menuItemFire) {
    menuItemFire.addEventListener('click', () => {
      window.vibezApi.navigate('vibez://newtab');
      showShellToast('Burned: Session data cleared');
    });
  }

  function showShellToast(msg) {
    const toast = document.getElementById('automation-toast');
    const toastText = document.getElementById('automation-toast-text');
    if (toast && toastText) {
      toastText.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
  }

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

    // Page Load Progress Bar Animation
    const loadProgressBar = document.getElementById('load-progress-bar');
    if (loadProgressBar && currentActiveTab) {
      if (currentActiveTab.isLoading) {
        loadProgressBar.classList.add('loading');
        loadProgressBar.style.width = '70%';
      } else {
        loadProgressBar.style.width = '100%';
        setTimeout(() => {
          if (loadProgressBar && (!currentActiveTab || !currentActiveTab.isLoading)) {
            loadProgressBar.classList.remove('loading');
            loadProgressBar.style.width = '0%';
          }
        }, 220);
      }
    }
  });

  window.vibezApi.onShieldUpdate((data) => {
    currentShield = data;
    updateShieldUI();
  });

  // --------------------------------------------------------------------------
  // Workspace Rendering
  // --------------------------------------------------------------------------
  function renderWorkspaces() {
    if (!workspacesList) return;
    workspacesList.innerHTML = '';

    const activeWs = currentWorkspaces.find(w => w.id === currentActiveWsId);
    if (activeWs && wsCurrentName && wsIndicatorDot) {
      wsCurrentName.textContent = activeWs.name;
      wsIndicatorDot.style.backgroundColor = activeWs.color || 'var(--fx-blue)';
    }

    currentWorkspaces.forEach((ws, idx) => {
      const item = document.createElement('button');
      item.className = `fx-dropdown-item ${ws.id === currentActiveWsId ? 'active' : ''}`;
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${ws.color || 'var(--fx-blue)'};"></span>
          <span>${ws.name}</span>
        </div>
        <span class="menu-accel">Ctrl+${idx + 1}</span>
      `;

      item.addEventListener('click', () => {
        window.vibezApi.switchWorkspace(ws.id);
        if (workspaceDropdown) workspaceDropdown.style.display = 'none';
      });

      workspacesList.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // Tab Strip Rendering (Proton Floating Tabs + Daily Driver Ergonomics)
  // --------------------------------------------------------------------------
  function renderTabs() {
    const activeWs = currentWorkspaces.find(w => w.id === currentActiveWsId);
    if (!activeWs) return;

    tabStrip.innerHTML = '';
    activeWs.tabs.forEach((tab, index) => {
      const tabEl = document.createElement('div');
      const isActive = currentActiveTab && currentActiveTab.id === tab.id;
      const isSplit = currentSplitTab && currentSplitTab.id === tab.id;
      const isPinned = !!tab.isPinned;

      tabEl.className = `tab-item ${isActive ? 'active' : ''} ${isSplit ? 'split-active' : ''} ${isPinned ? 'pinned' : ''}`;
      tabEl.title = tab.title || tab.url || 'Tab';
      tabEl.dataset.tabId = tab.id;
      tabEl.dataset.tabIndex = index;
      tabEl.setAttribute('draggable', 'true');

      // Dot / Pin indicator
      const dotSpan = document.createElement('span');
      dotSpan.className = 'tab-icon-dot';
      if (isPinned && typeof ICONS !== 'undefined' && ICONS.pin) {
        dotSpan.innerHTML = ICONS.pin;
        dotSpan.style.background = 'none';
        dotSpan.style.display = 'flex';
        dotSpan.style.alignItems = 'center';
        dotSpan.style.justifyContent = 'center';
        dotSpan.style.color = isActive ? 'var(--fx-blue)' : 'var(--fx-text-muted)';
      }

      // Tab Title
      const titleSpan = document.createElement('span');
      titleSpan.className = 'tab-title';
      titleSpan.textContent = tab.isLoading ? 'Loading...' : (tab.title || 'New Tab');

      // Audio / Mute Indicator
      let audioBtn = null;
      if (tab.isAudible || tab.isMuted) {
        audioBtn = document.createElement('span');
        audioBtn.className = `tab-audio-btn ${tab.isMuted ? 'muted' : ''}`;
        audioBtn.title = tab.isMuted ? 'Unmute tab' : 'Mute tab';
        audioBtn.innerHTML = typeof ICONS !== 'undefined'
          ? (tab.isMuted ? ICONS.volumeMute : ICONS.volume)
          : (tab.isMuted ? 'M' : 'S');
        audioBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.vibezApi.toggleMuteTab(tab.id);
        });
      }

      // Close Button
      const closeBtn = document.createElement('span');
      closeBtn.className = 'tab-close';
      closeBtn.innerHTML = typeof ICONS !== 'undefined' ? ICONS.close : '×';
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.vibezApi.closeTab(tab.id);
      });

      tabEl.appendChild(dotSpan);
      tabEl.appendChild(titleSpan);
      if (audioBtn) tabEl.appendChild(audioBtn);
      if (!isPinned) tabEl.appendChild(closeBtn);

      // Tab Switch
      tabEl.addEventListener('click', () => {
        window.vibezApi.switchTab(tab.id);
      });

      // Middle-click to close (non-pinned tabs)
      tabEl.addEventListener('auxclick', (e) => {
        if (e.button === 1 && !isPinned) {
          e.preventDefault();
          e.stopPropagation();
          window.vibezApi.closeTab(tab.id);
        }
      });

      // Right-click Context Menu
      tabEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.vibezApi.showTabContextMenu(tab.id);
      });

      // HTML5 Drag and Drop Reordering
      tabEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', String(index));
        e.dataTransfer.effectAllowed = 'move';
        tabEl.classList.add('dragging');
      });

      tabEl.addEventListener('dragend', () => {
        tabEl.classList.remove('dragging');
        document.querySelectorAll('.tab-item').forEach(el => {
          el.classList.remove('drag-over-left', 'drag-over-right');
        });
      });

      tabEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = tabEl.getBoundingClientRect();
        const midPoint = rect.left + rect.width / 2;
        if (e.clientX < midPoint) {
          tabEl.classList.add('drag-over-left');
          tabEl.classList.remove('drag-over-right');
        } else {
          tabEl.classList.add('drag-over-right');
          tabEl.classList.remove('drag-over-left');
        }
      });

      tabEl.addEventListener('dragleave', () => {
        tabEl.classList.remove('drag-over-left', 'drag-over-right');
      });

      tabEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const rect = tabEl.getBoundingClientRect();
        const midPoint = rect.left + rect.width / 2;
        let toIdx = index;
        if (e.clientX >= midPoint && fromIdx < index) {
          toIdx = index;
        } else if (e.clientX >= midPoint && fromIdx > index) {
          toIdx = index + 1;
        } else if (e.clientX < midPoint && fromIdx > index) {
          toIdx = index;
        } else if (e.clientX < midPoint && fromIdx < index) {
          toIdx = Math.max(0, index - 1);
        }
        tabEl.classList.remove('drag-over-left', 'drag-over-right');
        if (!isNaN(fromIdx) && fromIdx !== toIdx) {
          window.vibezApi.reorderTabs(fromIdx, toIdx);
        }
      });

      tabStrip.appendChild(tabEl);
    });

    // Update Omnibox inputs
    if (currentActiveTab && document.activeElement !== urlInput) {
      if (!currentActiveTab.url || currentActiveTab.url === 'vibez://newtab' || currentActiveTab.url.includes('newtab.html')) {
        urlInput.value = '';
        urlInput.placeholder = 'Search Google or enter address';
      } else {
        urlInput.value = currentActiveTab.url;
      }
    }
    if (currentSplitTab && document.activeElement !== splitUrlInput) {
      if (!currentSplitTab.url || currentSplitTab.url === 'vibez://newtab' || currentSplitTab.url.includes('newtab.html')) {
        splitUrlInput.value = '';
        splitUrlInput.placeholder = 'Pane 2 URL...';
      } else {
        splitUrlInput.value = currentSplitTab.url;
      }
    }
  }

  function updateNavigationControls() {
    if (currentActiveTab) {
      btnBack.style.opacity = currentActiveTab.canGoBack ? '1' : '0.35';
      btnForward.style.opacity = currentActiveTab.canGoForward ? '1' : '0.35';
      if (typeof ICONS !== 'undefined') {
        btnReload.innerHTML = currentActiveTab.isLoading ? ICONS.stop : ICONS.reload;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Omnibox Live Suggestions & Autocomplete
  // --------------------------------------------------------------------------
  const omniboxSuggestions = document.getElementById('omnibox-suggestions');
  let omniboxItems = [];
  let selectedOmniboxIdx = -1;
  let omniboxDebounceTimer = null;

  async function fetchOmniboxSuggestions(query) {
    const q = (query || '').trim();
    if (!q || q.startsWith('vibez://') || q.startsWith('file://')) {
      hideOmniboxSuggestions();
      return;
    }

    try {
      const res = await window.vibezApi.getOmniboxSuggestions(q);
      const historyMatches = (res && res.history) || [];
      const webSuggestions = (res && res.suggestions) || [];

      omniboxItems = [];
      historyMatches.forEach(h => {
        omniboxItems.push({
          type: 'history',
          title: h.title || h.url,
          url: h.url,
          displayUrl: h.url.replace(/^https?:\/\//, '')
        });
      });

      webSuggestions.forEach(s => {
        if (!omniboxItems.some(i => i.title.toLowerCase() === s.toLowerCase())) {
          omniboxItems.push({
            type: 'search',
            title: s,
            url: `https://www.google.com/search?q=${encodeURIComponent(s)}`,
            displayUrl: 'Google Search'
          });
        }
      });

      renderOmniboxSuggestions();
    } catch (_) {
      hideOmniboxSuggestions();
    }
  }

  function renderOmniboxSuggestions() {
    if (!omniboxSuggestions) return;
    if (omniboxItems.length === 0) {
      hideOmniboxSuggestions();
      return;
    }

    omniboxSuggestions.innerHTML = '';
    selectedOmniboxIdx = -1;

    omniboxItems.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'omnibox-item';
      const iconSvg = item.type === 'history'
        ? (typeof ICONS !== 'undefined' ? ICONS.clock : '')
        : (typeof ICONS !== 'undefined' ? ICONS.search : '');

      el.innerHTML = `
        <span class="omnibox-item-icon">${iconSvg}</span>
        <div class="omnibox-item-content">
          <span class="omnibox-item-title">${item.title}</span>
          <span class="omnibox-item-url">${item.displayUrl}</span>
        </div>
        <span class="omnibox-item-type">${item.type}</span>
      `;

      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        navigateOmniboxItem(item);
      });

      omniboxSuggestions.appendChild(el);
    });

    omniboxSuggestions.style.display = 'flex';
  }

  function hideOmniboxSuggestions() {
    if (omniboxSuggestions) {
      omniboxSuggestions.style.display = 'none';
      omniboxSuggestions.innerHTML = '';
    }
    omniboxItems = [];
    selectedOmniboxIdx = -1;
  }

  function updateSelectedOmniboxItem() {
    if (!omniboxSuggestions) return;
    const items = omniboxSuggestions.querySelectorAll('.omnibox-item');
    items.forEach((item, idx) => {
      if (idx === selectedOmniboxIdx) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function navigateOmniboxItem(item) {
    hideOmniboxSuggestions();
    urlInput.value = item.url;
    window.vibezApi.navigate(item.url, false);
    urlInput.blur();
  }

  urlInput.addEventListener('input', (e) => {
    clearTimeout(omniboxDebounceTimer);
    omniboxDebounceTimer = setTimeout(() => {
      fetchOmniboxSuggestions(e.target.value);
    }, 120);
  });

  urlInput.addEventListener('blur', () => {
    setTimeout(hideOmniboxSuggestions, 200);
  });

  // --------------------------------------------------------------------------
  // Navigation Events
  // --------------------------------------------------------------------------
  urlInput.addEventListener('keydown', (e) => {
    if (omniboxItems.length > 0 && omniboxSuggestions.style.display !== 'none') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedOmniboxIdx = (selectedOmniboxIdx + 1) % omniboxItems.length;
        updateSelectedOmniboxItem();
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedOmniboxIdx = (selectedOmniboxIdx - 1 + omniboxItems.length) % omniboxItems.length;
        updateSelectedOmniboxItem();
        return;
      } else if (e.key === 'Escape') {
        hideOmniboxSuggestions();
        return;
      } else if (e.key === 'Enter') {
        if (selectedOmniboxIdx >= 0 && omniboxItems[selectedOmniboxIdx]) {
          e.preventDefault();
          navigateOmniboxItem(omniboxItems[selectedOmniboxIdx]);
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      hideOmniboxSuggestions();
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
    window.vibezApi.createTab('vibez://newtab');
  });

  // --------------------------------------------------------------------------
  // Split View
  // --------------------------------------------------------------------------
  function updateSplitViewUI() {
    const isSplit = !!currentSplitTab;
    btnToggleSplit.style.color = isSplit ? 'var(--fx-blue)' : 'var(--fx-text-secondary)';
    btnSwapSplit.style.display = isSplit ? 'flex' : 'none';
    splitUrlContainer.style.display = isSplit ? 'flex' : 'none';
    splitDivider.style.display = isSplit ? 'flex' : 'none';

    if (isSplit) {
      const containerWidth = window.innerWidth;
      const dividerX = Math.floor(containerWidth * currentSplitRatio) - 2;
      splitDivider.style.left = `${dividerX}px`;
    }
  }

  btnToggleSplit.addEventListener('click', () => window.vibezApi.toggleSplitView());
  btnSwapSplit.addEventListener('click', () => window.vibezApi.swapSplitPanes());

  // Split Divider Dragging
  let isDraggingDivider = false;
  splitDivider.addEventListener('mousedown', () => {
    isDraggingDivider = true;
    document.body.style.cursor = 'col-resize';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingDivider) return;
    const containerWidth = window.innerWidth;
    const ratio = Math.max(0.2, Math.min(0.8, e.clientX / containerWidth));
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
    shieldBadge.style.color = currentShield.enabled ? 'var(--fx-green)' : 'var(--fx-text-muted)';
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
      commandResults.innerHTML = '<div style="padding: 16px; color: var(--fx-text-muted); font-size: 13px; text-align: center;">No matching tabs or commands</div>';
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
      if (item.commandId === 'cmd_history') window.vibezApi.createTab('vibez://history');
      if (item.commandId === 'cmd_library') window.vibezApi.createTab('vibez://library');
      if (item.commandId === 'cmd_settings') window.vibezApi.createTab('vibez://settings');
      if (item.commandId === 'cmd_split_view') window.vibezApi.toggleSplitView();
      if (item.commandId === 'cmd_swap_split') window.vibezApi.swapSplitPanes();
      if (item.commandId === 'cmd_devtools') window.vibezApi.openDevTools();
      if (item.commandId === 'cmd_toggle_shield' && currentShield.domain) {
        window.vibezApi.toggleShield(currentShield.domain);
      }
    }
  }

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
  if (btnAddWorkspace) {
    btnAddWorkspace.addEventListener('click', () => {
      if (workspaceDropdown) workspaceDropdown.style.display = 'none';
      workspaceModal.style.display = 'flex';
      wsNameInput.value = '';
      wsNameInput.focus();
    });
  }

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
    const icon = wsIconInput.value.trim() || name.charAt(0).toUpperCase() || 'W';
    if (name) {
      window.vibezApi.createWorkspace(name, icon, selectedWsColor);
      workspaceModal.style.display = 'none';
    }
  });

  // --------------------------------------------------------------------------
  // AI Research Assistant Drawer (Duck.ai / Firefox style)
  // --------------------------------------------------------------------------
  const aiDrawer = document.getElementById('ai-drawer');
  const btnCloseAi = document.getElementById('btn-close-ai');
  const btnAiSummarize = document.getElementById('btn-ai-summarize');
  const btnAiCompare = document.getElementById('btn-ai-compare');
  const aiContentArea = document.getElementById('ai-content-area');
  const aiQueryInput = document.getElementById('ai-query-input');
  const btnAiSend = document.getElementById('btn-ai-send');

  function toggleAiDrawer() {
    const isShown = aiDrawer.style.display === 'flex';
    aiDrawer.style.display = isShown ? 'none' : 'flex';
    if (!isShown) {
      libraryDrawer.style.display = 'none';
    }
  }

  btnAiAssistant.addEventListener('click', toggleAiDrawer);
  btnCloseAi.addEventListener('click', () => { aiDrawer.style.display = 'none'; });

  btnAiSummarize.addEventListener('click', async () => {
    btnAiSummarize.classList.add('active');
    btnAiCompare.classList.remove('active');
    aiContentArea.innerHTML = '<div class="ai-welcome-box"><p>Extracting and synthesizing page content...</p></div>';

    const res = await window.vibezApi.aiSummarizeActivePage();
    if (!res || !res.summary) {
      aiContentArea.innerHTML = '<div class="ai-welcome-box"><p>Unable to extract text from this page.</p></div>';
      return;
    }

    aiContentArea.innerHTML = `
      <div class="ai-summary-card">
        <h4>Executive Summary</h4>
        <p>${res.summary}</p>
        ${res.keyTakeaways && res.keyTakeaways.length > 0 ? `
          <h4 style="margin-top: 10px;">Key Takeaways</h4>
          ${res.keyTakeaways.map(t => `<div class="ai-takeaway-item">${t}</div>`).join('')}
        ` : ''}
        ${res.citations && res.citations.length > 0 ? `
          <div class="ai-citation-tag">${res.citations[0].label}: ${res.citations[0].excerpt.slice(0, 70)}...</div>
        ` : ''}
      </div>
    `;
  });

  btnAiCompare.addEventListener('click', async () => {
    btnAiCompare.classList.add('active');
    btnAiSummarize.classList.remove('active');
    aiContentArea.innerHTML = '<div class="ai-welcome-box"><p>Comparing active workspace tabs...</p></div>';

    const res = await window.vibezApi.aiCompareWorkspaceTabs();
    if (!res || !res.sources || res.sources.length === 0) {
      aiContentArea.innerHTML = '<div class="ai-welcome-box"><p>Open 2 or more tabs in this workspace to compare them.</p></div>';
      return;
    }

    aiContentArea.innerHTML = `
      <div class="ai-summary-card">
        <h4>Cross-Tab Synthesis (${res.totalSources} Tabs)</h4>
        <p class="muted-text">${res.overview}</p>
        <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
          ${res.sources.map(s => `
            <div style="background: var(--fx-surface); padding: 8px; border-radius: 4px;">
              <strong style="color: var(--fx-text-primary); font-size: 11px;">${s.title}</strong>
              <div class="muted-text">Focus: ${s.coreFocus} (${s.wordCount} words)</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  async function handleAiQuestion() {
    const q = aiQueryInput.value.trim();
    if (!q) return;
    aiQueryInput.value = '';

    aiContentArea.insertAdjacentHTML('beforeend', `
      <div style="background: rgba(0, 96, 223, 0.15); border-left: 2px solid var(--fx-blue); padding: 8px 10px; border-radius: 4px; font-size: 12px; margin-top: 6px;">
        <strong>Q:</strong> ${q}
      </div>
      <div id="ai-loading-answer" class="muted-text" style="padding: 4px 10px;">Analyzing text passages...</div>
    `);
    aiContentArea.scrollTop = aiContentArea.scrollHeight;

    const res = await window.vibezApi.aiAskQuestion(q);
    const loadingEl = document.getElementById('ai-loading-answer');
    if (loadingEl) loadingEl.remove();

    aiContentArea.insertAdjacentHTML('beforeend', `
      <div class="ai-summary-card" style="margin-top: 6px;">
        <p><strong>A:</strong> ${res.answer}</p>
        ${res.citations && res.citations.length > 0 ? `
          <div class="ai-citation-tag">Cited: "${res.citations[0].quote.slice(0, 65)}..."</div>
        ` : ''}
      </div>
    `);
    aiContentArea.scrollTop = aiContentArea.scrollHeight;
  }

  btnAiSend.addEventListener('click', handleAiQuestion);
  aiQueryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAiQuestion();
  });

  // --------------------------------------------------------------------------
  // Smart Library Drawer
  // --------------------------------------------------------------------------
  const libraryDrawer = document.getElementById('library-drawer');
  const btnCloseLibrary = document.getElementById('btn-close-library');
  const librarySearchInput = document.getElementById('library-search-input');
  const libraryItemsContainer = document.getElementById('library-items-container');
  const btnSaveLibrary = document.getElementById('btn-save-library');

  function toggleLibraryDrawer() {
    const isShown = libraryDrawer.style.display === 'flex';
    libraryDrawer.style.display = isShown ? 'none' : 'flex';
    if (!isShown) {
      aiDrawer.style.display = 'none';
      loadLibraryItems();
    }
  }

  btnLibrary.addEventListener('click', toggleLibraryDrawer);
  btnCloseLibrary.addEventListener('click', () => { libraryDrawer.style.display = 'none'; });

  async function loadLibraryItems(query = '') {
    const items = query ? await window.vibezApi.searchLibrary(query) : (await window.vibezApi.getLibraryItems()).items;
    libraryItemsContainer.innerHTML = '';
    if (!items || items.length === 0) {
      libraryItemsContainer.innerHTML = '<div class="muted-text" style="text-align: center; padding: 20px;">No saved library items</div>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'lib-card';
      card.innerHTML = `
        <div class="lib-card-title">${item.title}</div>
        <div class="lib-card-excerpt">${item.excerpt || item.notes || item.url}</div>
        <div class="lib-card-meta">
          <span>${new Date(item.createdAt).toLocaleDateString()}</span>
          <button class="btn-del-item" title="Delete excerpt">
            <span class="del-icon-slot"></span>
          </button>
        </div>
      `;

      const delSlot = card.querySelector('.del-icon-slot');
      if (delSlot && typeof ICONS !== 'undefined' && ICONS.trash) {
        delSlot.innerHTML = ICONS.trash;
      } else if (delSlot) {
        delSlot.textContent = 'x';
      }

      card.querySelector('.btn-del-item').addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.vibezApi.deleteLibraryItem(item.id);
        loadLibraryItems(librarySearchInput.value);
      });

      card.addEventListener('click', () => {
        if (item.url) window.vibezApi.navigate(item.url);
      });

      libraryItemsContainer.appendChild(card);
    });
  }

  librarySearchInput.addEventListener('input', (e) => {
    loadLibraryItems(e.target.value);
  });

  if (btnSaveLibrary) {
    btnSaveLibrary.addEventListener('click', async () => {
      if (currentActiveTab) {
        await window.vibezApi.saveLibraryItem({
          title: currentActiveTab.title || 'Saved Page',
          url: currentActiveTab.url || '',
          excerpt: `Bookmarked from ${currentActiveTab.title}`,
          notes: `Saved on ${new Date().toLocaleString()}`,
          tags: ['web']
        });
        showShellToast('Page saved to library');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Automations Rule Engine
  // --------------------------------------------------------------------------
  const automationsModal = document.getElementById('automations-modal');
  const btnCloseRules = document.getElementById('btn-close-rules');
  const rulesListContainer = document.getElementById('rules-list-container');
  const ruleNameInput = document.getElementById('rule-name-input');
  const rulePatternInput = document.getElementById('rule-pattern-input');
  const ruleWsSelect = document.getElementById('rule-ws-select');
  const btnSaveNewRule = document.getElementById('btn-save-new-rule');
  const automationToast = document.getElementById('automation-toast');
  const automationToastText = document.getElementById('automation-toast-text');

  async function openAutomationsModal() {
    automationsModal.style.display = 'flex';
    populateWorkspaceSelect();
    loadAutomationRules();
  }

  function populateWorkspaceSelect() {
    ruleWsSelect.innerHTML = '';
    currentWorkspaces.forEach(ws => {
      const opt = document.createElement('option');
      opt.value = ws.id;
      opt.textContent = `${ws.name}`;
      ruleWsSelect.appendChild(opt);
    });
  }

  async function loadAutomationRules() {
    const rules = await window.vibezApi.getAutomationRules();
    rulesListContainer.innerHTML = '';
    rules.forEach(rule => {
      const item = document.createElement('div');
      item.className = 'rule-item';
      item.innerHTML = `
        <div>
          <div class="rule-name">${rule.name}</div>
          <div class="rule-pattern">Regex: <code>${rule.pattern}</code> → Workspace: <strong>${rule.targetWorkspaceId}</strong></div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <label class="switch">
            <input type="checkbox" ${rule.enabled ? 'checked' : ''} class="rule-toggle-switch">
            <span class="slider round"></span>
          </label>
          <button class="btn-del-item btn-del-rule">x</button>
        </div>
      `;

      item.querySelector('.rule-toggle-switch').addEventListener('change', async () => {
        await window.vibezApi.toggleAutomationRule(rule.id);
      });

      item.querySelector('.btn-del-rule').addEventListener('click', async () => {
        await window.vibezApi.deleteAutomationRule(rule.id);
        loadAutomationRules();
      });

      rulesListContainer.appendChild(item);
    });
  }

  btnCloseRules.addEventListener('click', () => { automationsModal.style.display = 'none'; });

  btnSaveNewRule.addEventListener('click', async () => {
    const name = ruleNameInput.value.trim();
    const pattern = rulePatternInput.value.trim();
    const targetWs = ruleWsSelect.value;

    if (name && pattern && targetWs) {
      await window.vibezApi.addAutomationRule(name, pattern, targetWs);
      ruleNameInput.value = '';
      rulePatternInput.value = '';
      loadAutomationRules();
    }
  });

  window.vibezApi.onAutomationTriggered(({ message }) => {
    automationToastText.textContent = message;
    automationToast.style.display = 'block';
    setTimeout(() => { automationToast.style.display = 'none'; }, 3500);
  });

  // --------------------------------------------------------------------------
  // Focus Sessions
  // --------------------------------------------------------------------------
  const focusModal = document.getElementById('focus-modal');
  const btnCloseFocus = document.getElementById('btn-close-focus');
  const focusPill = document.getElementById('focus-pill');
  const focusTimeLabel = document.getElementById('focus-time-label');
  const btnStartFocus = document.getElementById('btn-start-focus');
  const btnStopFocus = document.getElementById('btn-stop-focus');
  let selectedFocusMinutes = 25;

  document.querySelectorAll('.btn-duration').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-duration').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedFocusMinutes = parseInt(btn.dataset.minutes);
    });
  });

  btnFocus.addEventListener('click', () => { focusModal.style.display = 'flex'; });
  btnCloseFocus.addEventListener('click', () => { focusModal.style.display = 'none'; });

  btnStartFocus.addEventListener('click', async () => {
    focusModal.style.display = 'none';
    const status = await window.vibezApi.startFocusSession(selectedFocusMinutes);
    updateFocusUI(status);
  });

  btnStopFocus.addEventListener('click', async () => {
    const status = await window.vibezApi.stopFocusSession();
    updateFocusUI(status);
  });

  function updateFocusUI(status) {
    if (status.isActive) {
      focusPill.style.display = 'flex';
      focusTimeLabel.textContent = status.formattedTime || '25:00';
      btnStartFocus.style.display = 'none';
      btnStopFocus.style.display = 'block';
    } else {
      focusPill.style.display = 'none';
      btnStartFocus.style.display = 'block';
      btnStopFocus.style.display = 'none';
    }
  }

  window.vibezApi.onFocusUpdate((status) => {
    updateFocusUI(status);
  });

  // --------------------------------------------------------------------------
  // Find in Page (Ctrl+F)
  // --------------------------------------------------------------------------
  const findBox = document.getElementById('find-box');
  const findInput = document.getElementById('find-input');
  const findCount = document.getElementById('find-count');
  const btnFindPrev = document.getElementById('btn-find-prev');
  const btnFindNext = document.getElementById('btn-find-next');
  const btnFindClose = document.getElementById('btn-find-close');

  function openFindBox() {
    if (!findBox) return;
    findBox.style.display = 'flex';
    findInput.focus();
    findInput.select();
    if (findInput.value.trim()) {
      window.vibezApi.findInPage(findInput.value.trim(), true, false);
    }
  }

  function closeFindBox() {
    if (!findBox) return;
    findBox.style.display = 'none';
    window.vibezApi.stopFindInPage('clearSelection');
  }

  if (btnFindClose) btnFindClose.addEventListener('click', closeFindBox);

  if (findInput) {
    let findTimer = null;
    findInput.addEventListener('input', () => {
      clearTimeout(findTimer);
      findTimer = setTimeout(() => {
        const text = findInput.value.trim();
        if (text) {
          window.vibezApi.findInPage(text, true, false);
        } else {
          if (findCount) findCount.textContent = '0/0';
          window.vibezApi.stopFindInPage('clearSelection');
        }
      }, 100);
    });

    findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = findInput.value.trim();
        if (text) {
          window.vibezApi.findInPage(text, !e.shiftKey, true);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeFindBox();
      }
    });
  }

  if (btnFindNext) {
    btnFindNext.addEventListener('click', () => {
      const text = findInput.value.trim();
      if (text) window.vibezApi.findInPage(text, true, true);
    });
  }

  if (btnFindPrev) {
    btnFindPrev.addEventListener('click', () => {
      const text = findInput.value.trim();
      if (text) window.vibezApi.findInPage(text, false, true);
    });
  }

  window.vibezApi.onFoundInPageResult((result) => {
    if (!findCount) return;
    const { activeMatchOrdinal, matches } = result;
    findCount.textContent = matches > 0 ? `${activeMatchOrdinal}/${matches}` : '0/0';
  });

  // --------------------------------------------------------------------------
  // Downloads Manager & Flyout
  // --------------------------------------------------------------------------
  const btnDownloads = document.getElementById('btn-downloads');
  const downloadsDropdown = document.getElementById('downloads-dropdown');
  const downloadsList = document.getElementById('downloads-list');
  const downloadsBadge = document.getElementById('downloads-badge');
  const btnClearDownloads = document.getElementById('btn-clear-downloads');

  const downloadsMap = new Map();

  if (btnDownloads && downloadsDropdown) {
    btnDownloads.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadsDropdown.style.display = downloadsDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (workspaceDropdown) workspaceDropdown.style.display = 'none';
      if (browserMenuDropdown) browserMenuDropdown.style.display = 'none';
      if (downloadsBadge) downloadsBadge.style.display = 'none';
    });
  }

  if (btnClearDownloads) {
    btnClearDownloads.addEventListener('click', () => {
      downloadsMap.clear();
      renderDownloads();
    });
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function renderDownloads() {
    if (!downloadsList) return;
    downloadsList.innerHTML = '';
    if (downloadsMap.size === 0) {
      downloadsList.innerHTML = '<div class="downloads-empty">No downloads yet</div>';
      return;
    }

    downloadsMap.forEach((dl) => {
      const item = document.createElement('div');
      item.className = 'download-item';
      const isDone = dl.state === 'completed';
      const isFailed = dl.state === 'cancelled' || dl.state === 'interrupted';

      item.innerHTML = `
        <div class="download-item-header">
          <span class="download-filename" title="${dl.filename}">${dl.filename}</span>
          <span class="download-status-badge">${isDone ? 'Completed' : (isFailed ? 'Failed' : `${dl.percent}%`)}</span>
        </div>
        <div class="download-progress-track">
          <div class="download-progress-fill" style="width: ${isDone ? '100%' : (isFailed ? '0%' : `${dl.percent}%`)}; ${isFailed ? 'background: var(--fx-red);' : ''}"></div>
        </div>
        ${isDone && dl.savePath ? `
          <div class="download-item-actions">
            <button class="btn-download-action btn-open-file">Open</button>
            <button class="btn-download-action btn-show-folder">Show in folder</button>
          </div>
        ` : `
          <div style="font-size: 10px; color: var(--fx-text-muted);">${formatBytes(dl.receivedBytes)} / ${formatBytes(dl.totalBytes)}</div>
        `}
      `;

      const btnOpen = item.querySelector('.btn-open-file');
      if (btnOpen) {
        btnOpen.addEventListener('click', () => {
          window.vibezApi.openPath(dl.savePath);
        });
      }

      const btnFolder = item.querySelector('.btn-show-folder');
      if (btnFolder) {
        btnFolder.addEventListener('click', () => {
          window.vibezApi.showItemInFolder(dl.savePath);
        });
      }

      downloadsList.appendChild(item);
    });
  }

  window.vibezApi.onDownloadProgress((data) => {
    downloadsMap.set(data.id, data);
    if (downloadsBadge) downloadsBadge.style.display = 'block';
    renderDownloads();
  });

  window.vibezApi.onDownloadComplete((data) => {
    const existing = downloadsMap.get(data.id) || {};
    downloadsMap.set(data.id, { ...existing, ...data });
    renderDownloads();
    showShellToast(`Download complete: ${data.filename}`);
  });

  // --------------------------------------------------------------------------
  // Page Zoom Controls & Toast
  // --------------------------------------------------------------------------
  const zoomBadge = document.getElementById('zoom-badge');
  let zoomBadgeTimer = null;

  window.vibezApi.onZoomChanged((data) => {
    if (!zoomBadge) return;
    zoomBadge.textContent = `${data.level}%`;
    zoomBadge.style.display = 'block';
    zoomBadge.style.opacity = '1';
    clearTimeout(zoomBadgeTimer);
    zoomBadgeTimer = setTimeout(() => {
      zoomBadge.style.opacity = '0';
      setTimeout(() => { zoomBadge.style.display = 'none'; }, 300);
    }, 1200);
  });

  // --------------------------------------------------------------------------
  // Global Keyboard Shortcuts
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // Find in Page (Ctrl+F)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      openFindBox();
    }
    // Reopen Closed Tab (Ctrl+Shift+T)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      window.vibezApi.reopenClosedTab();
    }
    // Page Zoom Controls
    if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      window.vibezApi.zoomIn();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
      e.preventDefault();
      window.vibezApi.zoomOut();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      window.vibezApi.zoomReset();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      toggleAiDrawer();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      toggleLibraryDrawer();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      openAutomationsModal();
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandModal.style.display === 'flex' ? closeCommandCenter() : openCommandCenter();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
      e.preventDefault();
      window.vibezApi.toggleSplitView();
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      window.vibezApi.createTab();
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if (currentActiveTab) window.vibezApi.closeTab(currentActiveTab.id);
    }
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key) - 1;
      if (currentWorkspaces[idx]) {
        e.preventDefault();
        window.vibezApi.switchWorkspace(currentWorkspaces[idx].id);
      }
    }
    // Ctrl + H -> History
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      window.vibezApi.createTab('vibez://history');
    }
    // Ctrl + B -> Bookmarks / Library
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      window.vibezApi.createTab('vibez://library');
    }
    // Ctrl + , -> Settings
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === ',') {
      e.preventDefault();
      window.vibezApi.createTab('vibez://settings');
    }
    if (e.key === 'Escape') {
      closeFindBox();
      hideOmniboxSuggestions();
      if (downloadsDropdown) downloadsDropdown.style.display = 'none';
      closeCommandCenter();
      shieldModal.style.display = 'none';
      workspaceModal.style.display = 'none';
      automationsModal.style.display = 'none';
      focusModal.style.display = 'none';
      aiDrawer.style.display = 'none';
      libraryDrawer.style.display = 'none';
      if (workspaceDropdown) workspaceDropdown.style.display = 'none';
      if (browserMenuDropdown) browserMenuDropdown.style.display = 'none';
    }
  });
});
