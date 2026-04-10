const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all patents (V2 Prisma Optimized)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patents = await prisma.patent.findMany({
      orderBy: { created_at: 'desc' },
      include: { apis: true } // Include linked APIs for richer data
    });
    res.json({ success: true, data: patents });
  } catch (err) {
    console.error('[DATABASE-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'V2 Database Retrieval Failure' });
  }
});

/**
 * @desc    Create a new patent (V2 Prisma Transaction-Ready)
 */
router.post('/', authMiddleware, authorize(['LEGAL', 'ADMIN']), async (req, res) => {
  try {
    const { patentNumber, title, jurisdiction, filingDate, inventors, expiryDate, status } = req.body;
    
    if (!patentNumber || !title || !jurisdiction) {
      return res.status(400).json({ success: false, error: 'Missing mandatory patent metadata.' });
    }

    const newPatent = await prisma.patent.create({
      data: {
        patentNumber,
        title,
        jurisdiction,
        status: status || 'DRAFT',
        filingDate: filingDate ? new Date(filingDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : new Date(),
        inventors: inventors || [],
      }
    });

    res.status(201).json({ success: true, data: newPatent, message: 'Patent record initialized in V2 SQL Vault.' });
  } catch (err) {
    console.error('[DATABASE-INSERT-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'V2 SQL Persistence Failure' });
  }
});

/**
 * @desc    Update a patent
 */
router.put('/:id', authMiddleware, authorize(['LEGAL', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { filingDate, expiryDate, ...otherData } = req.body;

    const dataToUpdate = { ...otherData };
    if (filingDate) dataToUpdate.filingDate = new Date(filingDate);
    if (expiryDate) dataToUpdate.expiryDate = new Date(expiryDate);

    const updated = await prisma.patent.update({
      where: { id },
      data: dataToUpdate
    });
    
    res.json({ success: true, data: updated, message: 'Patent updated with audit traceability.' });
  } catch (err) {
    console.error('[DATABASE-UPDATE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'Patent not found or update error.' });
  }
});

/**
 * @desc    Delete a patent (GxP Withdrawal)
 */
router.delete('/:id', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patent.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Patent record withdrawn from V2 SQl registry.' });
  } catch (err) {
    console.error('[DATABASE-DELETE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'Patent not found.' });
  }
});

module.exports = router;
