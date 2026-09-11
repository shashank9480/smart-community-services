const fs = require('fs');
const path = require('path');

const mdContent = `# 🏢 SMART COMMUNITY SERVICES — PROJECT REPORT

---

## 📄 SECTION 1: SYNOPSIS

### Title: Smart Community Services

#### Aim:
The aim of this project is to deliver a transparent, unified digital ecosystem for gated society residents, security guards, domestic staff, and administrators to streamline property operations, visitor security, staff attendance, maintenance billing, helpdesk ticketing, and real-time emergency safety on a single platform.

#### Description:
- **Project Overview:** Multi-service enterprise platform combining gated society infrastructure management with integrated resident lifecycle services (pre-approved gate passes, parcel OTP verification, staff attendance tracking, maintenance ERP billing, helpdesk ticketing, community noticeboards, and real-time SOS safety radar) tailored for modern gated communities.
- **Core Portals:**
  - **Resident Portal:** Pre-approved visitor gate pass generation, domestic staff directory & entry pings, maintenance bill payment, helpdesk ticketing with attachment uploads, and community broadcasts.
  - **Admin Command Centre:** Full society hierarchy management (blocks, flats, residents), guard allocations, staff directory management, automated maintenance invoice generation, ticket SLA tracking, and audit logging.
  - **Security Guard Console:** Gate pass passcode/QR verification, parcel inward & OTP collection, daily helper attendance punching, and live SOS emergency radar with audio/visual alerts.

#### Core Modules:
1. ➢ **User Authentication & Profile Module:** Handles secure multi-role signup, login, JWT session management, and role-based access control (RBAC) for Admins, Residents, and Security Guards.
2. ➢ **Visitor Security & Gate Pass Module:** Enables residents to create pre-approved visitor gate passes with 6-digit PIN codes / QR passes, and allows security guards to verify passes at the entry gate, logging real-time gate entry and exit timestamps.
3. ➢ **Parcel & Delivery Management Module:** Allows gate guards to log incoming resident packages, automatically generating 4-digit collection OTPs and firing real-time socket notifications to residents.
4. ➢ **Domestic Staff & Attendance Module:** Maintains a society-wide directory of maids, drivers, cooks, and plumbers, enabling guard attendance punching, resident ratings, and instant entry alerts.
5. ➢ **ERP Billing & Maintenance Ledger Module:** Automates monthly society maintenance invoice generation, tracks breakdown costs (sinking fund, water, common area electricity), supports online payment integration, and maintains flat ledger entries.
6. ➢ **Helpdesk Ticketing & SLA Module:** Enables residents to raise maintenance tickets (plumbing, electrical, security) with photos, track status changes (Open, In Progress, Resolved), and assign tickets to society administrators or staff.
7. ➢ **Community Noticeboard & Real-Time SOS Radar Module:** Facilitates community broadcasts, amenity slot bookings (clubhouse, gym, tennis court), and features a zero-latency Socket.io emergency SOS radar that alerts security guards instantly during medical or fire emergencies.

---

## 📖 SECTION 2: INTRODUCTION

### Introduction
The modern urban gated community landscape remains heavily fragmented, forcing residents, society management committees, and security guards to rely on disconnected tools for visitor security, helper attendance, maintenance billing, and emergency responses. This platform addresses these inefficiencies by unifying the entire society lifecycle into a single digital solution. Built on a modern decoupled architecture, the backend utilizes Node.js and Express.js with TypeScript to execute robust business logic, Prisma ORM for type-safe SQLite database operations, and Socket.io for bi-directional, real-time emergency events. The frontend leverages React 18 with Vite and Tailwind CSS to deliver an ultra-responsive, accessible user interface across desktop and mobile devices.

### System Overview

#### User-Side Activity (Resident Portal)
- **Visitor Pass & Delivery Control:** Generate pre-approved 6-digit visitor passes for guests and view parcel arrival OTPs in real-time.
- **Domestic Helper Onboarding:** Browse society daily helpers (maids, cooks, drivers), check ratings, and receive gate entry notifications.
- **Maintenance & Billing:** View monthly society maintenance invoices, inspect itemized charge breakdowns, and pay bills securely online.
- **Helpdesk & Ticketing:** Submit priority tickets with photo attachments and receive live resolution updates from society managers.

#### Admin-Side Activity (Command Centre)
- **Infrastructure & Allocations:** Add and manage society blocks, flats, resident profiles, and security guard credentials.
- **ERP Billing Operations:** Batch-generate monthly maintenance invoices, log manual payment updates, and review financial ledgers.
- **Helpdesk Operations:** Monitor open resident tickets, assign technicians, and track SLA resolution metrics.
- **Community Notices:** Publish society broadcasts, emergency alerts, and amenity facility guidelines.

#### Guard-Side Activity (Security Console)
- **Gate Verification:** Verify 6-digit passcodes for pre-approved visitors and log vehicle numbers at gate checkpoints.
- **Parcel Inward Logging:** Log incoming courier packages and generate secure 4-digit collection OTPs.
- **Helper Attendance Punching:** Punch check-in and check-out times for domestic maids, drivers, and maintenance staff.
- **Live SOS Radar:** Monitor high-priority emergency alerts triggered by residents with instant audio-visual alarms.

### Purpose
The core purpose of this platform is to eliminate operational friction and safety vulnerabilities in gated residential communities by consolidating visitor entry, staff management, financial accounting, maintenance servicing, and emergency dispatching into a unified digital workspace. By bridging residents directly with gate guards and administrative management, the system eliminates paper registers, prevents unauthorized entry, speeds up maintenance resolution, and guarantees instant emergency assistance. Ultimately, the platform aims to elevate urban living standards through transparent automation and real-time connectivity.

---

## 🎯 SECTION 3: OBJECTIVES

### Main Objective
The main objective of this project is to build an integrated, full-stack enterprise platform that unifies gated society administration with comprehensive resident security and living solutions. It seeks to replace manual gate logs, paper billing, and delayed complaint handling with a single digital ecosystem featuring transparent financial accounting, verified visitor authentication, automated attendance tracking, and zero-latency emergency SOS signaling.

### Specific Objectives:
- **Gate & Visitor Security Objective:** Eliminate perimeter vulnerabilities across residential gated societies by replacing physical logbooks with a digital pass verification system. Residents generate 6-digit passcodes or QR passes prior to arrival, while security guards verify credentials on the Guard Console and log entry/exit timestamps.
- **Financial ERP & Invoicing Objective:** Establish an automated billing engine that batch-generates itemized monthly invoices (maintenance fees, sinking fund, water charges), tracks payment statuses (Pending, Paid, Overdue), and maintains immutable financial ledgers.
- **Helpdesk & Maintenance Objective:** Deliver a structured issue resolution pipeline for resident tickets (plumbing, electrical, security), tracking states (Open, In Progress, Resolved) and enforcing SLAs.
- **Real-Time Safety & SOS Radar Objective:** Prioritize life safety via a zero-latency WebSockets radar broadcasting resident emergency triggers instantly to guard consoles with visual animations and high-decibel audio alarms.
- **User Experience (UX) Objective:** Deliver an ultra-responsive dual-theme UI (Dark and Light modes) using Tailwind CSS and React 18, ensuring fast interactive performance without page reloads.

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
| **Documentation** | Microsoft Word, HTML5 / CSS3 Print Engine, Markdown |

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

### ER Diagram Concepts & Relationship Types
1. **One-to-One (1:1):** Each flat has one assigned owner user account.
2. **One-to-Many (1:N):** One society block contains multiple flats.
3. **Many-to-One (N:1):** Multiple visitor passes belong to one resident creator.
4. **Many-to-Many (M:N):** Domestic staff assigned to multiple flats via \`StaffAssignment\`.

### Data Flow Diagram (DFD) Structure
- **Level 0 Context DFD:** Illustrates high-level system boundaries connecting Residents, Security Guards, and Admins to System Core, Visitor Engine, Socket Radar, and ERP Engine.
- **Level 1 Process DFD:** Details 1.0 Auth Process, 2.0 Visitor Security Process, 3.0 Parcel Logging Process, 4.0 ERP Billing Process, and 5.0 Helpdesk Process.

---

## 🛠️ SECTION 7: IMPLEMENTATION

### Tools & Technologies
- **VS Code:** Primary code editor with TypeScript compiler integration.
- **Monorepo Architecture:** Monorepo managing Node.js backend (\`/server\`) and React Vite frontend (\`/client\`).

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
\`\`\`

### 2. Server Entry & Sockets (\`server/src/index.ts\`)
\`\`\`typescript
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes.js';
import visitorRoutes from './modules/visitor/visitor.routes.js';
import { initSockets } from './sockets/index.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/visitor', visitorRoutes);

initSockets(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`

