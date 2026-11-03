const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const router = express.Router();

// POST /api/contact  (public – submit message)
router.post('/', (req, res) => {
  const db = readDB();
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'name, email and message are required' });
  const msg = {
    id: uuidv4(), name, email,
    phone: phone || '',
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.messages.push(msg);
  writeDB(db);
  res.status(201).json({ message: 'Message sent successfully' });
});

// GET /api/contact/messages  (admin)
router.get('/messages', authenticate, (req, res) => {
  const db = readDB();
  res.json(db.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// PATCH /api/contact/messages/:id/read  (admin)
router.patch('/messages/:id/read', authenticate, (req, res) => {
  const db = readDB();
  const msg = db.messages.find(m => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  msg.read = true;
  writeDB(db);
  res.json(msg);
});

// DELETE /api/contact/messages/:id  (admin)
router.delete('/messages/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.messages.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  db.messages.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;

