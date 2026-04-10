require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SQLite Database (Prisma 6)...');
  console.log('DATABASE_URL is:', process.env.DATABASE_URL);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin@zenithqa.com' },
    update: { password: 'password123' },
    create: {
      username: 'admin@zenithqa.com',
      password: 'password123',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Create some sample patents
  await prisma.patent.upsert({
    where: { patentNumber: 'US20240001' },
    update: {},
    create: {
      patentNumber: 'US20240001',
      title: 'Advanced Lipid Nanoparticle System',
      jurisdiction: 'USA',
      status: 'GRANTED',
      filingDate: new Date('2024-01-15'),
      expiryDate: new Date('2044-01-15'),
      inventors: ['Dr. Alice Smith', 'Dr. Bob Jones'],
      semantic_tags: ['LNP', 'Vaccine', 'Delivery'],
    }
  });

  console.log('✅ Sample data seeded.');
}

main()
  .catch((e) => {
    console.error('❌ SEED ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
