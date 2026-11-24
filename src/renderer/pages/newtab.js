/**
 * Vibez Browser — New Tab Controller (Firefox & DuckDuckGo inspired)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Populate SVG icons
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

  // Search execution
  const searchInput = document.getElementById('search-input');
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

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeSearch(searchInput.value);
      }
    });
  }

  if (btnCamera) {
    btnCamera.addEventListener('click', () => {
      searchInput.placeholder = 'Paste image URL or search terms...';
      searchInput.focus();
    });
  }

  if (btnMic) {
    btnMic.addEventListener('click', () => {
      searchInput.placeholder = 'Listening... Speak your query';
      setTimeout(() => {
        searchInput.placeholder = 'Search Google or enter address';
      }, 3000);
    });
  }

  // Hotkey: "/" focuses search bar
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Add Shortcut Tile Modal
  const btnAddTile = document.getElementById('btn-add-tile');
  const addTileModal = document.getElementById('add-tile-modal');
  const btnCloseTileModal = document.getElementById('btn-close-tile-modal');
  const btnCancelTile = document.getElementById('btn-cancel-tile');
  const btnSaveTile = document.getElementById('btn-save-tile');
  const tileNameInput = document.getElementById('tile-name-input');
  const tileUrlInput = document.getElementById('tile-url-input');
  const speedDialGrid = document.getElementById('speed-dial-grid');

  if (btnAddTile && addTileModal) {
    btnAddTile.addEventListener('click', () => {
      tileNameInput.value = '';
      tileUrlInput.value = '';
      addTileModal.style.display = 'flex';
      tileNameInput.focus();
    });

    const closeModal = () => { addTileModal.style.display = 'none'; };
    if (btnCloseTileModal) btnCloseTileModal.addEventListener('click', closeModal);
    if (btnCancelTile) btnCancelTile.addEventListener('click', closeModal);

    addTileModal.addEventListener('click', (e) => {
      if (e.target === addTileModal) closeModal();
    });

    if (btnSaveTile) {
      btnSaveTile.addEventListener('click', () => {
        const name = tileNameInput.value.trim();
        let url = tileUrlInput.value.trim();
        if (!name || !url) return;

        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }

        const newCard = document.createElement('a');
        newCard.className = 'shortcut-card';
        newCard.href = url;
        newCard.innerHTML = `
          <div class="shortcut-icon" style="background: #3B82F6;">
            ${name.slice(0, 2).toUpperCase()}
          </div>
          <span class="shortcut-label">${name}</span>
        `;

        speedDialGrid.insertBefore(newCard, btnAddTile);
        closeModal();
      });
    }
  }
});
