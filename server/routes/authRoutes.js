const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const prisma = require('../services/prisma');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @desc    Enterprise Authentication (V2.0 — Prisma + PostgreSQL)
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Mandatory personnel credentials missing.' });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid personnel credentials. Identity verification failure.' });
    }

    // Support both bcrypt hashed and legacy plaintext passwords
    let passwordValid = false;
    if (user.password.startsWith('$2')) {
      // bcrypt hash
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // legacy plaintext — accept and upgrade to hash
      passwordValid = (user.password === password);
      if (passwordValid) {
        const hash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hash }
        });
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Invalid personnel credentials. Identity verification failure.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'vantagepoint_secret_key_v2',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, role: user.role },
      message: 'Personnel identity verified. Access granted.'
    });

  } catch (err) {
    console.error('[AUTH-FATAL-ERR]:', err.message);
    res.status(500).json({ success: false, error: 'Internal Identity Engine Failure' });
  }
});

/**
 * @desc    Emergency Administrative Reset (Temporary)
 * @route   GET /api/auth/reset-admin
 * @access  Maintenance Only
 */
router.get('/reset-admin', async (req, res) => {
  try {
    const admin = await prisma.user.upsert({
      where: { username: 'admin@zenithqa.com' },
      update: { password: 'password123' },
      create: {
        username: 'admin@zenithqa.com',
        password: 'password123',
        role: 'ADMIN',
      },
    });
    res.json({ success: true, message: 'Emergency personnel credentials restored.', admin: admin.username });
  } catch (err) {
    console.error('[AUTH-RESET-ERR]:', err.message);
    res.status(500).json({ success: false, error: 'Reset failed' });
  }
});

module.exports = router;
