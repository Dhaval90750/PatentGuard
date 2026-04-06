const mongoose = require('mongoose');

// Audit Log Schema (21 CFR Part 11)
const AuditLogSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, default: 'anonymous' },
  action: { type: String, required: true }, // POST, PUT, DELETE
  targetUrl: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  status: { type: Number },
  ipAddress: { type: String }
});

// Patent Schema (Module 1 & 3)
const PatentSchema = new mongoose.Schema({
  patentNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  jurisdiction: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'FILED', 'EXAMINATION', 'GRANTED', 'EXPIRED'], default: 'DRAFT' },
  filingDate: { type: Date },
  grantDate: { type: Date },
  expiryDate: { type: Date }, // Calculated via Rule Engine later
  inventors: [{ type: String }],
  apis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'API' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Drug Schema (Module 2)
const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dosageForm: { type: String },
  composition: { type: String },
  apis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'API' }],
  created_at: { type: Date, default: Date.now }
});

// API Schema (Module 2)
const APISchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  molecularFormula: { type: String },
  manufacturer: { type: String },
  patents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patent' }],
  created_at: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
const Patent = mongoose.model('Patent', PatentSchema);
const Drug = mongoose.model('Drug', DrugSchema);
const API = mongoose.model('API', APISchema);

module.exports = { AuditLog, Patent, Drug, API };
