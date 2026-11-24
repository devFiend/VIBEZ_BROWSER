/**
 * Controller for Vibez Browser Redesigned New Tab Dashboard.
 * Handles search queries, speed dial navigation & custom tiles,
 * category pill filtering for stories, and floating tools.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Populate SVG icons from icons.js
  function populateIcons() {
    if (typeof ICONS !== 'undefined') {
      document.querySelectorAll('[data-icon]').forEach(el => {
        const iconName = el.dataset.icon;
        if (ICONS[iconName]) {
          el.innerHTML = ICONS[iconName];
        }
      });
    }
  }
  populateIcons();

  // Search capsule elements
  const searchInput = document.getElementById('search-input');
  const btnSearchAction = document.getElementById('btn-search-action');
  const btnCamera = document.getElementById('btn-camera');
  const btnMic = document.getElementById('btn-mic');

  function executeSearch(query) {
    const trimmed = (query || '').trim();
    if (!trimmed) return;

    let targetUrl = trimmed;
    if (!/^https?:\/\//i.test(trimmed)) {
      if (trimmed.includes('.') && !trimmed.includes(' ')) {
        targetUrl = 'https://' + trimmed;
      } else {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
      }
    }

    window.location.href = targetUrl;
  }

  // Submit on Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeSearch(searchInput.value);
    }
  });

  // Submit on Coral Pill click
  btnSearchAction.addEventListener('click', () => {
    executeSearch(searchInput.value);
  });

  // Camera & Mic tools
  btnCamera.addEventListener('click', () => {
    searchInput.placeholder = 'Paste image URL or search keywords...';
    searchInput.focus();
  });

  btnMic.addEventListener('click', () => {
    searchInput.placeholder = 'Listening... Speak your search query';
    setTimeout(() => {
      searchInput.placeholder = 'What are you looking for today?';
    }, 3000);
  });

  // Hotkey: pressing '/' immediately focuses search capsule
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // --------------------------------------------------------------------------
  // Category Pill Filter for Top Stories
  // --------------------------------------------------------------------------
  const categoryPills = document.querySelectorAll('.category-pill');
  const storyCards = document.querySelectorAll('.story-card');

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCat = pill.dataset.category;
      storyCards.forEach(card => {
        if (selectedCat === 'all' || selectedCat === 'top') {
          card.style.display = 'flex';
        } else if (card.dataset.category === selectedCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Click on story cards to open articles
  storyCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.story-title')?.textContent || 'news';
      executeSearch(title);
    });
  });

  // --------------------------------------------------------------------------
  // Speed Dial Custom Tile Modal (+ Add)
  // --------------------------------------------------------------------------
  const btnAddTile = document.getElementById('btn-add-tile');
  const addTileModal = document.getElementById('add-tile-modal');
  const btnCloseTileModal = document.getElementById('btn-close-tile-modal');
  const btnSaveTile = document.getElementById('btn-save-tile');
  const tileNameInput = document.getElementById('tile-name-input');
  const tileUrlInput = document.getElementById('tile-url-input');
  const speedDialGrid = document.getElementById('speed-dial-grid');

  btnAddTile.addEventListener('click', () => {
    tileNameInput.value = '';
    tileUrlInput.value = '';
    addTileModal.style.display = 'flex';
    tileNameInput.focus();
  });

  btnCloseTileModal.addEventListener('click', () => {
    addTileModal.style.display = 'none';
  });

  addTileModal.addEventListener('click', (e) => {
    if (e.target === addTileModal) {
      addTileModal.style.display = 'none';
    }
  });

  btnSaveTile.addEventListener('click', () => {
    const name = tileNameInput.value.trim();
    let url = tileUrlInput.value.trim();
    if (!name || !url) return;

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Create new card element
    const newCard = document.createElement('a');
    newCard.className = 'dial-card';
    newCard.href = url;
    newCard.innerHTML = `
      <div class="dial-icon-circle" style="background: #272C3B; color: #fff; font-weight: 700; font-size: 16px;">
        ${name.charAt(0).toUpperCase()}
      </div>
      <span class="dial-label">${name}</span>
    `;

    speedDialGrid.insertBefore(newCard, btnAddTile);
    addTileModal.style.display = 'none';
  });

  // Floating Corner Buttons
  const btnFloatingChat = document.getElementById('btn-floating-chat');
  const btnFloatingCommunity = document.getElementById('btn-floating-community');

  btnFloatingChat.addEventListener('click', () => {
    // Notify parent frame or focus search
    searchInput.focus();
    searchInput.placeholder = 'Ask Vibez AI anything...';
  });

  btnFloatingCommunity.addEventListener('click', () => {
    window.location.href = 'https://github.com/devFiend/VIBEZ_BROWSER';
  });
});
