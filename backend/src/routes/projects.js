const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const router = express.Router();

// GET /api/projects  (public)
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.projects.sort((a, b) => a.order - b.order));
});

// POST /api/projects  (admin)
router.post('/', authenticate, (req, res) => {
  const db = readDB();
  const { title, description, imageUrl, category, status, year, order } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const project = {
    id: uuidv4(), title,
    description: description || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    category: category || 'General',
    status: status || 'Ongoing',
    year: year || new Date().getFullYear(),
    order: order ?? db.projects.length + 1,
  };
  db.projects.push(project);
  writeDB(db);
  res.status(201).json(project);
});

// PUT /api/projects/:id  (admin)
router.put('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  db.projects[idx] = { ...db.projects[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.projects[idx]);
});

// DELETE /api/projects/:id  (admin)
router.delete('/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  db.projects.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;

