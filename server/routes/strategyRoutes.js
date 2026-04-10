const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const strategyService = require('../services/strategyService');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Get all patents for simulation baseline
 */
router.get('/patents', authMiddleware, authorize(['LEGAL', 'RD', 'ADMIN']), async (req, res) => {
  try {
    const patents = await prisma.patent.findMany({
      select: {
        id: true,
        patentNumber: true,
        title: true,
        jurisdiction: true,
        expiryDate: true,
        spc_expiry: true,
        pte_extension: true,
        pediatric_extension: true,
        data_exclusivity_expiry: true,
      }
    });

    res.json({ success: true, data: patents });
  } catch (err) {
    console.error('[STRATEGY-BASE-FETCH-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Strategy Database Retrieval Failure' });
  }
});

/**
 * @desc    Execute "What-If" Simulation
 */
router.post('/simulate', authMiddleware, authorize(['LEGAL', 'RD', 'ADMIN']), async (req, res) => {
  try {
    const { patentIds, tweaks } = req.body;

    if (!patentIds || !Array.isArray(patentIds)) {
      return res.status(400).json({ success: false, error: 'Valid Intellectual Property IDs required for simulation.' });
    }

    const scenarios = await Promise.all(
      patentIds.map(id => strategyService.calculateScenario(id, tweaks))
    );

    res.json({ success: true, data: scenarios });
  } catch (err) {
    console.error('[STRATEGY-SIMULATE-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Strategic Calculation Failure: Legal ruleset violation' });
  }
});

module.exports = router;
