const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/notifications
 * @desc    Fetch internal GxP notifications
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = db.get('notifications');
    res.json({ success: true, data: notifications || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Notification Retrieval Failure' });
  }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a GxP alert as investigated (read)
 */
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const updated = db.update('notifications', req.params.id, { read: true });
    res.json({ success: true, data: db.get('notifications') });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Alert Ack Failure' });
  }
});

module.exports = router;
