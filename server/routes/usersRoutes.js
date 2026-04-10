const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const bcrypt = require('bcryptjs');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all personnel users (V2 Prisma)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, updated_at: true }
    });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('[USER-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Directory Services Sync Failure' });
  }
});

/**
 * @desc    Provision new user identity
 */
router.post('/', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, error: 'Username, password and role are required.' });
    }
    
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, role },
      select: { id: true, username: true, role: true }
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error('[USER-PROVISION-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Provisioning failed.' });
  }
});

/**
 * @desc    Update user role
 */
router.put('/:id', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, role: true }
    });
    
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[USER-UPDATE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'User not found or update failed.' });
  }
});

/**
 * @desc    Revoke user access (delete)
 */
router.delete('/:id', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'Identity revoked. Audit recorded.' });
  } catch (err) {
    console.error('[USER-REVOKE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'User not found.' });
  }
});

module.exports = router;
