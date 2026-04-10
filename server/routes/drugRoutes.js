const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all Drugs (V2 Prisma Optimized)
 */
router.get('/drugs', authMiddleware, async (req, res) => {
  try {
    const drugs = await prisma.drug.findMany({
      orderBy: { created_at: 'desc' },
      include: { apis: true }
    });
    res.json({ success: true, data: drugs });
  } catch (err) {
    console.error('[DRUG-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Drug V2 Retrieval Failure' });
  }
});

/**
 * @desc    Register a new product
 */
router.post('/drugs', authMiddleware, authorize(['RD', 'ADMIN']), async (req, res) => {
  try {
    const { name, dosageForm, composition, manufacturer } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Product name mandatory.' });
    }

    const newDrug = await prisma.drug.create({
      data: {
        name,
        dosageForm,
        composition,
        manufacturer: manufacturer || 'Unknown',
      }
    });

    res.status(201).json({ success: true, data: newDrug, message: 'New product initialized in GxP V2 Registry.' });
  } catch (err) {
    console.error('[DRUG-CREATE-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'Drug V2 Persistence Failure' });
  }
});

/**
 * @desc    Get all APIs
 */
router.get('/apis', authMiddleware, async (req, res) => {
  try {
    const apis = await prisma.api.findMany({
      orderBy: { created_at: 'desc' },
      include: { patents: true }
    });
    res.json({ success: true, data: apis });
  } catch (err) {
    console.error('[API-FETCH-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'API V2 Retrieval Failure' });
  }
});

/**
 * @desc    Initialize a new API
 */
router.post('/apis', authMiddleware, authorize(['RD', 'ADMIN']), async (req, res) => {
  try {
    const { name, molecularFormula, manufacturer } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'API name mandatory.' });
    }

    const newApi = await prisma.api.create({
      data: {
        name,
        molecularFormula,
        manufacturer: manufacturer || 'Unknown',
      }
    });

    res.status(201).json({ success: true, data: newApi, message: 'Persistent API Registry V2 initialized' });
  } catch (err) {
    console.error('[API-CREATE-ERROR]:', err.message);
    res.status(500).json({ success: false, error: 'API V2 Persistence Failure' });
  }
});

/**
 * @desc    Update a drug
 */
router.put('/drugs/:id', authMiddleware, authorize(['RD', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.drug.update({
      where: { id },
      data: { ...req.body }
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[DRUG-UPDATE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'Product not found or update error.' });
  }
});

/**
 * @desc    Delete a drug
 */
router.delete('/drugs/:id', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.drug.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Product record withdrawn from V2 registry.' });
  } catch (err) {
    console.error('[DRUG-DELETE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'Product not found.' });
  }
});

/**
 * @desc    Update an API
 */
router.put('/apis/:id', authMiddleware, authorize(['RD', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.api.update({
      where: { id },
      data: { ...req.body }
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[API-UPDATE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'API not found or update error.' });
  }
});

/**
 * @desc    Delete an API
 */
router.delete('/apis/:id', authMiddleware, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.api.delete({
      where: { id }
    });
    res.json({ success: true, message: 'API record withdrawn from V2 registry.' });
  } catch (err) {
    console.error('[API-DELETE-ERROR]:', err.message);
    res.status(404).json({ success: false, error: 'API not found.' });
  }
});

module.exports = router;
