const express = require('express');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const router = express.Router();

// GET /api/company  (public)
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.company);
});

// PUT /api/company  (admin)
router.put('/', authenticate, (req, res) => {
  const db = readDB();
  db.company = { ...db.company, ...req.body };
  writeDB(db);
  res.json(db.company);
});

module.exports = router;

