import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedLakeViewFull() {
  console.log('🚀 Seeding flats, residents, and domestic staff for "Lake View "...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Get Lake View society
  const lakeView = await prisma.society.findFirst({
    where: {
      OR: [
        { name: 'Lake View ' },
        { name: 'Lake View' },
        { name: { contains: 'Lake View' } },
      ],
    },
    include: {
      blocks: true,
      users: true,
    },
  });

  if (!lakeView) {
    console.error('❌ Lake View society not found!');
    return;
  }

  console.log(`✅ Found Society: "${lakeView.name}" (${lakeView.id})`);

  // Ensure blocks exist
  let blocks = lakeView.blocks;
  if (blocks.length === 0) {
    const b1 = await prisma.block.create({ data: { society_id: lakeView.id, name: 'Tower 1' } });
    const b2 = await prisma.block.create({ data: { society_id: lakeView.id, name: 'Tower 2' } });
    const b3 = await prisma.block.create({ data: { society_id: lakeView.id, name: 'Tower 3' } });
    blocks = [b1, b2, b3];
  }

  // 2. Create Flats for Lake View
  const createdFlats = [];
  for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
    const block = blocks[bIdx];
    const prefix = `T${bIdx + 1}`;

    for (let floor = 1; floor <= 4; floor++) {
      const flatNum = `${prefix}-${floor}01`;
      let flat = await prisma.flat.findFirst({
        where: { block_id: block.id, number: flatNum },
      });

      if (!flat) {
        flat = await prisma.flat.create({
          data: {
            block_id: block.id,
            number: flatNum,
            bhk_type: floor % 2 === 0 ? '3BHK' : '2BHK',
            sqft: floor % 2 === 0 ? 1500.0 : 1200.0,
          },
        });
      }
      createdFlats.push(flat);
    }
  }

  console.log(`✅ Created ${createdFlats.length} flats across Lake View towers.`);

  // 3. Create Residents for Lake View
  const residentDefs = [
    { name: 'Karan Sharma', email: 'karan.lakeview@smartcommunityservices.com', phone: '9876549901' },
    { name: 'Priya Deshmukh', email: 'priya.lakeview@smartcommunityservices.com', phone: '9876549902' },
    { name: 'Rahul Joshi', email: 'rahul.lakeview@smartcommunityservices.com', phone: '9876549903' },
    { name: 'Sneha Patel', email: 'sneha.lakeview@smartcommunityservices.com', phone: '9876549904' },
    { name: 'Amitabh Sen', email: 'amitabh.lakeview@smartcommunityservices.com', phone: '9876549905' },
    { name: 'Meera Nair', email: 'meera.lakeview@smartcommunityservices.com', phone: '9876549906' },
  ];

  const createdResidents = [];
  for (let rIdx = 0; rIdx < residentDefs.length; rIdx++) {
    const rDef = residentDefs[rIdx];
    const targetFlat = createdFlats[rIdx % createdFlats.length];

    let user = await prisma.user.findFirst({
      where: { email: rDef.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${rDef.name} (${targetFlat.number})`,
          email: rDef.email,
          phone: rDef.phone,
          password_hash: passwordHash,
          role: 'RESIDENT',
          society_id: lakeView.id,
          flat_id: targetFlat.id,
        },
      });

      await prisma.flat.update({
        where: { id: targetFlat.id },
        data: { owner_id: user.id },
      });
    }
    createdResidents.push(user);
  }

  console.log(`✅ Created ${createdResidents.length} resident accounts for Lake View.`);

  // 4. Create 5 Domestic Staff for Lake View
  const staffDefs = [
    { name: 'Shanta Devi (Lake View Housekeeping)', category: 'Maid', rating: 4.9, comment: 'Punctual, thorough cleaning, highly reliable for Lake View towers.' },
    { name: 'Suresh Gowda (Lake View Driver)', category: 'Driver', rating: 4.8, comment: 'Experienced driver, familiar with all city routes.' },
    { name: 'Chef Mohan (Lake View Private Cook)', category: 'Cook', rating: 4.7, comment: 'Prepares delicious North & South Indian meals daily.' },
    { name: 'Ramesh Plumber (Lake View Maintenance)', category: 'Plumber', rating: 5.0, comment: 'Quick emergency pipe repair in Tower 1.' },
    { name: 'Venkatesh (Lake View Senior Electrician)', category: 'Electrician', rating: 4.9, comment: 'Fixed electrical short circuit instantly.' },
  ];

  const guardUser = await prisma.user.findFirst({
    where: { society_id: lakeView.id, role: 'GUARD' },
  }) || (await prisma.user.findFirst({ where: { role: 'GUARD' } }));

  for (let sIdx = 0; sIdx < staffDefs.length; sIdx++) {
    const stDef = staffDefs[sIdx];
    const phone = `987654${(sIdx + 10).toString().padStart(4, '0')}`;

    let staff = await prisma.staff.findFirst({
      where: { name: stDef.name },
    });

    if (!staff) {
      staff = await prisma.staff.create({
        data: {
          name: stDef.name,
          phone: phone,
          category: stDef.category,
          avg_rating: stDef.rating,
        },
      });
    }

    // Link staff to flats in Lake View
    const flat1 = createdFlats[sIdx % createdFlats.length];
    const flat2 = createdFlats[(sIdx + 1) % createdFlats.length];

    const assign1 = await prisma.staffAssignment.findUnique({
      where: { staff_id_flat_id: { staff_id: staff.id, flat_id: flat1.id } },
    });
    if (!assign1) {
      await prisma.staffAssignment.create({
        data: { staff_id: staff.id, flat_id: flat1.id },
      });
    }

    if (flat2.id !== flat1.id) {
      const assign2 = await prisma.staffAssignment.findUnique({
        where: { staff_id_flat_id: { staff_id: staff.id, flat_id: flat2.id } },
      });
      if (!assign2) {
        await prisma.staffAssignment.create({
          data: { staff_id: staff.id, flat_id: flat2.id },
        });
      }
    }

    // Add Resident Review
    const resident = createdResidents[sIdx % createdResidents.length];
    if (resident) {
      const rev = await prisma.staffReview.findFirst({
        where: { staff_id: staff.id, reviewer_id: resident.id },
      });
      if (!rev) {
        await prisma.staffReview.create({
          data: {
            staff_id: staff.id,
            reviewer_id: resident.id,
            rating: Math.round(stDef.rating),
            comment: stDef.comment,
          },
        });
      }
    }

    // Add Gate Attendance
    if (guardUser) {
      const att = await prisma.staffAttendance.findFirst({
        where: { staff_id: staff.id },
      });
      if (!att) {
        await prisma.staffAttendance.create({
          data: {
            staff_id: staff.id,
            flat_id: flat1.id,
            punch_in: new Date(Date.now() - 2 * 3600 * 1000),
            verified_by: guardUser.id,
          },
        });
      }
    }
  }

  console.log(`🎉 Successfully added 5 Domestic Staff members, flats, and residents for Lake View!`);
}

seedLakeViewFull()
  .catch((e) => {
    console.error('Error seeding Lake View:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
