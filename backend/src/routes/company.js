const express = require('express');
const { authenticate } = require('../middleware/auth');
const { readDB, writeDB, DEFAULT_COMPANY } = require('../utils/db');
const router = express.Router();

// GET /api/company (public)
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const company = db.company || DEFAULT_COMPANY;
    res.json(company);
  } catch (err) {
    console.error('[GET /api/company error]', err);
    res.status(500).json({ error: 'Failed to read company details: ' + err.message });
  }
});

// PUT /api/company (admin authenticated)
router.put('/', authenticate, (req, res) => {
  try {
    const db = readDB();
    const existing = db.company || DEFAULT_COMPANY;
    const body = req.body || {};

    // Build cleanly merged company object
    const updated = { ...existing };

    // Update string fields safely if provided
    const stringKeys = [
      'name', 'tagline', 'description', 'email', 'hrEmail',
      'phone', 'address', 'website', 'primaryColor',
      'secondaryColor', 'logoUrl'
    ];

    for (const key of stringKeys) {
      if (body[key] !== undefined && body[key] !== null) {
        updated[key] = String(body[key]).trim();
      }
    }

    // Deep merge socialLinks safely
    if (body.socialLinks && typeof body.socialLinks === 'object') {
      updated.socialLinks = {
        ...(existing.socialLinks || {}),
        ...Object.fromEntries(
          Object.entries(body.socialLinks).map(([k, v]) => [k, v ? String(v).trim() : ''])
        ),
      };
    }

    // Save atomically to DB
    db.company = updated;
    writeDB(db);

    console.log(`[Admin] Successfully updated company details: "${updated.name}"`);
    return res.json({
      success: true,
      message: 'Company details updated successfully',
      company: updated
    });
  } catch (err) {
    console.error('[PUT /api/company error]', err);
    return res.status(500).json({
      error: 'Failed to save company details: ' + err.message
    });
  }
});

module.exports = router;
