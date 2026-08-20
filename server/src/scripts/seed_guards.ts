import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedGuardsForSocieties() {
  console.log('🚀 Seeding at least 5 Security Guards for every society in the database...');

  const passwordHash = await bcrypt.hash('guard123', 10);

  // 1. Fetch all societies
  const societies = await prisma.society.findMany();

  if (societies.length === 0) {
    console.log('No societies found! Creating default society...');
    const s1 = await prisma.society.create({
      data: { name: 'Prestige Tranquility', address: '124, Whitefield Main Road, Bangalore' },
    });
    societies.push(s1);
  }

  const guardTemplates = [
    { name: 'Ramesh Singh (Main Gate 1)' },
    { name: 'Vikram Yadav (Service Gate B)' },
    { name: 'Mahesh Verma (North Tower Post)' },
    { name: 'Sunil Kumar (South Entry Gate)' },
    { name: 'Rajesh Patel (Basement & Parking Duty)' },
    { name: 'Dharmendra Sharma (Visitor Reception)' },
    { name: 'Karan Vir (East Patrol Wing)' },
  ];

  let totalGuardsCreated = 0;

  for (const soc of societies) {
    // Check current guard count for this society
    const existingGuards = await prisma.user.findMany({
      where: { society_id: soc.id, role: 'GUARD' },
    });

    console.log(`\n📌 Society: "${soc.name}" (Currently has ${existingGuards.length} guards)`);

    const guardsNeeded = Math.max(0, 5 - existingGuards.length);

    if (guardsNeeded === 0) {
      console.log(`   ✅ Already has ${existingGuards.length} guards (meets 5 minimum requirement).`);
      continue;
    }

    const socShortId = soc.id.substring(0, 6);

    for (let i = 0; i < guardsNeeded; i++) {
      const currentTotal = existingGuards.length + i + 1;
      const gIndex = (currentTotal - 1) % guardTemplates.length;
      const gTpl = guardTemplates[gIndex];

      const guardName = `${gTpl.name} - ${soc.name}`;
      const uniqueEmail = `guard.${socShortId}.${currentTotal}@smartcommunityservices.com`;
      const uniquePhone = `9876${Math.floor(100000 + Math.random() * 900000)}`;

      await prisma.user.create({
        data: {
          name: guardName,
          email: uniqueEmail,
          phone: uniquePhone,
          password_hash: passwordHash,
          role: 'GUARD',
          society_id: soc.id,
        },
      });

      totalGuardsCreated++;
      console.log(`   ➕ Created Guard: "${guardName}" (${uniqueEmail})`);
    }
  }

  console.log(`\n🎉 Successfully added ${totalGuardsCreated} security guards! Every society now has at least 5 guards.`);
}

seedGuardsForSocieties()
  .catch((err) => {
    console.error('Error seeding guards:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
