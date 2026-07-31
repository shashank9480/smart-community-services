"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting Smart Community Services database seeding...');
    // Clean up existing data
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
    const passwordHash = await bcrypt_1.default.hash('password123', 10);
    // 1. Create Society
    const society = await prisma.society.create({
        data: {
            name: 'Prestige Tranquility',
            address: '124, Whitefield Main Road, Bangalore - 560066',
        },
    });
    console.log(`✅ Society created: ${society.name} (${society.id})`);
    // 2. Create Blocks
    const blockA = await prisma.block.create({
        data: {
            society_id: society.id,
            name: 'Block A - Alpha',
        },
    });
    const blockB = await prisma.block.create({
        data: {
            society_id: society.id,
            name: 'Block B - Beta',
        },
    });
    console.log(`✅ Blocks created: ${blockA.name}, ${blockB.name}`);
    // 3. Create Flats (8 flats)
    const flats = [];
    for (let i = 1; i <= 4; i++) {
        const flatA = await prisma.flat.create({
            data: {
                block_id: blockA.id,
                number: `A-10${i}`,
                bhk_type: i % 2 === 0 ? '3BHK' : '2BHK',
                sqft: i % 2 === 0 ? 1550.0 : 1200.0,
            },
        });
        flats.push(flatA);
    }
    for (let i = 1; i <= 4; i++) {
        const flatB = await prisma.flat.create({
            data: {
                block_id: blockB.id,
                number: `B-10${i}`,
                bhk_type: i % 2 === 0 ? '3BHK' : '2BHK',
                sqft: i % 2 === 0 ? 1600.0 : 1250.0,
            },
        });
        flats.push(flatB);
    }
    console.log(`✅ Created ${flats.length} Flats across Block A and Block B`);
    // 4. Create Users (1 Admin, 2 Guards, 5 Residents)
    const admin = await prisma.user.create({
        data: {
            name: 'Anand Sharma (Society Admin)',
            email: 'admin@smartcommunityservices.com',
            phone: '9876543210',
            password_hash: passwordHash,
            role: 'ADMIN',
            society_id: society.id,
        },
    });
    console.log(`✅ Admin created: ${admin.email} (password: password123)`);
    const guard1 = await prisma.user.create({
        data: {
            name: 'Ramesh Singh (Main Gate Guard)',
            email: 'guard1@smartcommunityservices.com',
            phone: '9876543211',
            password_hash: passwordHash,
            role: 'GUARD',
            society_id: society.id,
        },
    });
    const guard2 = await prisma.user.create({
        data: {
            name: 'Vikram Yadav (Service Gate Guard)',
            email: 'guard2@smartcommunityservices.com',
            phone: '9876543212',
            password_hash: passwordHash,
            role: 'GUARD',
            society_id: society.id,
        },
    });
    console.log(`✅ Guards created: ${guard1.email}, ${guard2.email} (password: password123)`);
    const residentNames = [
        { name: 'Priya Nair', email: 'resident1@smartcommunityservices.com', phone: '9876543213', flatIndex: 0 }, // A-101
        { name: 'Siddharth Rao', email: 'resident2@smartcommunityservices.com', phone: '9876543214', flatIndex: 1 }, // A-102
        { name: 'Kavita Menon', email: 'resident3@smartcommunityservices.com', phone: '9876543215', flatIndex: 2 }, // A-103
        { name: 'Arjun Verma', email: 'resident4@smartcommunityservices.com', phone: '9876543216', flatIndex: 4 }, // B-101
        { name: 'Neeraj Chopra', email: 'resident5@smartcommunityservices.com', phone: '9876543217', flatIndex: 5 }, // B-102
    ];
    for (const res of residentNames) {
        const residentUser = await prisma.user.create({
            data: {
                name: res.name,
                email: res.email,
                phone: res.phone,
                password_hash: passwordHash,
                role: 'RESIDENT',
                society_id: society.id,
                flat_id: flats[res.flatIndex].id,
            },
        });
        // Link as owner
        await prisma.flat.update({
            where: { id: flats[res.flatIndex].id },
            data: { owner_id: residentUser.id },
        });
    }
    console.log(`✅ Created ${residentNames.length} Resident users assigned to flats (password: password123)`);
    // 5. Create Staff members
    const staff1 = await prisma.staff.create({
        data: {
            name: 'Radha Devi',
            phone: '9123456780',
            category: 'Maid',
            avg_rating: 4.8,
        },
    });
    const staff2 = await prisma.staff.create({
        data: {
            name: 'Suresh Kumar',
            phone: '9123456781',
            category: 'Driver',
            avg_rating: 4.9,
        },
    });
    const staff3 = await prisma.staff.create({
        data: {
            name: 'Lakshmi Narayan',
            phone: '9123456782',
            category: 'Cook',
            avg_rating: 4.7,
        },
    });
    // Assign staff to flats
    await prisma.staffAssignment.create({ data: { staff_id: staff1.id, flat_id: flats[0].id } });
    await prisma.staffAssignment.create({ data: { staff_id: staff1.id, flat_id: flats[1].id } });
    await prisma.staffAssignment.create({ data: { staff_id: staff2.id, flat_id: flats[0].id } });
    await prisma.staffAssignment.create({ data: { staff_id: staff3.id, flat_id: flats[4].id } });
    console.log('✅ Created demo domestic staff members (Radha, Suresh, Lakshmi)');
    // 6. Create Demo Facilities (ready for Module 6)
    await prisma.facility.createMany({
        data: [
            { society_id: society.id, name: 'Grand Clubhouse & Lounge', type: 'Clubhouse', rules: 'Max 30 guests. No outside catering without approval.', slot_duration: 120 },
            { society_id: society.id, name: 'Olympic Swimming Pool', type: 'Pool', rules: 'Swim cap mandatory. Children must be supervised.', slot_duration: 60 },
            { society_id: society.id, name: 'Synthetic Tennis Court', type: 'Tennis', rules: 'Non-marking shoes required.', slot_duration: 60 },
        ],
    });
    console.log('✅ Created demo Facilities');
    console.log('\n🎉 Seeding completed successfully!');
    console.log('---------------------------------------------------------');
    console.log('🔑 Demo Login Credentials (All passwords: password123):');
    console.log('   Admin:    admin@smartcommunityservices.com');
    console.log('   Guard 1:  guard1@smartcommunityservices.com');
    console.log('   Guard 2:  guard2@smartcommunityservices.com');
    console.log('   Resident: resident1@smartcommunityservices.com (Priya Nair - A-101)');
    console.log('   Resident: resident2@smartcommunityservices.com (Siddharth Rao - A-102)');
    console.log('---------------------------------------------------------');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
