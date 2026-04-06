const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all personnel users
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const users = db.get('users');
    const safeUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role }));
    res.json({ success: true, data: safeUsers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Directory Services Sync Failure' });
  }
});

/**
 * @desc    Provision new user identity
 */
router.post('/', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, error: 'Username, password and role are required.' });
    }
    const users = db.get('users');
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ success: false, error: 'Username already exists.' });
    }
    const newUser = { id: uuidv4(), username, password, role, created_at: new Date().toISOString() };
    db.insert('users', newUser);
    res.status(201).json({ success: true, data: { id: newUser.id, username: newUser.username, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Provisioning failed.' });
  }
});

/**
 * @desc    Update user role
 */
router.put('/:id', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('users', id, { role: req.body.role, updated_at: new Date().toISOString() });
    if (updated) {
      res.json({ success: true, data: { id: updated.id, username: updated.username, role: updated.role } });
    } else {
      res.status(404).json({ success: false, error: 'User not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Role update failed.' });
  }
});

/**
 * @desc    Revoke user access (delete)
 */
router.delete('/:id', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('users', id);
    if (deleted) {
      res.json({ success: true, message: 'Identity revoked. Audit recorded.' });
    } else {
      res.status(404).json({ success: false, error: 'User not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Revocation failed.' });
  }
});

module.exports = router;
