/**
 * Vibez Browser — History Page Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const historyList = document.getElementById('history-list');
  const historySearch = document.getElementById('history-search');
  const historyCount = document.getElementById('history-count');
  const btnClearHistory = document.getElementById('btn-clear-history');

  async function loadHistory(query = '') {
    if (!window.vibezApi || !window.vibezApi.getHistory) return;

    const entries = query ? await window.vibezApi.searchHistory(query) : await window.vibezApi.getHistory();
    historyList.innerHTML = '';
    historyCount.textContent = `${entries.length} items`;

    if (!entries || entries.length === 0) {
      historyList.innerHTML = '<div class="empty-state">No browsing history found</div>';
      return;
    }

    entries.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';
      const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';

      el.innerHTML = `
        <div class="item-main">
          <div class="item-title">${item.title || item.url}</div>
          <div class="item-url">${item.url}</div>
        </div>
        <div class="item-meta">
          <span class="item-time">${dateStr} ${timeStr}</span>
          <button class="btn-delete-entry" title="Delete from history">✕</button>
        </div>
      `;

      el.querySelector('.btn-delete-entry').addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.vibezApi.deleteHistoryEntry(item.id);
        loadHistory(historySearch.value);
      });

      el.addEventListener('click', () => {
        window.location.href = item.url;
      });

      historyList.appendChild(el);
    });
  }

  historySearch.addEventListener('input', (e) => {
    loadHistory(e.target.value);
  });

  btnClearHistory.addEventListener('click', async () => {
    if (confirm('Clear all browsing history?')) {
      await window.vibezApi.clearHistory();
      loadHistory();
    }
  });

  loadHistory();
});
