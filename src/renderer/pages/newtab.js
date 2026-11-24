/**
 * Vibez Browser — New Tab Controller
 * Search, speed dial, category filtering, greeting, shortcuts modal.
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

  // Dynamic Greeting
  const greetingEl = document.getElementById('greeting-text');
  if (greetingEl) {
    const hour = new Date().getHours();
    if (hour < 12) greetingEl.textContent = 'Good morning';
    else if (hour < 17) greetingEl.textContent = 'Good afternoon';
    else greetingEl.textContent = 'Good evening';
  }

  // Search
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

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeSearch(searchInput.value);
    }
  });

  btnCamera.addEventListener('click', () => {
    searchInput.placeholder = 'Paste image URL or search keywords...';
    searchInput.focus();
  });

  btnMic.addEventListener('click', () => {
    searchInput.placeholder = 'Listening... Speak your search query';
    setTimeout(() => {
      searchInput.placeholder = 'Search Google or type a URL';
    }, 3000);
  });

  // Hotkey: "/" focuses search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Category Pill Filtering
  const categoryPills = document.querySelectorAll('.category-pill');
  const storyCards = document.querySelectorAll('.discover-card');

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

  // Click story cards to search
  storyCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.card-title')?.textContent || 'news';
      executeSearch(title);
    });
  });

  // Add Tile Modal
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

    const newCard = document.createElement('a');
    newCard.className = 'shortcut-tile';
    newCard.href = url;
    newCard.innerHTML = `
      <div class="tile-icon" style="background: #374151; color: #fff; font-weight: 700; font-size: 16px;">
        ${name.charAt(0).toUpperCase()}
      </div>
      <span class="tile-name">${name}</span>
    `;

    speedDialGrid.insertBefore(newCard, btnAddTile);
    addTileModal.style.display = 'none';
  });
});
