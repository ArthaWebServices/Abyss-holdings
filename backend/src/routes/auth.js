const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'abyss_holdings_super_secret_key_2024';

// Helper to fetch admin credentials securely from environment variables
const getAdminCredentials = () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  return { username, password };
};

// Rate limiter for brute-force protection
const loginAttempts = new Map(); // ip -> { count: number, resetAt: number }
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username: adminUser, password: adminPassword } = getAdminCredentials();

    // Guard: ensure server environment variables are configured
    if (!adminUser || !adminPassword) {
      console.error('[auth] ADMIN_USERNAME or ADMIN_PASSWORD is not set in environment variables');
      return res.status(500).json({
        error: 'Administrator credentials are not configured on the server. Please set ADMIN_USERNAME and ADMIN_PASSWORD.',
      });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Check rate limit status
    const tracker = loginAttempts.get(ip);
    if (tracker && tracker.resetAt > now && tracker.count >= MAX_ATTEMPTS) {
      const minutesLeft = Math.ceil((tracker.resetAt - now) / 60000);
      return res.status(429).json({
        error: `Too many failed login attempts. Please wait ${minutesLeft} minute(s) before trying again.`,
      });
    }

    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Secure verification against environment credentials
    const isUserMatch = username === adminUser;
    const isPassMatch = isUserMatch && (
      adminPassword.startsWith('$2')
        ? bcrypt.compareSync(password, adminPassword)
        : password === adminPassword
    );

    if (!isUserMatch || !isPassMatch) {
      // Record failed attempt
      const current = (tracker && tracker.resetAt > now) ? tracker.count + 1 : 1;
      loginAttempts.set(ip, { count: current, resetAt: now + LOCKOUT_WINDOW_MS });

      const remaining = Math.max(0, MAX_ATTEMPTS - current);
      return res.status(401).json({
        error: remaining > 0
          ? `Invalid username or password. (${remaining} attempt(s) remaining)`
          : 'Account locked due to consecutive failed attempts. Try again in 15 minutes.',
      });
    }

    // Success — reset rate limiter
    loginAttempts.delete(ip);

    const token = jwt.sign(
      { username: adminUser, role: 'admin' },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    return res.json({ token, username: adminUser, role: 'admin' });
  } catch (err) {
    console.error('[auth/login error]', err);
    return res.status(500).json({ error: 'Authentication service error: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authorization header provided' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ username: decoded.username, role: decoded.role });
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
});

module.exports = router;
