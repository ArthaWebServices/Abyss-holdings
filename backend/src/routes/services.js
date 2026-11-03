const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const router = express.Router();

// GET /api/services  (public)
router.get('/', (req, res) => {
  const db = readDB();
  const services = db.services
    .filter(s => s.active)
    .sort((a, b) => a.order - b.order);
  res.json(services);
});

// GET /api/services/all  (admin – includes inactive)
router.get('/all', authenticate, (req, res) => {
  const db = readDB();
  res.json(db.services.sort((a, b) => a.order - b.order));
});

// POST /api/services  (admin)
router.post('/', authenticate, (req, res) => {
  const db = readDB();
  const { title, description, imageUrl, order, active = true } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'title and description required' });
  const service = {
    id: uuidv4(),
    title, description,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    order: order ?? db.services.length + 1,
    active,
  };
  db.services.push(service);
  writeDB(db);
  res.status(201).json(service);
});

// PUT /api/services/:id  (admin)
router.put('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.services.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  db.services[idx] = { ...db.services[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.services[idx]);
});

// DELETE /api/services/:id  (admin)
router.delete('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.services.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  db.services.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;

