const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const emailService = require('../services/emailService');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Fetch SMTP configuration (V2)
 */
router.get('/smtp', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const config = await prisma.smtpConfig.findFirst();
    if (!config) {
      return res.json({ success: true, data: null });
    }
    // Don't leak password in plain fetch (optional, but good for security)
    const safeConfig = { ...config, pass: config.pass ? '********' : '' };
    res.json({ success: true, data: safeConfig });
  } catch (err) {
    console.error('[SMTP-SETTINGS-FETCH-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Database Retrieval Failure' });
  }
});

/**
 * @desc    Update or create SMTP configuration
 */
router.post('/smtp', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { host, port, secure, user, pass, from } = req.body;

    if (!host || !port || !from) {
      return res.status(400).json({ success: false, error: 'Mandatory SMTP fields missing.' });
    }

    let config = await prisma.smtpConfig.findFirst();

    if (config) {
      config = await prisma.smtpConfig.update({
        where: { id: config.id },
        data: {
          host,
          port: parseInt(port),
          secure,
          user,
          pass: (pass && pass !== '********') ? pass : config.pass, // Only update if new password provided
          from,
        }
      });
    } else {
      config = await prisma.smtpConfig.create({
        data: {
          host,
          port: parseInt(port),
          secure,
          user,
          pass,
          from,
        }
      });
    }

    res.json({ success: true, data: config, message: 'SMTP Configuration successfully updated.' });
  } catch (err) {
    console.error('[SMTP-SETTINGS-POST-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'SQL Persistence Failure' });
  }
});

/**
 * @desc    Test SMTP connection
 */
router.post('/smtp/test', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { host, port, secure, user, pass, from } = req.body;

    // Use existing password if not provided in test
    let testPass = pass;
    if (pass === '********') {
      const config = await prisma.smtpConfig.findFirst();
      testPass = config ? config.pass : '';
    }

    const testResult = await emailService.testConnection({
      host,
      port,
      secure,
      user,
      pass: testPass,
      from,
    });

    if (testResult.success) {
      res.json({ success: true, message: testResult.message });
    } else {
      res.status(400).json({ success: false, error: testResult.error });
    }
  } catch (err) {
    console.error('[SMTP-TEST-FATAL]:', err.message);
    res.status(500).json({ success: false, error: 'Nodemailer Verification Failure' });
  }
});

module.exports = router;
