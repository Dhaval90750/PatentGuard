const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @desc    Fetch internal GxP notifications (V2 Prisma)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: notifications || [] });
  } catch (err) {
    console.error('[NOTIF-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Notification V2 Retrieval Failure' });
  }
});

/**
 * @desc    Mark a GxP alert as investigated (read)
 */
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    const allNotifications = await prisma.notification.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json({ success: true, data: allNotifications });
  } catch (err) {
    console.error('[NOTIF-UPDATE-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Alert Ack Failure' });
  }
});

module.exports = router;