---

## 🖼️ SECTION 9: SCREENSHOTS & UI REPRESENTATIONS

### Mockup Screens:
1. **User Login Page:** Dual dark/light login screen supporting resident, guard, and admin credentials.
2. **Admin Command Centre:** High-level dashboard displaying resident count, active passes, staff attendance, and open tickets.
3. **Resident Visitor Pass Generator:** Pre-approved pass form generating 6-digit PIN codes (e.g. \`849 201\`).
4. **Guard Gate Verification Console:** PIN entry screen validating visitor credentials and recording gate logs.
5. **Real-Time SOS Radar:** Red flashing emergency radar displaying resident medical/fire triggers with instant audio alerts.
6. **Maintenance ERP Invoice:** Itemized monthly maintenance bill detailing base fees, sinking fund, water, and total charges.
7. **Helpdesk Resolution Queue:** SLA ticket tracking dashboard displaying ticket categories (Plumbing, Electrical) and status updates.

---

## 📝 SECTION 10: CONCLUSION

The Smart Community Services platform establishes an end-to-end web architecture connecting gated society administration with resident lifestyle and security solutions, creating a unified digital ecosystem tailored to modern urban communities. By seamlessly bridging the gap between gate checkpoints, domestic helper management, financial billing, maintenance handling, and real-time emergency dispatches, the platform redefines how residents and management committees interact.

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
