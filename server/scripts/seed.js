/**
 * VantagePoint V2 — Rich Demo Seed Script
 * Run: node scripts/seed.js
 * Resets database.json to a production-realistic demo state.
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/database.json');

const seed = {
  patents: [
    { id: 'pat-001', patentNumber: 'US10123456', title: 'Oncology Delivery Platform: Targeted Lipid Nanoparticle', jurisdiction: 'USA', status: 'GRANTED', filingDate: '2018-05-12', expiryDate: '2038-05-12', inventors: ['Dr. Sarah Chen', 'Michael Ross'], created_at: '2026-01-01T00:00:00Z' },
    { id: 'pat-002', patentNumber: 'EP20240012', title: 'Extended Release Formulation of Onco-Z Compound', jurisdiction: 'EU', status: 'FILED', filingDate: '2024-01-10', expiryDate: '2044-01-10', inventors: ['Dr. Klaus Meyer'], created_at: '2026-01-02T00:00:00Z' },
    { id: 'pat-003', patentNumber: 'JP5567890', title: 'Method for Synthesizing Pure API-X7', jurisdiction: 'JAPAN', status: 'GRANTED', filingDate: '2015-09-20', expiryDate: '2035-09-20', inventors: ['Hiroshi Tanaka'], created_at: '2026-01-03T00:00:00Z' },
    { id: 'pat-004', patentNumber: 'US11223344', title: 'Stabilized Crystalline Form of Neuro-Inhibitor', jurisdiction: 'USA', status: 'EXAMINATION', filingDate: '2021-11-05', expiryDate: '2041-11-05', inventors: ['Dr. Emily Watson'], created_at: '2026-01-04T00:00:00Z' },
    { id: 'pat-005', patentNumber: 'IN20204100', title: 'Low-Cost Manufacturing Process for API-X7', jurisdiction: 'INDIA', status: 'GRANTED', filingDate: '2020-02-14', expiryDate: '2040-02-14', inventors: ['Ravi Kumar'], created_at: '2026-01-05T00:00:00Z' },
    { id: 'pat-006', patentNumber: 'CN202210023', title: 'Cardiovascular Compound CR-9 Synthesis', jurisdiction: 'CHINA', status: 'GRANTED', filingDate: '2022-03-01', expiryDate: '2027-03-01', inventors: ['Prof. Li Wei'], created_at: '2026-01-06T00:00:00Z' },
    { id: 'pat-007', patentNumber: 'US10987654', title: 'Immunotherapy Adjuvant Platform B-7', jurisdiction: 'USA', status: 'EXPIRED', filingDate: '2003-07-15', expiryDate: '2023-07-15', inventors: ['Dr. Marcus Hunt', 'Dr. Priya Nair'], created_at: '2026-01-07T00:00:00Z' },
    { id: 'pat-008', patentNumber: 'CA2024001', title: 'Blood-Brain Barrier Penetration Agent', jurisdiction: 'CANADA', status: 'EXAMINATION', filingDate: '2024-08-20', expiryDate: '2044-08-20', inventors: ['Dr. Ann Liu'], created_at: '2026-01-08T00:00:00Z' },
    { id: 'pat-009', patentNumber: 'EP19990034', title: 'Pain Modulator: Selective COX-3 Inhibitor', jurisdiction: 'EU', status: 'EXPIRED', filingDate: '1999-04-10', expiryDate: '2024-04-10', inventors: ['Prof. Hans Weber'], created_at: '2026-01-09T00:00:00Z' },
    { id: 'pat-010', patentNumber: 'AU2023099', title: 'mRNA Delivery Scaffold for Vaccinology', jurisdiction: 'AUSTRALIA', status: 'FILED', filingDate: '2023-12-01', expiryDate: '2043-12-01', inventors: ['Dr. James Park', 'Dr. Zoe Adams'], created_at: '2026-01-10T00:00:00Z' },
  ],
  apis: [
    { id: 'api-onc-001', name: 'Onco-Z Derivative', molecularFormula: 'C24H30O5', manufacturer: 'Zenith Pharma Synthesis', linkedPatents: ['pat-001', 'pat-002'], created_at: '2026-01-01T00:00:00Z' },
    { id: 'api-neu-002', name: 'Neuro-Blocker K', molecularFormula: 'C18H24N2O', manufacturer: 'NeuroStar API Division', linkedPatents: ['pat-004'], created_at: '2026-01-02T00:00:00Z' },
    { id: 'api-gen-003', name: 'API-X7 (Standard)', molecularFormula: 'C12H18O2', manufacturer: 'GenericBio Labs', linkedPatents: ['pat-003', 'pat-005'], created_at: '2026-01-03T00:00:00Z' },
    { id: 'api-cv-004', name: 'CardioMax CR-9', molecularFormula: 'C20H25ClN2O3', manufacturer: 'CardioPath Ltd', linkedPatents: ['pat-006'], created_at: '2026-01-04T00:00:00Z' },
    { id: 'api-mrna-005', name: 'mRNA-Lipid Vector LNP-7', molecularFormula: 'C58H109NO8P', manufacturer: 'VaxTech Bioformulation', linkedPatents: ['pat-010'], created_at: '2026-01-05T00:00:00Z' },
  ],
  drugs: [
    { id: 'drug-001', name: 'Zenith-Onco (100mg)', dosageForm: 'Tablet', composition: 'Onco-Z Derivative 100mg + Microcrystalline Cellulose', manufacturer: 'Zenith Pharma Co.', linkedApis: ['api-onc-001'], created_at: '2026-01-01T00:00:00Z' },
    { id: 'drug-002', name: 'BrainShield-SR', dosageForm: 'Capsule', composition: 'Neuro-Blocker K 50mg + Extended Release Polymer', manufacturer: 'NeuroPath Inc.', linkedApis: ['api-neu-002'], created_at: '2026-01-02T00:00:00Z' },
    { id: 'drug-003', name: 'OncoGuard-X (Generic)', dosageForm: 'Oral Solution', composition: 'API-X7 Standard 200mg/5mL', manufacturer: 'GenFarma Ltd', linkedApis: ['api-gen-003'], created_at: '2026-01-03T00:00:00Z' },
    { id: 'drug-004', name: 'CardioMax 20mg', dosageForm: 'Tablet', composition: 'CardioMax CR-9 20mg + Lactose Monohydrate', manufacturer: 'CardioPath Ltd', linkedApis: ['api-cv-004'], created_at: '2026-01-04T00:00:00Z' },
  ],
  notifications: [
    { id: 'notif-001', severity: 'CRITICAL', title: 'Patent Expiry Alert: CN202210023 — 12 Months', message: 'CardioMax CR-9 primary patent (CN202210023) expires in March 2027. Initiate renewal or extension strategy immediately.', timestamp: '2026-04-07T08:00:00Z', read: false },
    { id: 'notif-002', severity: 'CRITICAL', title: 'Patent Expired: EP19990034', message: 'Pain Modulator COX-3 Inhibitor patent has expired. Monitor generic competition in EU markets.', timestamp: '2026-04-07T08:05:00Z', read: false },
    { id: 'notif-003', severity: 'WARNING', title: 'Mapping Coverage Gap: BrainShield-SR', message: 'BrainShield-SR lacks active patent coverage in EU jurisdiction. Consider filing EP extension.', timestamp: '2026-04-06T11:30:00Z', read: false },
    { id: 'notif-004', severity: 'WARNING', title: 'US10987654 Expired — Generic Entry Risk', message: 'Immunotherapy Adjuvant Platform B-7 patent expired Jul 2023. Generic competition expected in 6-18 months.', timestamp: '2026-04-06T09:00:00Z', read: true },
    { id: 'notif-005', severity: 'INFO', title: 'GxP Audit Passed — Monthly Integrity Check', message: 'Monthly 21 CFR Part 11 integrity check completed successfully. All audit logs intact.', timestamp: '2026-04-06T12:00:00Z', read: true },
  ],
  users: [
    { id: 'U1', username: 'admin@zenithqa.com', password: 'password', role: 'ADMIN' },
    { id: 'U2', username: 'legal@zenithqa.com', password: 'password', role: 'LEGAL' },
    { id: 'U3', username: 'rd@zenithqa.com', password: 'password', role: 'RD' },
    { id: 'U4', username: 'qa@zenithqa.com', password: 'password', role: 'QA' },
  ],
  audit_logs: [
    { id: 'log-001', timestamp: '2026-04-07T00:01:00Z', userId: 'system@vantagepoint.io', action: 'V1_STABILIZATION', targetUrl: '/api/system/seed', status: 200, sig: 'SEED-V2', ipAddress: '127.0.0.1' },
    { id: 'log-002', timestamp: '2026-04-06T14:00:00Z', userId: 'admin@zenithqa.com', action: 'POST', target: '/api/patents', status: 201, sig: 'SYSTEM-V3', ipAddress: '::ffff:127.0.0.1' },
    { id: 'log-003', timestamp: '2026-04-06T15:30:00Z', userId: 'legal@zenithqa.com', action: 'PUT', target: '/api/patents/pat-006', status: 200, sig: 'SYSTEM-V3', ipAddress: '::ffff:127.0.0.1' },
    { id: 'log-004', timestamp: '2026-04-06T16:45:00Z', userId: 'rd@zenithqa.com', action: 'POST', target: '/api/registry/drugs', status: 201, sig: 'SYSTEM-V3', ipAddress: '::ffff:127.0.0.1' },
    { id: 'log-005', timestamp: '2026-04-06T17:00:00Z', userId: 'admin@zenithqa.com', action: 'DELETE', target: '/api/registry/drugs/drug-old-001', status: 200, sig: 'SYSTEM-V3', ipAddress: '::ffff:127.0.0.1' },
    { id: 'log-006', timestamp: '2026-04-07T00:00:00Z', userId: 'admin@zenithqa.com', action: 'POST', target: '/api/auth/login', status: 200, sig: 'SYSTEM-V3', ipAddress: '::ffff:127.0.0.1' },
  ],
  risks: []
};

fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
console.log('✅ PharmaGuard V2 Seed Complete');
console.log(`   📊 ${seed.patents.length} patents | ${seed.apis.length} APIs | ${seed.drugs.length} drugs`);
console.log(`   🔔 ${seed.notifications.filter(n => !n.read).length} unread notifications`);
console.log(`   👤 ${seed.users.length} users: ${seed.users.map(u => u.username).join(', ')}`);
console.log(`   Login with: admin@zenithqa.com / password`);
