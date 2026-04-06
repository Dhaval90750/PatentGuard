const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../config/db');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @desc    Enterprise Authentication (V2.0 — bcrypt + rate limiting)
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Mandatory personnel credentials missing.' });
    }

    const users = db.get('users');
    const user = users.find(u => u.username === username);

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
        db.update('users', user.id, { password: hash });
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

module.exports = router;
