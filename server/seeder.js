const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    VantagePoint V3.0 Enterprise Seeder
 * @purpose Generates 100+ professional pharmaceutical records for demonstration.
 * @jurisdictions US (FDA), EU (EMA), IN (IPO), CN (CNIPA)
 */
const seedProductRegistry = () => {
  console.log('🧪 Seeding VantagePoint V3.0 Enterprise Database...');

  // 1. Initial Patents (100+ simulated)
  const jurisdictions = ['USA', 'EU', 'INDIA', 'CHINA', 'JAPAN'];
  const companies = ['ZenithQA', 'GlobalPharma', 'BioMed-X', 'OncoShield', 'NeuroVance'];
  const titles = [
    'Sustained Release Oncology API', 
    'Novel Lipid Nanoparticle for Vaccine Delivery', 
    'Monoclonal Antibody for Neuro-Degeneration', 
    'Small Molecule Inhibitor for Rare Autoimmune Disease',
    'Advanced Respiratory Formulation for COPD'
  ];

  for (let i = 1; i <= 100; i++) {
    const juris = jurisdictions[Math.floor(Math.random() * jurisdictions.length)];
    const filing = new Date(Date.now() - (Math.random() * 10 * 365 * 24 * 60 * 60 * 1000));
    const expiry = new Date(filing.getTime() + (20 * 365 * 24 * 60 * 60 * 1000));
    
    db.insert('patents', {
      id: uuidv4(),
      patentNumber: `${juris.slice(0,2)}${2020 + (i%5)}${String(i).padStart(4, '0')}`,
      title: `${titles[i%5]} (v${i})`,
      jurisdiction: juris,
      status: i % 4 === 0 ? 'GRANTED' : i % 3 === 0 ? 'EXAMINATION' : 'FILED',
      filingDate: filing.toISOString(),
      expiryDate: expiry.toISOString(),
      inventors: [`Dr. Scientist ${i}`, `Staff Researcher ${i+1}`],
      created_at: new Date().toISOString()
    });
  }

  // 2. Initial Drugs & APIs
  const drugs = [
    { name: 'OncoGuard-X', dosage: '100mg Tablet', composition: 'Active Onco-API (75%)' },
    { name: 'NeuroVance-RL', dosage: '50mg Sustained Release', composition: 'Neural-Inhibitor (50%)' },
    { name: 'RespiShield-v2', dosage: 'Inhaler 250mcg', composition: 'Bronchodilator (10%)' }
  ];

  drugs.forEach(d => {
    db.insert('drugs', { id: uuidv4(), ...d, created_at: new Date().toISOString() });
  });

  // 3. Initial Audit Logs
  db.insert('audit_logs', {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId: 'admin@zenithqa.com',
    action: 'SYSTEM_SEED',
    targetUrl: '/api/admin/seed',
    status: 200,
    msg: 'V3.0 Enterprise Core Seeded Successfully'
  });

  console.log('✅ 100+ Professional GxP Records Seeded.');
};

seedProductRegistry();
module.exports = seedProductRegistry;
