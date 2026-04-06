const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const patentRoutes = require('./routes/patentRoutes');
const drugRoutes = require('./routes/drugRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const usersRoutes = require('./routes/usersRoutes');
const documentRoutes = require('./routes/documentRoutes');
const { auditLog } = require('./middlewares/auditMiddleware');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 21 CFR Part 11 Compliance Audit Middleware
app.use(auditLog);

// Core V4.1 Enterprise API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/registry', drugRoutes);
app.use('/api/mapping', mappingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentRoutes);

// Compliance Module (Backend Wiring Fix)
app.get('/api/compliance/audit', (req, res) => {
  try {
    const logs = db.get('audit_logs').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'GxP Audit Retrieval Failure' });
  }
});

// Base Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    compliance: '21 CFR Part 11 Active',
    persistence: 'FileSystemDB V3.0 Ready',
    version: '3.0.0'
  });
});

app.get('/', (req, res) => {
  res.send('VantagePoint Enterprise API - V3.0 Restoration Active');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 VantagePoint V3.0 Restoration Server running on port ${PORT}`);
  console.log(`🛡️ Compliance Monitoring Active (FileSystem Sync)...`);
});
