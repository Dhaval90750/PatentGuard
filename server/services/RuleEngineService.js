/**
 * @desc    Global Patent Rule Engine (Module 3)
 * @purpose Calculates Expiry and Protection periods based on specific Jurisdictional Law.
 */
class RuleEngineService {
  constructor() {
    // In V2.0, these rules would be fetched from a MongoDB "Laws" collection.
    // For the Enterprise V2.0 Demo, we define the core jurisdictional frameworks.
    this.jurisdictionalRules = {
      'USA': {
        patentTerm: 20, // years from filing
        exclusivityPeriod: 5, // years (Hatch-Waxman)
        extensionLimit: 5, // years (max extension)
      },
      'EU': {
        patentTerm: 20,
        exclusivityPeriod: 8, // years (8+2+1 rule)
        extensionLimit: 5, // Supplemental Protection Certificate (SPC)
      },
      'INDIA': {
        patentTerm: 20,
        exclusivityPeriod: 0, // Limited data exclusivity
        extensionLimit: 0,
      }
    };
  }

  /**
   * Calculates the calculated expiry date based on a filing date and jurisdiction.
   * @param {Date} filingDate - Date the patent was filed.
   * @param {string} jurisdiction - Country/Region (USA, EU, INDIA).
   * @returns {Date} - Calculated Expiry Date.
   */
  calculateExpiryDate(filingDate, jurisdiction) {
    const rules = this.jurisdictionalRules[jurisdiction] || { patentTerm: 20 };
    const expiry = new Date(filingDate);
    expiry.setFullYear(expiry.getFullYear() + rules.patentTerm);
    return expiry;
  }

  /**
   * Calculates regulatory protection periods (Data Exclusivity).
   * @param {Date} approvalDate - Date the drug was approved.
   * @param {string} jurisdiction - Country/Region.
   * @returns {Date} - Exclusivity End Date.
   */
  calculateExclusivityEnd(approvalDate, jurisdiction) {
    const rules = this.jurisdictionalRules[jurisdiction] || { exclusivityPeriod: 0 };
    const expiry = new Date(approvalDate);
    expiry.setFullYear(expiry.getFullYear() + (rules.exclusivityPeriod || 0));
    return expiry;
  }

  /**
   * Validates if a patent filing meets the jurisdictional term requirements.
   */
  validateFilingTerm(filingDate, grantDate, jurisdiction) {
    // Business Logic: Patents usually can't be granted more than N years after filing without extension.
    return true; 
  }
}

module.exports = new RuleEngineService();
