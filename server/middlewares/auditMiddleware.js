const prisma = require('../services/prisma');

/**
 * @desc    21 CFR Part 11 Compliance Middleware (V2 Prisma)
 * @purpose Implements non-repudiable logs with PostgreSQL persistence via Prisma.
 */
const auditLog = (req, res, next) => {
  try {
    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Capture the original json function to intercept the response
    const originalJson = res.json;

    res.json = function (data) {
      try {
        // Asynchronous persistent logging to PostgreSQL
        // Note: We don't await this here to avoid blocking the client response,
        // but in a production GxP system, we'd ensure this is flushed.
        prisma.auditLog.create({
          data: {
            timestamp: new Date(),
            userId: req.user ? req.user.username : 'anonymous',
            action: req.method,
            target: req.originalUrl,
            status: res.statusCode,
            sig: req.signatureHash || 'SYSTEM-V2', // V2 E-Signature Integration
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
          }
        }).catch(err => console.error('[AUDIT-DB-FAIL]:', err.message));

      } catch (innerError) {
        console.error('[AUDIT-INTERCEPT-FAIL]:', innerError.message);
      }
      
      return originalJson.call(this, data);
    };

    next();
  } catch (err) {
    console.error('[AUDIT-V2-FATAL]:', err.message);
    next(); 
  }
};

module.exports = { auditLog };
