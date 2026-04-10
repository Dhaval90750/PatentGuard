const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Aggregate jurisdictional data for the Global Risk Heatmap
 * @purpose Provides world-scale risk scores by country for visualization.
 */
router.get('/', authMiddleware, authorize(['LEGAL', 'RD', 'ADMIN']), async (req, res) => {
  try {
    const patents = await prisma.patent.findMany();
    
    // Aggregator by Jurisdiction (ISO Alpha-3 Mapping simulation)
    const stats = {};
    const today = new Date();
    const riskThreshold = new Date(today);
    riskThreshold.setFullYear(today.getFullYear() + 2); // 2 year risk threshold

    patents.forEach(p => {
      const jurisdiction = p.jurisdiction || 'GLOBAL';
      if (!stats[jurisdiction]) {
        stats[jurisdiction] = { count: 0, highRisk: 0, lowRisk: 0, score: 0 };
      }
      
      stats[jurisdiction].count += 1;
      const isHighRisk = new Date(p.expiryDate) < riskThreshold;
      
      if (isHighRisk) {
        stats[jurisdiction].highRisk += 1;
      } else {
        stats[jurisdiction].lowRisk += 1;
      }
    });

    // Calculate normalized Risk Score (0-100)
    const heatmapData = Object.keys(stats).map(iso => {
      const s = stats[iso];
      // Formula: weighted ratio of high risk patents
      const score = s.count > 0 ? Math.round(((s.highRisk * 2 + s.lowRisk) / (s.count * 2)) * 100) : 0;
      
      return {
        id: iso, // Expecting ISO-3 code for React-Simple-Maps
        count: s.count,
        highRiskCount: s.highRisk,
        riskScore: score,
        status: score > 75 ? 'CRITICAL' : score > 40 ? 'ELEVATED' : 'STABLE'
      };
    });

    res.json({ success: true, data: heatmapData });
  } catch (err) {
    console.error('[HEATMAP-AGGREGATE-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Jurisdictional Intelligence Failure' });
  }
});

module.exports = router;
