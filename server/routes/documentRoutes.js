const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route   GET /api/documents
 * @desc    Get all documents from the GxP Vault
 * @access  Private
 */
router.get('/', (req, res) => {
  try {
    const docs = db.get('documents');
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Vault Retrieval Failure' });
  }
});

/**
 * @route   POST /api/documents
 * @desc    File a new document in the GxP Vault
 * @access  Private
 */
router.post('/', (req, res) => {
  try {
    const { name, version, status, author, jurisdiction, folder, history } = req.body;
    
    if (!name || !folder) {
      return res.status(400).json({ success: false, error: 'Invalid document mapping' });
    }

    const newDoc = {
      id: `d-${Date.now()}`,
      name,
      version: version || 'v1.0',
      status: status || 'DRAFT',
      author: author || 'System User',
      jurisdiction,
      folder,
      date: new Date().toISOString().split('T')[0],
      history: history || [{ 
        v: version || 'v1.0', 
        date: new Date().toISOString().split('T')[0], 
        note: 'Initial Filing' 
      }],
      created_at: new Date().toISOString()
    };

    db.insert('documents', newDoc);
    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Document Commitment Failure' });
  }
});

/**
 * @route   PUT /api/documents/:id
 * @desc    Update/Revise an existing document (Version Bump & Migration)
 * @access  Private
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updated = db.update('documents', id, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Document not found in Vault' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Vault Mutation Failure' });
  }
});

module.exports = router;
