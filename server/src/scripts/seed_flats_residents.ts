import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function addFlatsAndResidents() {
  console.log('🚀 Adding 20+ flats and resident users across all blocks and towers...');

  const passwordHash = await bcrypt.hash('resident123', 10);

  // 1. Get or create societies
  let prestigeSociety = await prisma.society.findFirst({
    where: { name: 'Prestige Tranquility' },
  });
  if (!prestigeSociety) {
    prestigeSociety = await prisma.society.create({
      data: {
        name: 'Prestige Tranquility',
        address: '124, Whitefield Main Road, Bangalore',
      },
    });
  }

  let lakeViewSociety = await prisma.society.findFirst({
    where: { name: 'Lake View Apartments' },
  });
  if (!lakeViewSociety) {
    lakeViewSociety = await prisma.society.create({
      data: {
        name: 'Lake View Apartments',
        address: '88, Outer Ring Road, Bangalore',
      },
    });
  }

  // 2. Ensure all blocks exist
  const blockDefs = [
    { society_id: prestigeSociety.id, name: 'Block A - Alpha', prefix: 'A' },
    { society_id: prestigeSociety.id, name: 'Block B - Beta', prefix: 'B' },
    { society_id: prestigeSociety.id, name: 'Block C', prefix: 'C' },
    { society_id: lakeViewSociety.id, name: 'Tower 1', prefix: 'T1' },
    { society_id: lakeViewSociety.id, name: 'Tower 2', prefix: 'T2' },
    { society_id: lakeViewSociety.id, name: 'Tower 3', prefix: 'T3' },
  ];

  const blocksMap: Array<{ id: string; name: string; prefix: string; society_id: string }> = [];

  for (const bDef of blockDefs) {
    let block = await prisma.block.findFirst({
      where: { society_id: bDef.society_id, name: bDef.name },
    });
    if (!block) {
      block = await prisma.block.create({
        data: {
          society_id: bDef.society_id,
          name: bDef.name,
        },
      });
    }
    blocksMap.push({ id: block.id, name: block.name, prefix: bDef.prefix, society_id: bDef.society_id });
  }

  const sampleNames = [
    'Aarav Sharma', 'Ananya Iyer', 'Rohan Gupta', 'Meera Deshmukh',
    'Vikram Patel', 'Sneha Kulkarni', 'Aditya Verma', 'Pooja Reddy',
    'Karan Malhotra', 'Ritu Saxena', 'Devendra Singh', 'Nisha Joshi',
    'Rahul Mehta', 'Shweta Bhat', 'Deepak Agarwal', 'Divya Pillai',
    'Siddharth Kapoor', 'Swati Das', 'Amitabh Roy', 'Sunita Rao',
    'Manish Choudhary', 'Geeta Nambiar', 'Tarun Jain', 'Alka Pandey'
  ];

  let createdFlatsCount = 0;
  let createdUsersCount = 0;

  // We want to generate ~4 flats per block across 6 blocks = 24 new flats & residents
  let nameIndex = 0;

  for (const blk of blocksMap) {
    for (let floor = 2; floor <= 5; floor++) {
      const flatNumber = `${blk.prefix}-${floor}01`;
      
      // Check if flat already exists
      let flat = await prisma.flat.findFirst({
        where: { block_id: blk.id, number: flatNumber },
      });

      if (!flat) {
        flat = await prisma.flat.create({
          data: {
            block_id: blk.id,
            number: flatNumber,
            bhk_type: floor % 2 === 0 ? '3BHK' : '2BHK',
            sqft: floor % 2 === 0 ? 1450.0 : 1180.0,
          },
        });
        createdFlatsCount++;
      }

      // Create a resident for this flat if flat has no residents
      const existingResident = await prisma.user.findFirst({
        where: { flat_id: flat.id },
      });

      if (!existingResident) {
        const resName = sampleNames[nameIndex % sampleNames.length];
        const uniqueEmail = `resident.${blk.prefix.toLowerCase()}${floor}01.${Date.now()}@society.com`;
        const uniquePhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

        const user = await prisma.user.create({
          data: {
            name: `${resName} (${flatNumber})`,
            email: uniqueEmail,
            phone: uniquePhone,
            password_hash: passwordHash,
            role: 'RESIDENT',
            society_id: blk.society_id,
            flat_id: flat.id,
          },
        });

        // Link as flat owner
        await prisma.flat.update({
          where: { id: flat.id },
          data: { owner_id: user.id },
        });

        createdUsersCount++;
        nameIndex++;
      }
    }
  }

  console.log(`✅ Successfully added ${createdFlatsCount} new flats and ${createdUsersCount} resident accounts across all 6 blocks/towers!`);
}

addFlatsAndResidents()
  .catch((err) => {
    console.error('Error adding flats and residents:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
