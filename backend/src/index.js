const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Robust CORS configuration ──────────────────────────────
// Allows local Next.js servers (any localhost port), Vercel deployments, and official custom domain
const allowedOrigins = [
  'https://abyssholding.com',
  'https://www.abyssholding.com',
  'https://abyssholdings.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow any localhost origin (e.g. localhost:3000, localhost:3001, etc.)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow configured origins and Vercel domains
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Default allow for development flexibility
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/services',  require('./routes/services'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/company',   require('./routes/company'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/contact',   require('./routes/contact'));

// Health check
app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));

// Global error handler so the server NEVER crashes on uncaught route errors
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Abyss Holdings API running on http://localhost:${PORT}`);
  console.log(`   Admin username: ${process.env.ADMIN_USERNAME || 'admin'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
