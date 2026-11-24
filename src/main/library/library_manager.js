/**
 * Smart Library 2.0 for Vibez Browser V2.
 * Stores research excerpts, curated collections, notes, and metadata
 * with local search and cross-referencing capabilities.
 */

const crypto = require('crypto');

class LibraryManager {
  constructor(store) {
    this.store = store;
    this.collections = [];
    this.items = [];

    this._load();
  }

  _generateId(prefix = 'lib') {
    return `${prefix}_${crypto.randomBytes(4).toString('hex')}`;
  }

  _load() {
    const saved = this.store ? this.store.get('library_data') : null;
    if (saved && Array.isArray(saved.items)) {
      this.items = saved.items;
      this.collections = saved.collections || [];
    } else {
      // Default Starter Collections
      this.collections = [
        { id: 'col_general', name: 'General Research', icon: '📚' },
        { id: 'col_dev', name: 'Code Snippets & Docs', icon: '💻' }
      ];
      this.items = [
        {
          id: 'item_welcome',
          collectionId: 'col_general',
          title: 'Welcome to Vibez Smart Library',
          url: 'https://github.com/devFiend/VIBEZ_BROWSER',
          excerpt: 'Save excerpts, research summaries, and key findings directly from any website.',
          notes: 'Organize research collections without tab clutter.',
          tags: ['research', 'getting-started'],
          createdAt: Date.now()
        }
      ];
      this.save();
    }
  }

  save() {
    if (this.store) {
      this.store.set('library_data', {
        collections: this.collections,
        items: this.items
      });
    }
  }

  getCollections() {
    return this.collections;
  }

  createCollection(name, icon = '📁') {
    const col = {
      id: this._generateId('col'),
      name: name.trim() || 'Untitled Collection',
      icon: icon || '📁'
    };
    this.collections.push(col);
    this.save();
    return col;
  }

  getItems(collectionId = null) {
    if (collectionId) {
      return this.items.filter(i => i.collectionId === collectionId);
    }
    return this.items;
  }

  saveItem({ title, url, excerpt, notes, tags = [], collectionId = 'col_general' }) {
    const item = {
      id: this._generateId('item'),
      collectionId: collectionId || 'col_general',
      title: title || 'Saved Item',
      url: url || '',
      excerpt: excerpt || '',
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : [],
      createdAt: Date.now()
    };

    this.items.unshift(item);
    this.save();
    return item;
  }

  deleteItem(itemId) {
    const idx = this.items.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  search(query) {
    if (!query || !query.trim()) return this.items;
    const q = query.toLowerCase().trim();

    return this.items.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }
}

module.exports = { LibraryManager };
