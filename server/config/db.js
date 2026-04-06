const fs = require('fs');
const path = require('path');

/**
 * @desc    VantagePoint V3.0 Zero-Dependency Persistent DB
 * @purpose A high-performance JSON-based sync adapter for local stability.
 * @compliance 21 CFR Part 11 Sync Ready
 */
class FileSystemDB {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/database.json');
    this.ensureDirectory();
    this.memory = this.load();
  }

  ensureDirectory() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({
        patents: [],
        drugs: [],
        apis: [],
        documents: [],
        audit_logs: [],
        notifications: [],
        users: [
          { id: 'U1', username: 'admin@zenithqa.com', password: 'password', role: 'ADMIN' },
          { id: 'U2', username: 'legal@zenithqa.com', password: 'password', role: 'LEGAL' },
          { id: 'U3', username: 'rd@zenithqa.com', password: 'password', role: 'RD' }
        ]
      }, null, 2));
    }
  }

  load() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[DB-LOAD-FAIL]:', err.message);
      return {};
    }
  }

  save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.memory, null, 2));
    } catch (err) {
      console.error('[DB-SAVE-FAIL]:', err.message);
    }
  }

  // --- Collection Methods ---
  get(collection) { return this.memory[collection] || []; }
  
  find(collection, query = {}) {
    const data = this.get(collection);
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  insert(collection, item) {
    if (!this.memory[collection]) this.memory[collection] = [];
    this.memory[collection].push(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    const index = this.memory[collection].findIndex(i => (i.id === id || i._id === id));
    if (index !== -1) {
      this.memory[collection][index] = { ...this.memory[collection][index], ...updates, updated_at: new Date() };
      this.save();
      return this.memory[collection][index];
    }
    return null;
  }

  remove(collection, id) {
    const index = this.memory[collection].findIndex(i => (i.id === id || i._id === id));
    if (index !== -1) {
      this.memory[collection].splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }
}

const db = new FileSystemDB();
module.exports = db;
