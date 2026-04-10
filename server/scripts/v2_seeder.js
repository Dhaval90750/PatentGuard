const fs = require('fs');
const path = require('path');
const prisma = require('../services/prisma');

async function seedV2() {
  console.log('🚀 Starting VantagePoint V2 Data Migration...');

  try {
    const rawData = fs.readFileSync(path.join(__dirname, '../data/database.json'), 'utf8');
    const data = JSON.parse(rawData);

    // 1. Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing database records...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.document.deleteMany();
    await prisma.drug.deleteMany();
    await prisma.api.deleteMany();
    await prisma.patent.deleteMany();
    await prisma.user.deleteMany();

    // 2. Seed Users
    console.log('👤 Seeding Users...');
    for (const user of data.users) {
      await prisma.user.create({
        data: {
          id: user.id || undefined,
          username: user.username,
          password: user.password,
          role: user.role,
        }
      });
    }

    // 3. Seed Patents
    console.log('📜 Seeding Patents...');
    for (const patent of data.patents) {
      await prisma.patent.create({
        data: {
          id: patent.id,
          patentNumber: patent.patentNumber,
          title: patent.title,
          jurisdiction: patent.jurisdiction,
          status: patent.status,
          filingDate: new Date(patent.filingDate),
          expiryDate: new Date(patent.expiryDate),
          inventors: patent.inventors,
          created_at: new Date(patent.created_at),
        }
      });
    }

    // 4. Seed APIs (with Relations to Patents)
    console.log('🧪 Seeding APIs and linking to Patents...');
    for (const api of data.apis) {
      await prisma.api.create({
        data: {
          id: api.id,
          name: api.name,
          molecularFormula: api.molecularFormula,
          manufacturer: api.manufacturer,
          created_at: new Date(api.created_at),
          patents: {
            connect: api.linkedPatents.map(pid => ({ id: pid }))
          }
        }
      });
    }

    // 5. Seed Drugs (with Relations to APIs)
    console.log('💊 Seeding Drugs and linking to APIs...');
    for (const drug of data.drugs) {
      await prisma.drug.create({
        data: {
          id: drug.id,
          name: drug.name,
          dosageForm: drug.dosageForm,
          composition: drug.composition,
          manufacturer: drug.manufacturer,
          created_at: new Date(drug.created_at),
          apis: {
            connect: drug.linkedApis.map(aid => ({ id: aid }))
          }
        }
      });
    }

    // 6. Seed Notifications
    console.log('🔔 Seeding Notifications...');
    for (const notif of data.notifications) {
      await prisma.notification.create({
        data: {
          id: notif.id,
          severity: notif.severity,
          title: notif.title,
          message: notif.message,
          timestamp: new Date(notif.timestamp),
          read: notif.read,
        }
      });
    }

    // 7. Seed Documents
    console.log('📂 Seeding Documents...');
    for (const doc of data.documents) {
      await prisma.document.create({
        data: {
          id: doc.id,
          name: doc.name,
          version: doc.version,
          status: doc.status,
          author: doc.author,
          date: new Date(doc.date),
          type: doc.type,
          folder: doc.folder,
          jurisdiction: doc.jurisdiction || null,
          history: doc.history,
        }
      });
    }

    // 8. Seed Audit Logs
    console.log('🛡️ Seeding Audit Logs...');
    for (const log of data.audit_logs) {
      await prisma.auditLog.create({
        data: {
          id: log.id.length > 36 ? undefined : log.id, // Handle non-UUID IDs if necessary
          timestamp: new Date(log.timestamp),
          userId: log.userId,
          action: log.action,
          target: log.target || log.targetUrl,
          status: log.status,
          sig: log.sig,
          ipAddress: log.ipAddress,
        }
      });
    }

    console.log('✨ VantagePoint V2 Migration Completed Successfully!');
  } catch (error) {
    console.error('❌ Migration Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedV2();
