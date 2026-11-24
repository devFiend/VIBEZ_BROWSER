/**
 * Local JSON file store for Vibez Browser.
 * Handles atomic reads and writes for history, bookmarks, workspaces, and settings.
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class LocalStore {
  constructor(name = 'vibez_data') {
    const userDataPath = app ? app.getPath('userData') : path.join(process.cwd(), '.data');
    this.dir = path.join(userDataPath, 'storage');
    this.filePath = path.join(this.dir, `${name}.json`);
    this.data = {};

    this._init();
  }

  _init() {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
        this._write();
      }
    } catch (e) {
      console.error(`[LocalStore] Failed to initialize ${this.filePath}:`, e);
      this.data = {};
    }
  }

  _write() {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (e) {
      console.error(`[LocalStore] Failed to write ${this.filePath}:`, e);
    }
  }

  get(key, defaultValue = null) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  set(key, value) {
    this.data[key] = value;
    this._write();
  }

  delete(key) {
    delete this.data[key];
    this._write();
  }
}

module.exports = { LocalStore };
