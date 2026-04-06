const express = require('express');
const router = express.Router();
const FileSystemDB = require('../config/db');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/mapping/summary
 * @desc    Get aggregated Drug -> API -> Patent relationships
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { drugs, apis, patents } = FileSystemDB.memory;

    const summary = drugs.map(drug => {
      const relatedApis = (drug.linkedApis || []).map(apiId => {
        const api = apis.find(a => a.id === apiId);
        if (!api) return null;

        const relatedPatents = (api.linkedPatents || []).map(patId => {
          return patents.find(p => p.id === patId);
        }).filter(Boolean);

        return { ...api, patents: relatedPatents };
      }).filter(Boolean);

      return {
        ...drug,
        apis: relatedApis,
        coverageScore: calculateCoverage(relatedApis)
      };
    });

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Mapping Retrieval Failure' });
  }
});

function calculateCoverage(apis) {
  if (!apis.length) return 0;
  const totalPatents = apis.reduce((sum, api) => sum + api.patents.length, 0);
  return Math.min(100, (totalPatents / (apis.length * 2)) * 100);
}

module.exports = router;
