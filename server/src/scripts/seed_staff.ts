import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStaffForSocieties() {
  console.log('🌱 Seeding 5+ domestic staff members per society with ratings and assignments...');

  const societies = await prisma.society.findMany({
    include: {
      blocks: {
        include: {
          flats: true,
        },
      },
      users: true,
    },
  });

  if (societies.length === 0) {
    console.log('⚠️ No societies found. Run main database seed first.');
    return;
  }

  // Categories templates for 5 staff per society
  const staffTemplates = [
    { nameSuffix: 'Devi (Housekeeping)', category: 'Maid', rating: 4.8, comment: 'Always punctual, thorough cleaning and trustworthy.' },
    { nameSuffix: 'Kumar (Personal Driver)', category: 'Driver', rating: 4.9, comment: 'Safe driver, well maintained vehicle log.' },
    { nameSuffix: 'Ram (Private Cook)', category: 'Cook', rating: 4.7, comment: 'Great North & South Indian dishes, highly recommended.' },
    { nameSuffix: 'Singh (Senior Plumber)', category: 'Plumber', rating: 4.6, comment: 'Fixed pipe leakage quickly during emergency.' },
    { nameSuffix: 'Sharma (Resident Electrician)', category: 'Electrician', rating: 5.0, comment: 'Prompt work, solved MCB tripping issue.' },
  ];

  const prefixNames = ['Sunita', 'Ramesh', 'Lakshmi', 'Gopal', 'Anita', 'Mahesh', 'Kavita', 'Sanjay', 'Radha', 'Vijay'];

  let totalStaffCreated = 0;
  let totalAssignments = 0;
  let totalReviews = 0;

  for (let sIdx = 0; sIdx < societies.length; sIdx++) {
    const society = societies[sIdx];
    const allFlatsInSociety = society.blocks.flatMap((b) => b.flats);
    const residentsInSociety = society.users.filter((u) => u.role === 'RESIDENT');
    const guardsInSociety = society.users.filter((u) => u.role === 'GUARD');

    // Find fallback guard for verifications
    const guardUser = guardsInSociety[0] || (await prisma.user.findFirst({ where: { role: 'GUARD' } }));
    const residentUser = residentsInSociety[0] || (await prisma.user.findFirst({ where: { role: 'RESIDENT' } }));

    console.log(`\n🏢 Processing Society: "${society.name}" (${allFlatsInSociety.length} flats, ${residentsInSociety.length} residents)`);

    for (let tIdx = 0; tIdx < staffTemplates.length; tIdx++) {
      const template = staffTemplates[tIdx];
      const firstName = prefixNames[(sIdx * 5 + tIdx) % prefixNames.length];
      const staffName = `${firstName} ${template.nameSuffix}`;
      const uniquePhone = `98${sIdx}${tIdx}${Math.floor(10000 + Math.random() * 90000)}`;

      // Check if staff already exists by phone
      let staff = await prisma.staff.findFirst({
        where: { name: staffName },
      });

      if (!staff) {
        staff = await prisma.staff.create({
          data: {
            name: staffName,
            phone: uniquePhone,
            category: template.category,
            avg_rating: template.rating,
          },
        });
        totalStaffCreated++;
      }

      // Assign to 1-2 flats in this society if flats exist
      if (allFlatsInSociety.length > 0) {
        const flat1 = allFlatsInSociety[tIdx % allFlatsInSociety.length];
        const existingAssignment1 = await prisma.staffAssignment.findUnique({
          where: { staff_id_flat_id: { staff_id: staff.id, flat_id: flat1.id } },
        });

        if (!existingAssignment1) {
          await prisma.staffAssignment.create({
            data: { staff_id: staff.id, flat_id: flat1.id },
          });
          totalAssignments++;
        }

        if (allFlatsInSociety.length > 1) {
          const flat2 = allFlatsInSociety[(tIdx + 1) % allFlatsInSociety.length];
          const existingAssignment2 = await prisma.staffAssignment.findUnique({
            where: { staff_id_flat_id: { staff_id: staff.id, flat_id: flat2.id } },
          });

          if (!existingAssignment2 && flat2.id !== flat1.id) {
            await prisma.staffAssignment.create({
              data: { staff_id: staff.id, flat_id: flat2.id },
            });
            totalAssignments++;
          }
        }
      }

      // Create a resident review
      if (residentUser) {
        const existingReview = await prisma.staffReview.findFirst({
          where: { staff_id: staff.id, reviewer_id: residentUser.id },
        });

        if (!existingReview) {
          await prisma.staffReview.create({
            data: {
              staff_id: staff.id,
              reviewer_id: residentUser.id,
              rating: Math.round(template.rating),
              comment: template.comment,
            },
          });
          totalReviews++;
        }
      }

      // Create a gate punch attendance record
      if (guardUser) {
        const activeAttendance = await prisma.staffAttendance.findFirst({
          where: { staff_id: staff.id },
        });

        if (!activeAttendance) {
          await prisma.staffAttendance.create({
            data: {
              staff_id: staff.id,
              flat_id: allFlatsInSociety[0]?.id || null,
              punch_in: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
              verified_by: guardUser.id,
            },
          });
        }
      }
    }
  }

  console.log(`\n🎉 Successfully seeded staff across ${societies.length} societies!`);
  console.log(`📊 Total New Staff: ${totalStaffCreated}`);
  console.log(`🔗 Total Flat Assignments: ${totalAssignments}`);
  console.log(`⭐ Total Resident Reviews: ${totalReviews}`);
}

seedStaffForSocieties()
  .catch((e) => {
    console.error('Error seeding staff:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
