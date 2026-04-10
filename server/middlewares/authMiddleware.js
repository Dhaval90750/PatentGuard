const jwt = require('jsonwebtoken');

/**
 * @desc    VantagePoint V2 Authentication Middleware
 * @purpose Verifies JWT and handles personnel identity context.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'GxP Access Denied: No Token Provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'vantagepoint_secret_key_v2');
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Identity Verification Failure: Invalid Token' });
  }
};

/**
 * @desc    RBAC 2.0 Authorization Middleware
 * @purpose Enforces granular, role-based access control for enterprise compliance.
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access Restricted: ${req.user ? req.user.role : 'GUEST'} permissions insufficient for this resource.` 
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
