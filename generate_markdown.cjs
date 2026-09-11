const fs = require('fs');
const path = require('path');

const mdContent = `# 🏢 SMART COMMUNITY SERVICES — PROJECT REPORT

---

## 📄 SECTION 1: SYNOPSIS

### Title: Smart Community Services

#### Aim:
The aim of this project is to deliver a transparent, unified multi-society digital ecosystem for gated community residents, security guards, domestic staff, and administrators to streamline property operations, multi-estate management, visitor security, helper ratings and attendance, maintenance billing, helpdesk ticketing, and real-time emergency safety on a single platform.

#### Description:
- **Project Overview:** Multi-service enterprise platform combining multi-society gated community infrastructure management with integrated resident lifecycle services (pre-approved gate passes, parcel OTP verification, staff attendance tracking & star ratings, maintenance ERP billing, helpdesk ticketing, community noticeboards, full administrative CRUD control, and real-time SOS safety radar) tailored for modern gated communities.
- **Core Portals:**
  - **Resident Portal:** Pre-approved visitor gate pass generation, parcel arrival OTP viewing, domestic staff directory with 1-to-5 star rating & review submission, maintenance bill payment, helpdesk ticketing with attachment uploads, and community broadcasts.
  - **Admin Command Centre:** Multi-society hierarchy management (societies, blocks, flats, residents, security guards, domestic staff), full-CRUD edit and delete controls across all registries, automated maintenance invoice generation, ticket SLA tracking, and audit logging.
  - **Security Guard Console:** Society-scoped gate pass passcode/QR verification, parcel inward & OTP collection, daily helper attendance punching, and live SOS emergency radar with high-decibel audio/visual alerts.

#### Core Modules:
1. ➢ **User Authentication & Profile Module:** Handles secure multi-role signup, login, JWT session management, and role-based access control (RBAC) for Admins, Residents, and Security Guards.
2. ➢ **Society Infrastructure & Multi-Estate Management Module:** Supports multiple residential societies (\`Prestige Tranquility\`, \`Lake View\`, \`Lake View Apartments\`), providing society-level isolation, block/tower definitions, and flat registry management.
3. ➢ **Visitor Security & Gate Pass Module:** Enables residents to create pre-approved visitor gate passes with 6-digit PIN codes / QR passes, allowing security guards to verify credentials at the gate and log real-time entry/exit timestamps.
4. ➢ **Parcel & Delivery Management Module:** Allows gate guards to log incoming resident packages, automatically generating 4-digit collection OTPs and firing real-time WebSockets notifications to target flat residents.
5. ➢ **Domestic Staff Directory & Ratings Module:** Maintains a multi-category directory of daily helpers (maids, cooks, drivers, plumbers, electricians), enabling guard attendance punching, flat assignment relations, and resident 1-to-5 star review submissions.
6. ➢ **Admin Full-CRUD Master Management Module:** Grants administrators full creation, edit (update), and deletion capabilities across all 6 core registries (Society Master Registry, Blocks Management, Flats Registry, Residents Directory, Security Guards Directory, Domestic Staff Directory).
7. ➢ **ERP Billing & Maintenance Ledger Module:** Automates monthly society maintenance invoice generation based on flat square footage or fixed rates, tracks charge breakdowns (sinking fund, water, parking), supports online payments, and maintains immutable flat ledgers.
8. ➢ **Helpdesk Ticketing & SLA Module:** Enables residents to raise maintenance tickets (plumbing, electrical, security) with photos, track status changes (Open, In Progress, Resolved), and assign tickets to society administrators or staff.
9. ➢ **Community Noticeboard & Real-Time SOS Radar Module:** Facilitates community broadcasts, amenity slot bookings (clubhouse, pool, tennis court), and features a zero-latency Socket.io emergency SOS radar alerting security guards instantly during medical or fire emergencies.

---

## 📖 SECTION 2: INTRODUCTION

### Introduction
The modern urban gated community landscape remains heavily fragmented, forcing residents, society management committees, and security guards to rely on disconnected tools for visitor security, helper attendance, maintenance billing, and emergency responses. This platform addresses these inefficiencies by unifying the entire multi-society lifecycle into a single digital solution. Built on a modern decoupled architecture, the backend utilizes Node.js and Express.js with TypeScript to execute robust business logic, Prisma ORM for type-safe SQLite database operations, and Socket.io for bi-directional, real-time emergency events. The frontend leverages React 18 with Vite and Tailwind CSS to deliver an ultra-responsive, accessible user interface across desktop and mobile devices.

### System Overview

#### User-Side Activity (Resident Portal)
- **Visitor Pass & Delivery Control:** Generate pre-approved 6-digit visitor passes for guests and view parcel arrival OTPs in real-time.
- **Domestic Staff & Star Ratings:** Browse society daily helpers (maids, cooks, drivers, plumbers), check 1-5 star ratings, submit reviews, and receive gate entry notifications.
- **Maintenance & Billing:** View monthly society maintenance invoices, inspect itemized charge breakdowns, and pay bills securely online.
- **Helpdesk & Ticketing:** Submit priority tickets with photo attachments and receive live resolution updates from society managers.

#### Admin-Side Activity (Command Centre)
- **Infrastructure & Full-CRUD Management:** Add, edit, and delete records across Society Master Registry, Blocks Management, Flats Registry, Residents Directory, Security Guards Directory, and Domestic Staff Directory.
- **Multi-Society Scoping:** Filter and allocate resources across multiple residential estates (\`Prestige Tranquility\`, \`Lake View\`, \`Lake View Apartments\`).
- **ERP Billing Operations:** Batch-generate monthly maintenance invoices, log manual payment updates, and review financial ledgers.
- **Helpdesk & SLA Operations:** Monitor open resident tickets, assign technicians, and track SLA resolution metrics.
- **Community Notices:** Publish society broadcasts, emergency alerts, and amenity facility guidelines.

#### Guard-Side Activity (Security Console)
- **Gate Verification:** Verify 6-digit passcodes for pre-approved visitors and log vehicle numbers at gate checkpoints.
- **Parcel Inward Logging:** Log incoming courier packages and generate secure 4-digit collection OTPs.
- **Helper Attendance Punching:** Punch check-in and check-out times for domestic maids, drivers, and maintenance staff.
- **Live SOS Radar:** Monitor high-priority emergency alerts triggered by residents with instant audio-visual alarms.

### Purpose
The core purpose of this platform is to eliminate operational friction and safety vulnerabilities in gated residential communities by consolidating visitor entry, staff management, financial accounting, maintenance servicing, full administrative control, and emergency dispatching into a unified digital workspace. By bridging residents directly with gate guards and administrative management across multiple societies, the system eliminates paper registers, prevents unauthorized entry, speeds up maintenance resolution, and guarantees instant emergency assistance.

---

## 🎯 SECTION 3: OBJECTIVES

### Main Objective
The main objective of this project is to build an integrated, full-stack enterprise platform that unifies gated society administration with comprehensive resident security and living solutions. It seeks to replace manual gate logs, paper billing, and delayed complaint handling with a single digital ecosystem featuring multi-society isolation, transparent financial accounting, verified visitor authentication, domestic staff rating engines, complete administrative CRUD management, and zero-latency emergency SOS signaling.

### Specific Objectives:
- **Multi-Society Infrastructure Objective:** Provide unified multi-estate support allowing admins to manage distinct residential societies (\`Prestige Tranquility\`, \`Lake View\`, \`Lake View Apartments\`), each with independent blocks, flats, guards, and domestic staff.
- **Full Administrative CRUD Objective:** Empower society administrators with complete creation, editing, updating, and deletion controls across all 6 primary management registries.
- **Domestic Staff Directory & Ratings Objective:** Build a trusted domestic staff roster enabling residents to rate helpers from 1 to 5 stars, write feedback reviews, view assigned flats, and receive instant gate entry alerts when staff punch in.
- **Gate & Visitor Security Objective:** Eliminate perimeter vulnerabilities by replacing physical logbooks with a digital pass verification system. Residents generate 6-digit passcodes or QR passes, while security guards verify credentials on the Guard Console and log entry/exit timestamps.
- **Financial ERP & Invoicing Objective:** Establish an automated billing engine that batch-generates itemized monthly invoices (maintenance fees, sinking fund, water charges), tracks payment statuses (Pending, Paid, Overdue), and maintains immutable financial ledgers.
- **Helpdesk & Maintenance Objective:** Deliver a structured issue resolution pipeline for resident tickets (plumbing, electrical, security), tracking states (Open, In Progress, Resolved) and enforcing SLAs.
- **Real-Time Safety & SOS Radar Objective:** Prioritize life safety via a zero-latency WebSockets radar broadcasting resident emergency triggers instantly to guard consoles with visual animations and high-decibel audio alarms.

---

## ⚙️ SECTION 4: SOFTWARE AND HARDWARE REQUIREMENTS

### 1. Hardware Requirements

| Hardware Component | Minimum System Specification |
| :--- | :--- |
| **Processor** | AMD Ryzen 5 5625U / Intel Core i5 (2.3 GHz or higher) |
| **Operating System** | Windows 11 Pro / Linux Ubuntu 22.04 LTS / macOS |
| **Hard Disk** | 512 GB NVMe SSD |
| **Monitor** | 15'' Full HD LED Display (1920 x 1080 resolution) |
| **Input Devices** | Standard Keyboard, Optical Mouse / Touchscreen |
| **RAM** | 16 GB DDR4 / DDR5 |

### 2. Software Requirements

| Software Tool | Selected Technology Stack |
| :--- | :--- |
| **Operating System** | Windows 11 / Linux Ubuntu 22.04 LTS |
| **Programming Language** | TypeScript (v5.0+), JavaScript (ES6+ Node.js v20+) |
| **Web Framework** | Express.js (Server Engine), React 18 with Vite (Frontend) |
| **Database & ORM** | SQLite (\`dev.db\`), Prisma ORM (v5.0+) |
| **Development IDE** | Visual Studio Code (VS Code v1.85+) |
| **Documentation & Reports** | Microsoft Word, HTML5 / CSS3 Print Engine, Markdown |

---

## 💻 SECTION 5: FRONT END AND BACK END

### Frontend Architecture
- **React 18 & TypeScript:** Built as a single-page application (SPA) with React Router DOM v6, ensuring fast navigation between Admin, Resident, and Guard portals.
- **Tailwind CSS Design System:** Custom color tokens, glassmorphism overlays, neon status indicators, and responsive grid layouts.
- **Client State & Socket Integration:** Managed via React Context API (\`AuthContext\` and \`SocketContext\`), holding real-time WebSocket connections for live notifications.

### Backend Architecture
- **Node.js & Express.js:** Event-driven, non-blocking asynchronous server executing RESTful API endpoints.
- **Security & Authentication:** Password encryption using \`bcrypt\`, API authentication via signed JSON Web Tokens (JWT).
- **Socket.io WebSocket Gateway:** Room-based real-time event broadcasting (\`room:guards\`, \`flat:id\`).

### Database & ORM
- **SQLite (\`dev.db\`):** Serverless, zero-configuration relational database with full ACID compliance.
- **Prisma ORM:** Declarative schema definition, automated migrations, type-safe query generation, and relational foreign-key management.

---

## 📐 SECTION 6: SYSTEM DESIGN

### ER Diagram
![ER Diagram](er_diagram.png)

### ER Diagram Concepts & Relationship Types
1. **One-to-One (1:1):** Each flat has one assigned owner user account.
2. **One-to-Many (1:N):** One society contains multiple blocks; one block contains multiple flats.
3. **Many-to-One (N:1):** Multiple visitor passes belong to one resident creator; multiple residents belong to one society.
4. **Many-to-Many (M:N):** Domestic staff assigned to multiple flats via \`StaffAssignment\`.
5. **Staff Reviews (1:N):** Residents submit multiple 1-to-5 star \`StaffReview\` records per staff member.

### Data Flow Diagram (DFD) Structure
- **Level 0 Context DFD:** Illustrates high-level system boundaries connecting Residents, Security Guards, and Admins to System Core, Visitor Engine, Socket Radar, Staff Ratings Engine, and ERP Engine.
- **Level 1 Process DFD:** Details 1.0 Auth Process, 2.0 Multi-Society Infrastructure Process, 3.0 Visitor Security Process, 4.0 Staff Attendance & Ratings Process, 5.0 ERP Billing Process, and 6.0 Helpdesk Process.

---

## 🛠️ SECTION 7: IMPLEMENTATION

### Tools & Technologies
- **VS Code:** Primary code editor with TypeScript compiler integration.
- **Monorepo Architecture:** Monorepo managing Node.js backend (\`/server\`) and React Vite frontend (\`/client\`).
- **Master Seed System:** Automated Prisma database seeder (\`prisma/seed.ts\`) initializing multi-society data (48 flats, 15 security guards, 15 domestic staff members, reviews, and resident accounts).

---

## 💻 SECTION 8: CODES AND SCREENSHOTS (CODING)

### 1. Database Schema (\`schema.prisma\`)
\`\`\`prisma
// Smart Community Services Complete Prisma Schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String    @unique
  password_hash String
  role          String    @default("RESIDENT") // RESIDENT, GUARD, ADMIN
  flat_id       String?
  society_id    String?
  created_at    DateTime  @default(now())

  flat          Flat?     @relation("FlatResidents", fields: [flat_id], references: [id])
  society       Society?  @relation(fields: [society_id], references: [id])
  created_passes VisitorPass[] @relation("PassCreator")
  gate_logs      GateLog[]     @relation("GuardLogs")
}

model Staff {
  id            String    @id @default(uuid())
  name          String
  phone         String    @unique
  category      String    // Maid, Driver, Cook, Plumber, Electrician
  avg_rating    Float     @default(5.0)
  created_at    DateTime  @default(now())

  assignments   StaffAssignment[]
  attendance    StaffAttendance[]
  reviews       StaffReview[]
}
\`\`\`

### 2. Server Entry & Sockets (\`server/src/index.ts\`)
\`\`\`typescript
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes.js';
import foundationRoutes from './modules/foundation/foundation.routes.js';
import staffRoutes from './modules/staff/staff.routes.js';
import { initSockets } from './sockets/index.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foundation', foundationRoutes);
app.use('/api/staff', staffRoutes);

initSockets(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`

