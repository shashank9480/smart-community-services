import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Comprehensive Smart Community Services Database Seeding...');

  // 1. Clean up existing data
  await prisma.comment.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.ticketUpdate.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ledger.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.staffReview.deleteMany();
  await prisma.staffAttendance.deleteMany();
  await prisma.staffAssignment.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.gateLog.deleteMany();
  await prisma.visitorPass.deleteMany();
  await prisma.sOSAlert.deleteMany();
  await prisma.user.deleteMany();
  await prisma.flat.deleteMany();
  await prisma.block.deleteMany();
  await prisma.society.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  const guardPasswordHash = await bcrypt.hash('guard123', 10);

  // 2. Create 3 Societies
  const societyPrestige = await prisma.society.create({
    data: {
      name: 'Prestige Tranquility',
      address: '124, Whitefield Main Road, Bangalore - 560066',
    },
  });

  const societyLakeView = await prisma.society.create({
    data: {
      name: 'Lake View',
      address: '45, Outer Ring Road, Bellandur, Bangalore - 560103',
    },
  });

  const societyLakeViewApts = await prisma.society.create({
    data: {
      name: 'Lake View Apartments',
      address: '88, Lake Front Road, Hebbal, Bangalore - 560024',
    },
  });

  console.log(`✅ Created 3 Societies: "${societyPrestige.name}", "${societyLakeView.name}", "${societyLakeViewApts.name}"`);

  // 3. Create Blocks for each society
  const blocksPrestige = await Promise.all([
    prisma.block.create({ data: { society_id: societyPrestige.id, name: 'Block A - Alpha' } }),
    prisma.block.create({ data: { society_id: societyPrestige.id, name: 'Block B - Beta' } }),
    prisma.block.create({ data: { society_id: societyPrestige.id, name: 'Block C - Gamma' } }),
  ]);

  const blocksLakeView = await Promise.all([
    prisma.block.create({ data: { society_id: societyLakeView.id, name: 'Tower 1' } }),
    prisma.block.create({ data: { society_id: societyLakeView.id, name: 'Tower 2' } }),
    prisma.block.create({ data: { society_id: societyLakeView.id, name: 'Tower 3' } }),
  ]);

  const blocksLakeViewApts = await Promise.all([
    prisma.block.create({ data: { society_id: societyLakeViewApts.id, name: 'Tower 1' } }),
    prisma.block.create({ data: { society_id: societyLakeViewApts.id, name: 'Tower 2' } }),
    prisma.block.create({ data: { society_id: societyLakeViewApts.id, name: 'Tower 3' } }),
  ]);

  console.log(`✅ Created Blocks for Prestige Tranquility, Lake View, and Lake View Apartments`);

  // 4. Create Flats
  const allFlatsPrestige = [];
  for (let bIdx = 0; bIdx < blocksPrestige.length; bIdx++) {
    const block = blocksPrestige[bIdx];
    const prefix = bIdx === 0 ? 'A' : bIdx === 1 ? 'B' : 'C';
    for (let f = 1; f <= 8; f++) {
      const flat = await prisma.flat.create({
        data: {
          block_id: block.id,
          number: `${prefix}-10${f}`,
          bhk_type: f % 2 === 0 ? '3BHK' : '2BHK',
          sqft: f % 2 === 0 ? 1550.0 : 1200.0,
        },
      });
      allFlatsPrestige.push(flat);
    }
  }

  const allFlatsLakeView = [];
  for (let bIdx = 0; bIdx < blocksLakeView.length; bIdx++) {
    const block = blocksLakeView[bIdx];
    const prefix = `T${bIdx + 1}`;
    for (let f = 1; f <= 4; f++) {
      const flat = await prisma.flat.create({
        data: {
          block_id: block.id,
          number: `${prefix}-${f}01`,
          bhk_type: f % 2 === 0 ? '3BHK' : '2BHK',
          sqft: f % 2 === 0 ? 1500.0 : 1200.0,
        },
      });
      allFlatsLakeView.push(flat);
    }
  }

  const allFlatsLakeViewApts = [];
  for (let bIdx = 0; bIdx < blocksLakeViewApts.length; bIdx++) {
    const block = blocksLakeViewApts[bIdx];
    const prefix = `T${bIdx + 1}`;
    for (let f = 1; f <= 4; f++) {
      const flat = await prisma.flat.create({
        data: {
          block_id: block.id,
          number: `${prefix}-${f}01`,
          bhk_type: f % 2 === 0 ? '3BHK' : '2BHK',
          sqft: f % 2 === 0 ? 1450.0 : 1180.0,
        },
      });
      allFlatsLakeViewApts.push(flat);
    }
  }

  console.log(`✅ Created ${allFlatsPrestige.length + allFlatsLakeView.length + allFlatsLakeViewApts.length} Flats across all societies`);

  // 5. Create Admins for each society
  const adminPrestige = await prisma.user.create({
    data: {
      name: 'Anand Sharma (Admin)',
      email: 'admin@smartcommunityservices.com',
      phone: '9876543210',
      password_hash: passwordHash,
      role: 'ADMIN',
      society_id: societyPrestige.id,
    },
  });

  const adminLakeView = await prisma.user.create({
    data: {
      name: 'Vikramaditya (Admin)',
      email: 'admin.lakeview@smartcommunityservices.com',
      phone: '9876543299',
      password_hash: passwordHash,
      role: 'ADMIN',
      society_id: societyLakeView.id,
    },
  });

  const adminLakeViewApts = await prisma.user.create({
    data: {
      name: 'Suhasini Rao (Admin)',
      email: 'admin.lakeviewapts@smartcommunityservices.com',
      phone: '9876543298',
      password_hash: passwordHash,
      role: 'ADMIN',
      society_id: societyLakeViewApts.id,
    },
  });

  console.log(`✅ Created Admins for all 3 societies`);

  // 6. Create Security Guards (at least 5 per society)
  const guardConfigs = [
    { society: societyPrestige, prefix: 'PT', names: ['Ramesh Singh (Main Gate)', 'Vikram Yadav (Service Gate)', 'Mahesh Verma (Block A)', 'Sunil Kumar (Block B)', 'Rajesh Patel (Parking Gate)'] },
    { society: societyLakeView, prefix: 'LV', names: ['Karan Vir (Main Gate)', 'Dharmendra Sharma (Service Gate)', 'Anoop Nair (Tower 1)', 'Suresh Babu (Tower 2)', 'Prakash Raj (CCTV Room)'] },
    { society: societyLakeViewApts, prefix: 'LVA', names: ['Manish Giri (Main Gate)', 'Deepak Jha (Service Gate)', 'Satish Pillai (North Gate)', 'Mukesh Gowda (South Gate)', 'Harish Sen (Patrol Guard)'] },
  ];

  const createdGuardsMap: Record<string, any[]> = {};

  for (const gc of guardConfigs) {
    createdGuardsMap[gc.society.id] = [];
    for (let gIdx = 0; gIdx < gc.names.length; gIdx++) {
      const gName = gc.names[gIdx];
      const guard = await prisma.user.create({
        data: {
          name: `${gName} - ${gc.society.name}`,
          email: `guard.${gc.prefix.toLowerCase()}${gIdx + 1}@smartcommunityservices.com`,
          phone: `9876${gc.prefix === 'PT' ? '11' : gc.prefix === 'LV' ? '22' : '33'}${gIdx + 10}`,
          password_hash: guardPasswordHash,
          role: 'GUARD',
          society_id: gc.society.id,
        },
      });
      createdGuardsMap[gc.society.id].push(guard);
    }
  }

  console.log(`✅ Created 5 Security Guards for every society (Total 15 Guards)`);

  // 7. Create Residents for each society
  const prestigeResidentsData = [
    { name: 'Priya Nair', email: 'resident1@smartcommunityservices.com', phone: '9876543213', flat: allFlatsPrestige[0] },
    { name: 'Siddharth Rao', email: 'resident2@smartcommunityservices.com', phone: '9876543214', flat: allFlatsPrestige[1] },
    { name: 'Kavita Menon', email: 'resident3@smartcommunityservices.com', phone: '9876543215', flat: allFlatsPrestige[2] },
    { name: 'Arjun Verma', email: 'resident4@smartcommunityservices.com', phone: '9876543216', flat: allFlatsPrestige[8] },
    { name: 'Neeraj Chopra', email: 'resident5@smartcommunityservices.com', phone: '9876543217', flat: allFlatsPrestige[9] },
    { name: 'Aarav Sharma', email: 'aarav.pt@society.com', phone: '9876543001', flat: allFlatsPrestige[3] },
    { name: 'Rohan Gupta', email: 'rohan.pt@society.com', phone: '9876543002', flat: allFlatsPrestige[4] },
    { name: 'Sneha Kulkarni', email: 'sneha.pt@society.com', phone: '9876543003', flat: allFlatsPrestige[10] },
    { name: 'Pooja Reddy', email: 'pooja.pt@society.com', phone: '9876543004', flat: allFlatsPrestige[16] },
    { name: 'Karan Malhotra', email: 'karan.pt@society.com', phone: '9876543005', flat: allFlatsPrestige[17] },
  ];

  const createdPrestigeResidents = [];
  for (const rData of prestigeResidentsData) {
    const resident = await prisma.user.create({
      data: {
        name: rData.name,
        email: rData.email,
        phone: rData.phone,
        password_hash: passwordHash,
        role: 'RESIDENT',
        society_id: societyPrestige.id,
        flat_id: rData.flat.id,
      },
    });
    await prisma.flat.update({ where: { id: rData.flat.id }, data: { owner_id: resident.id } });
    createdPrestigeResidents.push(resident);
  }

  const lakeViewResidentsData = [
    { name: 'Karan Sharma', email: 'karan.lakeview@smartcommunityservices.com', phone: '9876549901', flat: allFlatsLakeView[0] },
    { name: 'Priya Deshmukh', email: 'priya.lakeview@smartcommunityservices.com', phone: '9876549902', flat: allFlatsLakeView[1] },
    { name: 'Rahul Joshi', email: 'rahul.lakeview@smartcommunityservices.com', phone: '9876549903', flat: allFlatsLakeView[4] },
    { name: 'Sneha Patel', email: 'sneha.lakeview@smartcommunityservices.com', phone: '9876549904', flat: allFlatsLakeView[5] },
    { name: 'Amitabh Sen', email: 'amitabh.lakeview@smartcommunityservices.com', phone: '9876549905', flat: allFlatsLakeView[8] },
    { name: 'Meera Nair', email: 'meera.lakeview@smartcommunityservices.com', phone: '9876549906', flat: allFlatsLakeView[9] },
  ];

  const createdLakeViewResidents = [];
  for (const rData of lakeViewResidentsData) {
    const resident = await prisma.user.create({
      data: {
        name: `${rData.name} (${rData.flat.number})`,
        email: rData.email,
        phone: rData.phone,
        password_hash: passwordHash,
        role: 'RESIDENT',
        society_id: societyLakeView.id,
        flat_id: rData.flat.id,
      },
    });
    await prisma.flat.update({ where: { id: rData.flat.id }, data: { owner_id: resident.id } });
    createdLakeViewResidents.push(resident);
  }

  const lakeViewAptsResidentsData = [
    { name: 'Devendra Singh', email: 'devendra.lva@society.com', phone: '9876548801', flat: allFlatsLakeViewApts[0] },
    { name: 'Nisha Joshi', email: 'nisha.lva@society.com', phone: '9876548802', flat: allFlatsLakeViewApts[1] },
    { name: 'Rahul Mehta', email: 'rahul.lva@society.com', phone: '9876548803', flat: allFlatsLakeViewApts[4] },
    { name: 'Shweta Bhat', email: 'shweta.lva@society.com', phone: '9876548804', flat: allFlatsLakeViewApts[5] },
    { name: 'Deepak Agarwal', email: 'deepak.lva@society.com', phone: '9876548805', flat: allFlatsLakeViewApts[8] },
    { name: 'Divya Pillai', email: 'divya.lva@society.com', phone: '9876548806', flat: allFlatsLakeViewApts[9] },
  ];

  const createdLakeViewAptsResidents = [];
  for (const rData of lakeViewAptsResidentsData) {
    const resident = await prisma.user.create({
      data: {
        name: `${rData.name} (${rData.flat.number})`,
        email: rData.email,
        phone: rData.phone,
        password_hash: passwordHash,
        role: 'RESIDENT',
        society_id: societyLakeViewApts.id,
        flat_id: rData.flat.id,
      },
    });
    await prisma.flat.update({ where: { id: rData.flat.id }, data: { owner_id: resident.id } });
    createdLakeViewAptsResidents.push(resident);
  }

  console.log(`✅ Created Residents across Prestige Tranquility, Lake View, and Lake View Apartments`);

  // 8. Create Domestic Staff (5+ per society with ratings, assignments & reviews)
  const staffCatalog = [
    // Prestige Tranquility
    { name: 'Radha Devi (Housekeeping)', phone: '9123456780', category: 'Maid', rating: 4.8, society: societyPrestige, flats: [allFlatsPrestige[0], allFlatsPrestige[1]], reviewer: createdPrestigeResidents[0], comment: 'Punctual, thorough cleaning and very polite.' },
    { name: 'Suresh Kumar (Personal Driver)', phone: '9123456781', category: 'Driver', rating: 4.9, society: societyPrestige, flats: [allFlatsPrestige[0]], reviewer: createdPrestigeResidents[0], comment: 'Excellent driving skills and very reliable.' },
    { name: 'Lakshmi Narayan (Private Cook)', phone: '9123456782', category: 'Cook', rating: 4.7, society: societyPrestige, flats: [allFlatsPrestige[8]], reviewer: createdPrestigeResidents[3], comment: 'Prepares delicious and hygienic meals daily.' },
    { name: 'Gopal Plumber (Emergency Plumbing)', phone: '9123456783', category: 'Plumber', rating: 4.6, society: societyPrestige, flats: [allFlatsPrestige[2]], reviewer: createdPrestigeResidents[2], comment: 'Fixed bathroom pipe leak in 15 minutes.' },
    { name: 'Anita Electrician (MCB & Lighting)', phone: '9123456784', category: 'Electrician', rating: 5.0, society: societyPrestige, flats: [allFlatsPrestige[9]], reviewer: createdPrestigeResidents[4], comment: 'Fixed trip switch issue quickly.' },

    // Lake View
    { name: 'Shanta Devi (Lake View Housekeeping)', phone: '9876541001', category: 'Maid', rating: 4.9, society: societyLakeView, flats: [allFlatsLakeView[0], allFlatsLakeView[1]], reviewer: createdLakeViewResidents[0], comment: 'Highly reliable and punctual for Lake View towers.' },
    { name: 'Suresh Gowda (Lake View Driver)', phone: '9876541002', category: 'Driver', rating: 4.8, society: societyLakeView, flats: [allFlatsLakeView[0]], reviewer: createdLakeViewResidents[0], comment: 'Experienced driver, familiar with all city routes.' },
    { name: 'Chef Mohan (Lake View Private Cook)', phone: '9876541003', category: 'Cook', rating: 4.7, society: societyLakeView, flats: [allFlatsLakeView[4]], reviewer: createdLakeViewResidents[2], comment: 'Prepares delicious North & South Indian meals daily.' },
    { name: 'Ramesh Plumber (Lake View Maintenance)', phone: '9876541004', category: 'Plumber', rating: 5.0, society: societyLakeView, flats: [allFlatsLakeView[5]], reviewer: createdLakeViewResidents[3], comment: 'Quick emergency pipe repair in Tower 2.' },
    { name: 'Venkatesh (Lake View Senior Electrician)', phone: '9876541005', category: 'Electrician', rating: 4.9, society: societyLakeView, flats: [allFlatsLakeView[8]], reviewer: createdLakeViewResidents[4], comment: 'Fixed electrical short circuit instantly.' },

    // Lake View Apartments
    { name: 'Sunita Devi (LVA Housekeeping)', phone: '9876542001', category: 'Maid', rating: 4.8, society: societyLakeViewApts, flats: [allFlatsLakeViewApts[0]], reviewer: createdLakeViewAptsResidents[0], comment: 'Great service and trustworthy.' },
    { name: 'Mahesh Kumar (LVA Driver)', phone: '9876542002', category: 'Driver', rating: 4.7, society: societyLakeViewApts, flats: [allFlatsLakeViewApts[1]], reviewer: createdLakeViewAptsResidents[1], comment: 'Always on time for morning office commute.' },
    { name: 'Kavita Nambiar (LVA Cook)', phone: '9876542003', category: 'Cook', rating: 4.9, society: societyLakeViewApts, flats: [allFlatsLakeViewApts[4]], reviewer: createdLakeViewAptsResidents[2], comment: 'Wonderful home cooked meals.' },
    { name: 'Sanjay Carpenter (LVA Furniture Repair)', phone: '9876542004', category: 'Plumber', rating: 4.6, society: societyLakeViewApts, flats: [allFlatsLakeViewApts[5]], reviewer: createdLakeViewAptsResidents[3], comment: 'Fixed door hinges perfectly.' },
    { name: 'Vijay Electrician (LVA Maintenance)', phone: '9876542005', category: 'Electrician', rating: 4.9, society: societyLakeViewApts, flats: [allFlatsLakeViewApts[8]], reviewer: createdLakeViewAptsResidents[4], comment: 'Very skilled electrician.' },
  ];

  for (const stItem of staffCatalog) {
    const staff = await prisma.staff.create({
      data: {
        name: stItem.name,
        phone: stItem.phone,
        category: stItem.category,
        avg_rating: stItem.rating,
      },
    });

    // Assignments
    for (const fl of stItem.flats) {
      await prisma.staffAssignment.create({
        data: {
          staff_id: staff.id,
          flat_id: fl.id,
        },
      });
    }

    // Review
    if (stItem.reviewer) {
      await prisma.staffReview.create({
        data: {
          staff_id: staff.id,
          reviewer_id: stItem.reviewer.id,
          rating: Math.round(stItem.rating),
          comment: stItem.comment,
        },
      });
    }

    // Attendance
    const socGuards = createdGuardsMap[stItem.society.id];
    if (socGuards && socGuards.length > 0) {
      await prisma.staffAttendance.create({
        data: {
          staff_id: staff.id,
          flat_id: stItem.flats[0]?.id || null,
          punch_in: new Date(Date.now() - 2 * 3600 * 1000),
          verified_by: socGuards[0].id,
        },
      });
    }
  }

  console.log(`✅ Created Domestic Staff with ratings, reviews, flat assignments & gate attendance across all societies`);

  // 9. Facilities
  await prisma.facility.createMany({
    data: [
      { society_id: societyPrestige.id, name: 'Grand Clubhouse & Lounge', type: 'Clubhouse', rules: 'Max 30 guests. No outside catering without approval.', slot_duration: 120 },
      { society_id: societyPrestige.id, name: 'Olympic Swimming Pool', type: 'Pool', rules: 'Swim cap mandatory. Children must be supervised.', slot_duration: 60 },
      { society_id: societyPrestige.id, name: 'Synthetic Tennis Court', type: 'Tennis', rules: 'Non-marking shoes required.', slot_duration: 60 },
      { society_id: societyLakeView.id, name: 'Lakefront Deck & Party Lawn', type: 'Clubhouse', rules: 'Advance booking required 2 days prior.', slot_duration: 180 },
      { society_id: societyLakeView.id, name: 'Lake View Badminton Court', type: 'Tennis', rules: 'Strict indoor court shoes required.', slot_duration: 60 },
      { society_id: societyLakeViewApts.id, name: 'Community Gymnasium & Yoga Hall', type: 'Clubhouse', rules: 'Carry clean towel and water bottle.', slot_duration: 60 },
    ],
  });

  console.log(`✅ Created Facilities for all societies`);

  // 10. Visitor Passes & Parcels
  await prisma.visitorPass.create({
    data: {
      code: '849201',
      created_by: adminPrestige.id,
      guest_name: 'Rajesh Kumar (Interior Consultant)',
      purpose: 'Flat Inspection',
      valid_from: new Date(),
      valid_to: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'active',
    },
  });

  await prisma.parcel.create({
    data: {
      flat_id: allFlatsPrestige[0].id,
      guard_id: createdGuardsMap[societyPrestige.id][0].id,
      otp: '4829',
      status: 'pending',
    },
  });

  console.log(`✅ Created Visitor Passes & Delivery Parcels`);

  // 11. Maintenance Invoices
  await prisma.invoice.createMany({
    data: [
      { flat_id: allFlatsPrestige[0].id, month: '2026-07', amount: 4500, breakdown_json: JSON.stringify({ maintenance: 3000, sinking_fund: 500, water_charges: 600, parking: 400 }), due_date: new Date('2026-08-05'), status: 'pending' },
      { flat_id: allFlatsPrestige[1].id, month: '2026-07', amount: 5200, breakdown_json: JSON.stringify({ maintenance: 3500, sinking_fund: 500, water_charges: 800, parking: 400 }), due_date: new Date('2026-08-05'), status: 'paid' },
      { flat_id: allFlatsLakeView[0].id, month: '2026-07', amount: 4800, breakdown_json: JSON.stringify({ maintenance: 3200, sinking_fund: 600, water_charges: 600, parking: 400 }), due_date: new Date('2026-08-05'), status: 'pending' },
      { flat_id: allFlatsLakeViewApts[0].id, month: '2026-07', amount: 4600, breakdown_json: JSON.stringify({ maintenance: 3100, sinking_fund: 500, water_charges: 600, parking: 400 }), due_date: new Date('2026-08-05'), status: 'paid' },
    ],
  });

  console.log(`✅ Created Maintenance Invoices`);

  // 12. Notices
  await prisma.notice.createMany({
    data: [
      { society_id: societyPrestige.id, posted_by: adminPrestige.id, title: '📢 Annual Society General Body Meeting (AGM 2026)', body: 'Dear Residents, our annual general body meeting will take place this Sunday at 10:00 AM in the Grand Clubhouse.' },
      { society_id: societyLakeView.id, posted_by: adminLakeView.id, title: '🌊 Lake View Water Tank Cleaning Schedule', body: 'Overhead water tank maintenance scheduled for Tower 1 & 2 on Saturday 9 AM to 1 PM.' },
      { society_id: societyLakeViewApts.id, posted_by: adminLakeViewApts.id, title: '⚡ Solar Rooftop Energy Panel Audit', body: 'Green Energy Committee inspecting rooftop solar setup this Thursday.' },
    ],
  });

  console.log(`✅ Created Notices`);

  console.log('\n🎉 Comprehensive Master Database Seeding Completed Successfully!');
  console.log('---------------------------------------------------------');
  console.log('🔑 Demo Login Credentials (Passwords: password123 | Guards: guard123):');
  console.log('   Prestige Admin:     admin@smartcommunityservices.com');
  console.log('   Lake View Admin:    admin.lakeview@smartcommunityservices.com');
  console.log('   Lake View Apts Admin: admin.lakeviewapts@smartcommunityservices.com');
  console.log('   Prestige Guard 1:   guard.pt1@smartcommunityservices.com');
  console.log('   Lake View Guard 1:  guard.lv1@smartcommunityservices.com');
  console.log('   Lake View Apts Gd 1:guard.lva1@smartcommunityservices.com');
  console.log('   Prestige Resident:  resident1@smartcommunityservices.com (Priya Nair)');
  console.log('   Lake View Resident: karan.lakeview@smartcommunityservices.com (Karan Sharma)');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error during master seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

