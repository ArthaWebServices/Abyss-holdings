const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');
const BACKUP_PATH = path.join(__dirname, '../data/db.backup.json');

const DEFAULT_COMPANY = {
  name: "Abyss Holdings",
  tagline: "Group of Companies",
  description: "A diversified group of companies driving innovation across 7 core industry sectors — from investments and construction to realities, technology, automobiles, earth movers, and apparels.",
  email: "Admin@abyssholding.com",
  hrEmail: "HR@abyssholding.com",
  phone: "+91 22 1234 5678",
  address: "Mumbai Office (Headquarters), Maharashtra, India",
  website: "abyssholding.com",
  primaryColor: "#E84545",
  secondaryColor: "#1a1a2e",
  logoUrl: "",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com"
  }
};

const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { company: DEFAULT_COMPANY, services: [], locations: [], projects: [], messages: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.company) {
      data.company = DEFAULT_COMPANY;
    }
    return data;
  } catch (err) {
    console.error('[db.json read error]', err);
    throw new Error('Database read failed: ' + err.message);
  }
};

// Atomic write with automated safety backup
const writeDB = (data) => {
  const tmpPath = DB_PATH + '.tmp';
  try {
    // 1. Maintain a persistent safety backup before writing
    if (fs.existsSync(DB_PATH)) {
      try {
        fs.copyFileSync(DB_PATH, BACKUP_PATH);
      } catch (backupErr) {
        console.warn('[db.json] Non-critical backup warning:', backupErr.message);
      }
    }

    // 2. Atomic write to temporary file
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');

    // 3. Rename atomic swap
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('[db.json write error]', err);
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    throw new Error('Database write failed: ' + err.message);
  }
};

module.exports = { readDB, writeDB, DEFAULT_COMPANY, DB_PATH, BACKUP_PATH };