---

## 🖼️ SECTION 9: SCREENSHOTS & UI REPRESENTATIONS

### Mockup Screens:
1. **User Login Page:** Dual dark/light login screen supporting resident, guard, and admin credentials across societies.
2. **Admin Command Centre:** High-level dashboard displaying society selector, resident counts, guard rosters, and active passes.
3. **Admin Full-CRUD Registries:** Modal dialogs supporting creation, editing, and deletion of Societies, Blocks, Flats, Residents, Security Guards, and Domestic Staff.
4. **Domestic Staff Directory & Ratings:** Multi-category roster (Maids, Drivers, Cooks, Plumbers, Electricians) with 1-to-5 star ratings, review submission modal, and flat assignments.
5. **Resident Visitor Pass Generator:** Pre-approved pass form generating 6-digit PIN codes (e.g. \`849 201\`).
6. **Guard Gate Verification Console:** PIN entry screen validating visitor credentials and recording gate logs.
7. **Real-Time SOS Radar:** Red flashing emergency radar displaying resident medical/fire triggers with instant audio alerts.
8. **Maintenance ERP Invoice:** Itemized monthly maintenance bill detailing base fees, sinking fund, water, and total charges.

---

## 📝 SECTION 10: CONCLUSION

The Smart Community Services platform establishes an end-to-end web architecture connecting gated society administration with resident lifestyle and security solutions, creating a unified digital ecosystem tailored to modern urban communities. By seamlessly bridging multi-estate management, gate checkpoints, domestic staff ratings and attendance, full administrative CRUD control, financial billing, maintenance handling, and real-time emergency dispatches, the platform redefines how residents and management committees interact.

---

## 🚀 SECTION 11: FUTURE SCOPE

- **AI-Powered Facial Recognition at Gates:** Computer vision entry verification for residents and registered helpers.
- **Automatic License Plate Recognition (ALPR):** Automated boom barrier control via OCR cameras.
- **Smart IoT Lock Integration:** Digital lock unlocking for pre-approved visitor time slots.
- **EV Charging Station Billing:** Automated EV charging telemetry integrated into monthly maintenance invoices.
- **Localized Community Marketplace:** Resident buy-and-sell portal and skill sharing.
- **Blockchain Financial Audit Trail:** Immutable financial ledgers for society maintenance allocations.

---

## 📚 SECTION 12: BIBLIOGRAPHY

1. **Ian Sommerville** – *Software Engineering (10th Edition)*, Pearson Education, 2016.
2. **Roger S. Pressman & Bruce R. Maxim** – *Software Engineering: A Practitioner's Approach (8th Edition)*, McGraw-Hill, 2015.
3. **Ramez Elmasri & Shamkant B. Navathe** – *Fundamentals of Database Systems (7th Edition)*, Pearson, 2016.
4. React Docs: [https://react.dev](https://react.dev)
5. Node.js & Express Guide: [https://expressjs.com](https://expressjs.com)
6. Prisma ORM Documentation: [https://www.prisma.io/docs](https://www.prisma.io/docs)
7. Socket.io Gateway Docs: [https://socket.io/docs/v4/](https://socket.io/docs/v4/)
8. Tailwind CSS: [https://tailwindcss.com](https://tailwindcss.com)
`;

const projectRoot = 'c:\\Users\\Admin\\Desktop\\smart-community-services-main';
fs.writeFileSync(path.join(projectRoot, 'PROJECT_REPORT.md'), mdContent, 'utf8');
console.log("Successfully generated PROJECT_REPORT.md");
