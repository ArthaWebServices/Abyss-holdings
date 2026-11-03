const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory admin (use env vars — no DB needed for single admin)
const ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  // bcrypt hash of "admin123"
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  if (username !== ADMIN.username || !bcrypt.compareSync(password, ADMIN.passwordHash))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { username: ADMIN.username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.json({ token, username: ADMIN.username, role: 'admin' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: decoded.username, role: decoded.role });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

