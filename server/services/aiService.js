const natural = require('natural');
const prisma = require('./prisma');
const ss = require('simple-statistics');

/**
 * @desc    AI Strategic Intelligence Service (V2)
 * @purpose Implements local NLP for semantic similarity and patent-drug overlap analysis.
 */
class AiService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
  }

  /**
   * @desc    Generate a simplified vector embedding for a block of text
   * @purpose Enables semantic comparison without external LLM dependencies.
   */
  async generateEmbedding(text) {
    if (!text) return [];
    
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stemmer = natural.PorterStemmer;
    const stemmed = tokens.map(t => stemmer.stem(t));
    
    // In a production environment, we'd use a pre-trained model.
    // Here, we create a term-frequency map as a lightweight embedding.
    const freqMap = {};
    stemmed.forEach(word => {
      freqMap[word] = (freqMap[word] || 0) + 1;
    });
    
    return freqMap;
  }

  /**
   * @desc    Calculate Cosine Similarity between two term-frequency vectors
   */
  calculateSimilarity(vec1, vec2) {
    if (!vec1 || !vec2) return 0;
    
    const words = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    words.forEach(word => {
      const v1 = vec1[word] || 0;
      const v2 = vec2[word] || 0;
      dotProduct += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    });
    
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  /**
   * @desc    Analyze a drug and find overlapping patents based on semantic similarity
   */
  async analyzeOverlap(drugId) {
    const drug = await prisma.drug.findUnique({ where: { id: drugId } });
    if (!drug || !drug.description) return [];

    const drugVec = await this.generateEmbedding(`${drug.name} ${drug.description} ${drug.composition}`);
    const patents = await prisma.patent.findMany();

    const results = await Promise.all(patents.map(async (patent) => {
      const patentVec = await this.generateEmbedding(`${patent.title} ${patent.jurisdiction}`);
      const score = this.calculateSimilarity(drugVec, patentVec);
      
      // Simulated Multi-dimensional metrics for V2 Radar Visualization
      const metrics = [
        { subject: 'Structural', A: Math.round(score * 100 * 1.1) > 100 ? 100 : Math.round(score * 100 * 1.1) },
        { subject: 'Functional', A: Math.round(score * 100 * 0.9) },
        { subject: 'Jurisdictional', A: Math.round(score * 100 * 1.2) > 100 ? 100 : Math.round(score * 100 * 1.2) },
        { subject: 'Novelty', A: Math.round((1 - score) * 100 * 0.8) },
        { subject: 'Strength', A: Math.round(score * 100 * 0.85) }
      ];

      return {
        patentId: patent.id,
        patentNumber: patent.patentNumber,
        title: patent.title,
        similarityScore: Math.round(score * 100),
        metrics, // For High-Fidelity Radar UI
        riskLevel: score > 0.7 ? 'CRITICAL' : score > 0.4 ? 'MODERATE' : 'LOW'
      };
    }));

    return results
      .filter(r => r.similarityScore > 10) // Filter out noise
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  /**
   * @desc    Extract semantic tags from text (Key phrases)
   */
  extractTags(text) {
    if (!text) return [];
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stopwords = natural.stopwords;
    return [...new Set(tokens.filter(t => t.length > 4 && !stopwords.includes(t)))].slice(0, 5);
  }
}

module.exports = new AiService();
