const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all patents (V3.0 Stability)
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const patents = db.get('patents').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: patents });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database Persistence Error' });
  }
});

/**
 * @desc    Create a new patent (FileSystem Sync)
 */
router.post('/', authMiddleware, authorize(['LEGAL', 'ADMIN']), (req, res) => {
  try {
    const { patentNumber, title, jurisdiction, filingDate, inventors, expiryDate } = req.body;
    
    if (!patentNumber || !title || !jurisdiction) {
      return res.status(400).json({ success: false, error: 'Missing mandatory patent metadata.' });
    }

    const newPatent = {
      id: uuidv4(),
      patentNumber,
      title,
      jurisdiction,
      status: req.body.status || 'DRAFT',
      filingDate,
      expiryDate,
      inventors: inventors || [],
      created_at: new Date().toISOString()
    };

    db.insert('patents', newPatent);
    res.status(201).json({ success: true, data: newPatent, message: 'Patent record initialized in persistent vault.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'File-System Persistence Failure' });
  }
});

/**
 * @desc    Update a patent
 */
router.put('/:id', authMiddleware, authorize(['LEGAL', 'ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('patents', id, { ...req.body, updated_at: new Date().toISOString() });
    
    if (updated) {
      res.json({ success: true, data: updated, message: 'Patent updated with audit traceability.' });
    } else {
      res.status(404).json({ success: false, error: 'Patent not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update persistence failure' });
  }
});

/**
 * @desc    Delete a patent (GxP Withdrawal)
 */
router.delete('/:id', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('patents', id);
    
    if (deleted) {
      res.json({ success: true, message: 'Patent record withdrawn from persistent registry.' });
    } else {
      res.status(404).json({ success: false, error: 'Patent not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Withdrawal persistence failure' });
  }
});

module.exports = router;
