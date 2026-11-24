/**
 * Vibez Browser — Library Page Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const libraryGrid = document.getElementById('library-grid');
  const librarySearch = document.getElementById('library-search');
  const libraryCount = document.getElementById('library-count');

  async function loadLibrary(query = '') {
    if (!window.vibezApi || !window.vibezApi.getLibraryItems) return;

    const data = query ? { items: await window.vibezApi.searchLibrary(query) } : await window.vibezApi.getLibraryItems();
    const items = data.items || [];
    libraryGrid.innerHTML = '';
    libraryCount.textContent = `${items.length} items`;

    if (!items || items.length === 0) {
      libraryGrid.innerHTML = '<div class="empty-state">No saved bookmarks or research excerpts</div>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'lib-card-full';
      card.innerHTML = `
        <div class="card-title">${item.title}</div>
        <div class="card-excerpt">${item.excerpt || item.notes || item.url}</div>
        <div class="card-footer">
          <span>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
          <button class="btn-del-card" title="Delete">✕</button>
        </div>
      `;

      card.querySelector('.btn-del-card').addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.vibezApi.deleteLibraryItem(item.id);
        loadLibrary(librarySearch.value);
      });

      card.addEventListener('click', () => {
        if (item.url) window.location.href = item.url;
      });

      libraryGrid.appendChild(card);
    });
  }

  librarySearch.addEventListener('input', (e) => {
    loadLibrary(e.target.value);
  });

  loadLibrary();
});
