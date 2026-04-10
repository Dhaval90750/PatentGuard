const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const aiService = require('../services/aiService');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

/**
 * @desc    Run semantic overlap analysis for a specific drug
 */
router.get('/overlap/:drugId', authMiddleware, authorize(['RD', 'LEGAL', 'ADMIN']), async (req, res) => {
  try {
    const { drugId } = req.params;
    const results = await aiService.analyzeOverlap(drugId);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('[AI-OVERLAP-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Semantic Intelligence Failure' });
  }
});

/**
 * @desc    Extract semantic tags for a patent or drug (GxP Auto-tagging)
 */
router.post('/tags', authMiddleware, authorize(['RD', 'LEGAL', 'ADMIN']), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Text required for tagging.' });
    
    const tags = aiService.extractTags(text);
    res.json({ success: true, data: tags });
  } catch (err) {
    console.error('[AI-TAGGING-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'NLP Tagging Failure' });
  }
});

/**
 * @desc    Global Semantic Search (Similarity Search)
 */
router.get('/search', authMiddleware, authorize(['RD', 'LEGAL', 'ADMIN']), async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'Semantic query required.' });

    const queryVec = await aiService.generateEmbedding(query);
    const patents = await prisma.patent.findMany();
    
    const results = await Promise.all(patents.map(async (p) => {
      const patentVec = await aiService.generateEmbedding(`${p.title} ${p.jurisdiction}`);
      const score = aiService.calculateSimilarity(queryVec, patentVec);
      return { ...p, similarityScore: Math.round(score * 100) };
    }));

    const sorted = results
      .filter(r => r.similarityScore > 5)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    res.json({ success: true, data: sorted });
  } catch (err) {
    console.error('[AI-SEARCH-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'Semantic Discovery Failure' });
  }
});

module.exports = router;
