const prisma = require('./prisma');

/**
 * @desc    Strategic Simulation Engine (V2)
 * @purpose Implements GxP-ready logic for patent lifecycle extensions and market modeling.
 */
class StrategyService {
  
  /**
   * @desc    Calculate simulated expiry based on "What-If" tweaks
   * @param   {Object} patent - The base patent data
   * @param   {Object} tweaks - Simulation parameters (spc, pte, pediatric)
   * @returns {Object} Simulated timeline results
   */
  async calculateScenario(patentId, tweaks = {}) {
    const patent = await prisma.patent.findUnique({
      where: { id: patentId },
      include: { apis: { include: { drugs: true } } }
    });

    if (!patent) throw new Error('Patent not found for simulation.');

    const baseExpiry = new Date(patent.expiryDate);
    let simulatedExpiry = new Date(baseExpiry);

    const modifications = [];

    // 1. SPC (Supplementary Protection Certificate) — Up to 5 years
    if (tweaks.applySPC) {
      const spcYears = tweaks.spcYears || 5; 
      simulatedExpiry.setFullYear(simulatedExpiry.getFullYear() + spcYears);
      modifications.push({ type: 'SPC', impact: `${spcYears} Years Extension` });
    }

    // 2. PTE (Patent Term Extension) — Variable months
    if (tweaks.applicationPTE && tweaks.pteMonths) {
      simulatedExpiry.setMonth(simulatedExpiry.getMonth() + parseInt(tweaks.pteMonths));
      modifications.push({ type: 'PTE', impact: `${tweaks.pteMonths} Months Extension` });
    }

    // 3. Pediatric Reward — Flat 6 months
    if (tweaks.pediatricExtension) {
      simulatedExpiry.setMonth(simulatedExpiry.getMonth() + 6);
      modifications.push({ type: 'PEDIATRIC', impact: '6 Months Reward' });
    }

    // Calculate Market Entry Window
    const marketEntry = new Date(simulatedExpiry);
    marketEntry.setDate(marketEntry.getDate() + 1); // Typically day after expiry

    return {
      patentId: patent.id,
      patentNumber: patent.patentNumber,
      title: patent.title,
      baseExpiry: baseExpiry.toISOString(),
      simulatedExpiry: simulatedExpiry.toISOString(),
      extensionGapMonths: this.calculateMonthDiff(baseExpiry, simulatedExpiry),
      marketEntry: marketEntry.toISOString(),
      modifications,
      isSimulated: true
    };
  }

  /**
   * @helper  Calculate difference in months between two dates
   */
  calculateMonthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}

module.exports = new StrategyService();
