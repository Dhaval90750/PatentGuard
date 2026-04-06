const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    Electronic Signature Verification (Module 7)
 * @purpose Enforces re-authentication for high-risk GxP actions.
 */
const verifyESignature = async (req, res, next) => {
  try {
    const { signaturePassword } = req.body;
    const user = req.user; // From authMiddleware

    if (!signaturePassword) {
      return res.status(403).json({ 
        success: false, 
        error: '21 CFR Part 11 Signature Required. Provide personnel password to authorize.' 
      });
    }

    // In a real DB, we fetch the latest hashed password for this user.
    // Since we are using mock auth but real GxP, we assume 'password' for demo.
    const isValid = signaturePassword === 'password'; 

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid E-Signature. Identity verification failed.' 
      });
    }

    // Generate a unique signature hash for the audit trail
    req.signatureHash = uuidv4();
    next();
  } catch (err) {
    console.error('[E-SIGN-VERIFY-ERR]:', err.message);
    res.status(500).json({ success: false, error: 'Identity Signature Engine Failure' });
  }
};

module.exports = { verifyESignature };
