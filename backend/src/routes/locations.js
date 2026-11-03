const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const router = express.Router();

// GET /api/locations  (public)
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.locations.sort((a, b) => a.order - b.order));
});

// POST /api/locations  (admin)
router.post('/', authenticate, (req, res) => {
  const db = readDB();
  const { country, city, address, phone, email, isHeadquarter = false, order } = req.body;
  if (!country || !city) return res.status(400).json({ error: 'country and city required' });
  const location = {
    id: uuidv4(),
    country, city, address: address || '',
    phone: phone || '', email: email || '',
    isHeadquarter,
    order: order ?? db.locations.length + 1,
  };
  db.locations.push(location);
  writeDB(db);
  res.status(201).json(location);
});

// PUT /api/locations/:id  (admin)
router.put('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.locations.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Location not found' });
  db.locations[idx] = { ...db.locations[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.locations[idx]);
});

// DELETE /api/locations/:id  (admin)
router.delete('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.locations.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Location not found' });
  db.locations.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;

