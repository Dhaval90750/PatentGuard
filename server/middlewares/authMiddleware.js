const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'Access Denied: No Token Provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'vantagepoint_secret_key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid Token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access Denied: Insufficient Permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
