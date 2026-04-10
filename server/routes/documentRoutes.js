const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/documents
 * @desc    Get all documents from the GxP Vault (V2 Prisma)
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      orderBy: { date: 'desc' }
    });
    res.json({ success: true, data: docs });
  } catch (err) {
    console.error('[VAULT-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Vault Retrieval Failure' });
  }
});

/**
 * @route   POST /api/documents
 * @desc    File a new document in the GxP Vault
 * @access  Private
 */
router.post('/', authMiddleware, authorize(['QA', 'ADMIN']), async (req, res) => {
  try {
    const { name, version, status, author, jurisdiction, folder, history } = req.body;
    
    if (!name || !folder) {
      return res.status(400).json({ success: false, error: 'Invalid document mapping' });
    }

    const initialHistory = history || [{ 
      v: version || 'v1.0', 
      date: new Date().toISOString().split('T')[0], 
      note: 'Initial Filing' 
    }];

    const newDoc = await prisma.document.create({
      data: {
        name,
        version: version || 'v1.0',
        status: status || 'DRAFT',
        author: author || 'System User',
        jurisdiction: jurisdiction || null,
        folder,
        date: new Date(),
        history: initialHistory,
      }
    });

    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    console.error('[VAULT-POST-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Document Commitment Failure' });
  }
});

/**
 * @route   PUT /api/documents/:id
 * @desc    Update/Revise an existing document (Version Bump & Migration)
 * @access  Private
 */
router.put('/:id', authMiddleware, authorize(['QA', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ...updates } = req.body;
    
    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...updates
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[VAULT-PUT-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'Document not found in Vault' });
  }
});

module.exports = router;
