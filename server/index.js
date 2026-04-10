require('dotenv').config();
try {
  const express = require('express');
  const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const patentRoutes = require('./routes/patentRoutes');
const drugRoutes = require('./routes/drugRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const usersRoutes = require('./routes/usersRoutes');
const documentRoutes = require('./routes/documentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const strategyRoutes = require('./routes/strategyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const heatmapRoutes = require('./routes/heatmapRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const { auditLog } = require('./middlewares/auditMiddleware');
const prisma = require('./services/prisma');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 21 CFR Part 11 Compliance Audit Middleware (V2 Prisma Optimized)
app.use(auditLog);

// Core V2 Enterprise API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/registry', drugRoutes);
app.use('/api/mapping', mappingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/heatmap', heatmapRoutes);
app.use('/api/approvals', approvalRoutes);

// Compliance Module (V2 Prisma Wiring)
app.get('/api/compliance/audit', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100 // Enterprise limit for performance
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('[GxP-AUDIT-RETRIEVAL-FAIL]:', err.message);
    res.status(500).json({ success: false, error: 'GxP Audit Retrieval Failure' });
  }
});

// Base Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    compliance: '21 CFR Part 11 Active',
    persistence: 'PostgreSQL V2 (Prisma) Ready',
    version: '4.0.0'
  });
});

app.get('/', (req, res) => {
  res.send('VantagePoint Enterprise API - V2 Infrastructure Active');
});

// Start Server
  app.listen(PORT, () => {
    console.log(`🚀 VantagePoint V4.0 Enterprise API running on port ${PORT}`);
    console.log(`🛡️ GxP Compliance Monitoring Active (PostgreSQL Sync)...`);
  });
} catch (err) {
  console.error('[GxP-AUTH-BOOT-FAIL]:', err.stack || err);
  process.exit(1);
}
