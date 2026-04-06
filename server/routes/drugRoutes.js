const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all Drugs (V3.0 Stability)
 */
router.get('/drugs', authMiddleware, (req, res) => {
  try {
    const drugs = db.get('drugs').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: drugs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Drug Persistence Error' });
  }
});

/**
 * @desc    Register a new product
 */
router.post('/drugs', authMiddleware, authorize(['RD', 'ADMIN']), (req, res) => {
  try {
    const { name, dosageForm, composition } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Product name mandatory.' });
    }

    const newDrug = {
      id: uuidv4(),
      name,
      dosageForm,
      composition,
      created_at: new Date().toISOString()
    };

    db.insert('drugs', newDrug);
    res.status(201).json({ success: true, data: newDrug, message: 'New product initialized in GxP Registry.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'File-System Persistence Failure' });
  }
});

/**
 * @desc    Get all APIs
 */
router.get('/apis', authMiddleware, (req, res) => {
  try {
    const apis = db.get('apis').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: apis });
  } catch (err) {
    res.status(500).json({ success: false, error: 'API Persistence Error' });
  }
});

/**
 * @desc    Initialize a new API
 */
router.post('/apis', authMiddleware, authorize(['RD', 'ADMIN']), (req, res) => {
  try {
    const { name, molecularFormula, manufacturer } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'API name mandatory.' });
    }

    const newApi = {
      id: uuidv4(),
      name,
      molecularFormula,
      manufacturer,
      created_at: new Date().toISOString()
    };

    db.insert('apis', newApi);
    res.status(201).json({ success: true, data: newApi, message: 'Persistent API Registry initialized' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'File-System Persistence Failure' });
  }
});

/**
 * @desc    Update a drug
 */
router.put('/drugs/:id', authMiddleware, authorize(['RD', 'ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('drugs', id, { ...req.body, updated_at: new Date().toISOString() });
    if (updated) res.json({ success: true, data: updated });
    else res.status(404).json({ success: false, error: 'Product not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update persistence failure' });
  }
});

/**
 * @desc    Delete a drug
 */
router.delete('/drugs/:id', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('drugs', id);
    if (deleted) res.json({ success: true });
    else res.status(404).json({ success: false, error: 'Product not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Withdrawal persistence failure' });
  }
});

/**
 * @desc    Update an API
 */
router.put('/apis/:id', authMiddleware, authorize(['RD', 'ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('apis', id, { ...req.body, updated_at: new Date().toISOString() });
    if (updated) res.json({ success: true, data: updated });
    else res.status(404).json({ success: false, error: 'API not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update persistence failure' });
  }
});

/**
 * @desc    Delete an API
 */
router.delete('/apis/:id', authMiddleware, authorize(['ADMIN']), (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.remove('apis', id);
    if (deleted) res.json({ success: true });
    else res.status(404).json({ success: false, error: 'API not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Withdrawal persistence failure' });
  }
});

module.exports = router;
