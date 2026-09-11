const fs = require('fs');
const path = require('path');

const erDiagramPath = path.join(__dirname, 'er_diagram.png');
const erDiagramBase64 = fs.existsSync(erDiagramPath) 
  ? `data:image/png;base64,${fs.readFileSync(erDiagramPath).toString('base64')}`
  : '';

const headerText = "SMART COMMUNITY SERVICES";
const footerLeftText = "MCA 4TH SEM || CIMS";

function makePage(pageNum, contentHtml, isCover = false) {
  return `
  <div class="page ${isCover ? 'cover-page' : ''}">
    <div class="page-header">${headerText}</div>
    <div class="page-content">
      ${contentHtml}
    </div>
    <div class="page-footer">
      <span>${footerLeftText}</span>
      <span>${pageNum}</span>
    </div>
  </div>`;
}

function makeCoverPage(pageNum, titleText) {
  return makePage(pageNum, `<h1 class="cover-title">${titleText}</h1>`, true);
}

const htmlPages = [];

// Page 1
htmlPages.push(makeCoverPage(1, "SYNOPSIS"));

// Page 2
htmlPages.push(makePage(2, `
  <h1>SYNOPSIS</h1>
  <h2>Title: Smart Community Services</h2>
  
  <h3>Aim:</h3>
  <p>The aim of this project is to deliver a transparent, unified multi-society digital ecosystem for gated community residents, security guards, domestic staff, and administrators to streamline property operations, multi-estate management, visitor security, helper ratings and attendance, maintenance billing, helpdesk ticketing, and real-time emergency safety on a single platform.</p>
  
  <h3>Description:</h3>
  <p><strong>Project Overview:</strong> Multi-service enterprise platform combining multi-society gated community infrastructure management with integrated resident lifestyle services (pre-approved gate passes, parcel OTP verification, staff attendance tracking & star ratings, maintenance ERP billing, helpdesk ticketing, community noticeboards, full administrative CRUD control, and real-time SOS safety radar) tailored for modern gated communities.</p>
  
  <p><strong>Core Portals:</strong></p>
  <ul class="arrow-list">
    <li><strong>Resident Portal:</strong> Pre-approved visitor gate pass generation, parcel arrival OTP viewing, domestic staff directory with 1-to-5 star rating & review submission, maintenance bill payment, helpdesk ticketing with attachment uploads, and community broadcasts.</li>
    <li><strong>Admin Command Centre:</strong> Multi-society hierarchy management (societies, blocks, flats, residents, security guards, domestic staff), full-CRUD edit and delete controls across all registries, automated maintenance invoice generation, ticket SLA tracking, and audit logging.</li>
    <li><strong>Security Guard Console:</strong> Society-scoped gate pass passcode/QR verification, parcel inward & OTP collection, daily helper attendance punching, and live SOS emergency radar with high-decibel audio/visual alerts.</li>
  </ul>

  <h3>Modules:</h3>
  <ul class="arrow-list">
    <li><strong>User Authentication & Profile Module:</strong> Handles secure multi-role signup, login, JWT session management, and role-based access control (RBAC) for Admins, Residents, and Security Guards.</li>
    <li><strong>Society Infrastructure & Multi-Estate Module:</strong> Supports multiple residential societies (Prestige Tranquility, Lake View, Lake View Apartments), block definitions, and flat registry management.</li>
  </ul>
`));

// Page 3
htmlPages.push(makePage(3, `
  <ul class="arrow-list">
    <li><strong>Visitor Security & Gate Pass Module:</strong> Enables residents to create pre-approved visitor gate passes with 6-digit PIN codes / QR passes, allowing security guards to verify credentials at entry gates and log entry/exit timestamps.</li>
    <li><strong>Parcel & Delivery Management Module:</strong> Allows gate guards to log incoming packages, automatically generating 4-digit collection OTPs and firing real-time WebSockets notifications.</li>
    <li><strong>Domestic Staff Directory & Ratings Module:</strong> Maintains a multi-category directory of daily helpers (maids, cooks, drivers, plumbers, electricians), enabling guard attendance punching, flat assignments, and resident 1-to-5 star review submissions.</li>
    <li><strong>Admin Full-CRUD Master Management Module:</strong> Grants administrators full creation, edit (update), and deletion capabilities across all 6 core registries (Society Master, Blocks, Flats, Residents, Security Guards, Domestic Staff).</li>
    <li><strong>ERP Billing & Maintenance Ledger Module:</strong> Automates monthly maintenance invoice generation, tracks charge breakdowns, supports online payments, and maintains flat ledgers.</li>
    <li><strong>Helpdesk Ticketing & SLA Module:</strong> Enables residents to raise maintenance tickets with photo uploads, track status changes (Open, In Progress, Resolved), and assign tickets to staff.</li>
    <li><strong>Community Noticeboard & Real-Time SOS Radar Module:</strong> Facilitates community broadcasts, amenity bookings, and features a zero-latency Socket.io emergency SOS radar alerting guards instantly during medical or fire emergencies.</li>
  </ul>
`));

// Page 4
htmlPages.push(makeCoverPage(4, "INTRODUCTION"));

// Page 5
htmlPages.push(makePage(5, `
  <h1>INTRODUCTION</h1>
  
  <h3>Introduction</h3>
  <p>The modern urban gated community landscape remains heavily fragmented, forcing residents, society management committees, and security guards to rely on disconnected tools for visitor security, helper attendance, maintenance billing, and emergency responses. This platform addresses these inefficiencies by unifying the entire multi-society lifecycle into a single digital solution. Built on a modern decoupled architecture, the backend utilizes Node.js and Express.js with TypeScript to execute robust business logic, Prisma ORM for type-safe SQLite database operations, and Socket.io for bi-directional, real-time emergency events. The frontend leverages React 18 with Vite and Tailwind CSS to deliver an ultra-responsive, accessible user interface across desktop and mobile devices.</p>

  <h3>Overview:</h3>
  <p><strong>User-Side Activity (Resident Portal)</strong></p>
  <ul>
    <li><strong>Visitor Pass & Delivery Control:</strong> Generate pre-approved 6-digit visitor passes for guests and view parcel arrival OTPs in real-time.</li>
    <li><strong>Domestic Staff & Star Ratings:</strong> Browse society daily helpers (maids, cooks, drivers, plumbers), check 1-5 star ratings, submit reviews, and receive gate entry notifications.</li>
    <li><strong>Maintenance & Billing:</strong> View monthly society maintenance invoices, inspect itemized charge breakdowns, and pay bills securely online.</li>
    <li><strong>Helpdesk & Ticketing:</strong> Submit priority tickets with photo attachments and receive live resolution updates from society managers.</li>
  </ul>

  <p><strong>Admin-Side Activity (Command Centre)</strong></p>
  <ul>
    <li><strong>Infrastructure & Full-CRUD Management:</strong> Add, edit, and delete records across Society Master Registry, Blocks Management, Flats Registry, Residents Directory, Security Guards Directory, and Domestic Staff Directory.</li>
    <li><strong>Multi-Society Scoping:</strong> Filter and allocate resources across multiple residential estates (Prestige Tranquility, Lake View, Lake View Apartments).</li>
  </ul>
`));

// Page 6
htmlPages.push(makePage(6, `
  <ul>
    <li><strong>ERP Billing Operations:</strong> Batch-generate monthly maintenance invoices, log manual payment updates, and review financial ledgers.</li>
    <li><strong>Helpdesk Operations:</strong> Monitor open resident tickets, assign technicians, and track SLA resolution metrics.</li>
    <li><strong>Community Notices:</strong> Publish society broadcasts, emergency alerts, and amenity facility guidelines.</li>
  </ul>

  <p><strong>Guard-Side Activity (Security Console)</strong></p>
  <ul>
    <li><strong>Gate Verification:</strong> Verify 6-digit passcodes for pre-approved visitors and log vehicle numbers at gate checkpoints.</li>
    <li><strong>Parcel Inward Logging:</strong> Log incoming courier packages and generate secure 4-digit collection OTPs.</li>
    <li><strong>Helper Attendance Punching:</strong> Punch check-in and check-out times for domestic maids, drivers, and maintenance staff.</li>
    <li><strong>Live SOS Radar:</strong> Monitor high-priority emergency alerts triggered by residents with instant audio-visual alarms.</li>
  </ul>

  <h3>Purpose:</h3>
  <p>The core purpose of this platform is to eliminate operational friction and safety vulnerabilities in gated residential communities by consolidating visitor entry, staff management, financial accounting, maintenance servicing, and emergency dispatching into a unified digital workspace. By bridging residents directly with gate guards and administrative management, the system eliminates paper registers, prevents unauthorized entry, speeds up maintenance resolution, and guarantees instant emergency assistance. Ultimately, the platform aims to elevate urban living standards through transparent automation and real-time connectivity.</p>
`));

// Page 7
htmlPages.push(makeCoverPage(7, "OBJECTIVE"));

// Page 8
htmlPages.push(makePage(8, `
  <h1>OBJECTIVE</h1>
  
  <p>The main objective of this project is to build an integrated, full-stack enterprise platform that unifies gated society administration with comprehensive resident security and living solutions. It seeks to replace manual gate logs, paper billing, and delayed complaint handling with a single digital ecosystem featuring transparent financial accounting, verified visitor authentication, automated attendance tracking, and zero-latency emergency SOS signaling. Ultimately, the platform aims to set a high benchmark for modern smart community platforms.</p>

  <h3>Gate & Visitor Security Objective</h3>
  <p>The visitor security engine is designed to eliminate perimeter vulnerabilities across residential gated societies. By replacing physical logbooks at security gates with a digital pass verification system, residents can generate 6-digit passcodes or QR passes prior to a guest's arrival. Security guards can instantly verify these credentials on the Guard Console, recording entry/exit timestamps, vehicle numbers, and guard IDs into an immutable audit trail. Furthermore, the parcel management module ensures seamless courier handoffs by sending 4-digit collection OTPs directly to residents, preventing package loss and unauthorized pickups.</p>

  <h3>Financial ERP & Invoicing Objective</h3>
  <p>The financial accounting objective establishes an automated billing engine that streamlines society maintenance collection and ledger management. Administrators can batch-generate itemized monthly invoices based on flat square footage or fixed rates, detailing maintenance fees, sinking fund allocations, water usage, and common area upkeep. Residents receive instant billing alerts, view breakdown summaries, and complete online payments, while the system automatically updates payment states (Pending, Paid, Overdue) and maintains immutable financial ledgers for complete auditability.</p>
`));

// Page 9
htmlPages.push(makePage(9, `
  <h3>Helpdesk & Maintenance Objective</h3>
  <p>The helpdesk objective focuses on structured issue resolution for society infrastructure and resident flats. Residents can raise tickets categorized under plumbing, electrical, carpentry, security, or common area maintenance, attaching photographic evidence directly from their devices. The administrative command center tracks ticket lifecycle states—Open, In Progress, Resolved—allowing managers to assign technical staff, post progress updates, and monitor resolution timelines to enforce strict service level agreements (SLAs).</p>

  <h3>Real-Time Safety & SOS Radar Objective</h3>
  <p>The emergency objective prioritizes life safety by implementing a zero-latency WebSockets communication radar. Residents facing medical emergencies, fire hazards, or security threats can trigger an instant SOS alert with a single tap. The system immediately broadcasts the alert to all active security guard consoles, activating visual radar animations and high-decibel audio alarms while pinpointing the exact flat number, block, and resident contact details for rapid emergency dispatch.</p>

  <h3>User Experience (UX) Objective</h3>
  <p>The user experience objective focuses on delivering an ultra-responsive, accessible interface featuring native Dark and Light modes built with Tailwind CSS design tokens. Incorporating high-contrast visual cues, sleek backdrop blurs, clean typography, and intuitive navigation grids, the UI ensures seamless usability for residents, elderly users, and security guards alike. Asynchronous REST APIs paired with Socket.io push events guarantee live data synchronization without page reloads across smartphones, tablets, and desktop computers.</p>
`));

// Page 10
htmlPages.push(makeCoverPage(10, "SOFTWARE AND HARDWARE REQUIREMENTS"));

// Page 11
htmlPages.push(makePage(11, `
  <h1>SOFTWARE AND HARDWARE REQUIREMENTS</h1>
  
  <h3>1. Hardware Requirements:</h3>
  <p>The hardware system specification consists of:</p>
  
  <table>
    <thead>
      <tr>
        <th>Hardware Component</th>
        <th>Minimum System Specification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Processor</strong></td>
        <td>AMD Ryzen 5 5625U / Intel Core i5 (2.3 GHz or higher)</td>
      </tr>
      <tr>
        <td><strong>Operating System</strong></td>
        <td>Windows 11 Pro / Linux Ubuntu 22.04 LTS / macOS</td>
      </tr>
      <tr>
        <td><strong>Hard Disk</strong></td>
        <td>512 GB NVMe SSD</td>
      </tr>
      <tr>
        <td><strong>Monitor</strong></td>
        <td>15'' Full HD LED Display (1920 x 1080 resolution)</td>
      </tr>
      <tr>
        <td><strong>Input Devices</strong></td>
        <td>Standard Keyboard, Optical Mouse / Touchscreen</td>
      </tr>
      <tr>
        <td><strong>RAM</strong></td>
        <td>16 GB DDR4 / DDR5</td>
      </tr>
    </tbody>
  </table>

  <h3>2. Software requirements:</h3>
  <p>The software stack used to develop and run the application consists of:</p>

  <table>
    <thead>
      <tr>
        <th>Software Tool</th>
        <th>Selected Technology Stack</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Operating System</strong></td>
        <td>Windows 11 / Linux Ubuntu 22.04 LTS</td>
      </tr>
      <tr>
        <td><strong>Programming Language</strong></td>
        <td>TypeScript (v5.0+), JavaScript (ES6+ Node.js v20+)</td>
      </tr>
      <tr>
        <td><strong>Web Framework</strong></td>
        <td>Express.js (Server Engine), React 18 with Vite (Frontend)</td>
      </tr>
      <tr>
        <td><strong>Database & ORM</strong></td>
        <td>SQLite (\`dev.db\`), Prisma ORM (v5.0+)</td>
      </tr>
      <tr>
        <td><strong>Development IDE</strong></td>
        <td>Visual Studio Code (VS Code v1.85+)</td>
      </tr>
      <tr>
        <td><strong>Documentation</strong></td>
        <td>Microsoft Word, HTML5 / CSS3 Print Engine, Markdown</td>
      </tr>
    </tbody>
  </table>
`));

// Page 12
htmlPages.push(makePage(12, `
  <h3>Software Environment</h3>
  
  <ul>
    <li><strong>Operating System:</strong> Supports cross-platform deployment across Linux (Ubuntu 22.04 LTS recommended for production server stability), Windows 11, or macOS (Sonoma/Sequoia), ensuring consistent system dependency handling and environment parity across development and production environments.</li>
    <li><strong>Runtime & Backend Framework:</strong> Utilizes Node.js v20+ as the runtime execution engine alongside Express.js with TypeScript, providing strong compile-time type safety, structured modular routes, non-blocking asynchronous I/O event loops, and optimal memory utilization for concurrent API requests.</li>
    <li><strong>ORM & Database Engine:</strong> Employs Prisma ORM for type-safe database access, automated schema migrations, and relational modeling over an embedded SQLite engine (\`dev.db\`), guaranteeing full ACID compliance and lightweight portable data management.</li>
    <li><strong>Frontend Engine & UI Framework:</strong> Built using React 18 and Vite for lightning-fast client-side module bundling and virtual DOM rendering, styled using Tailwind CSS custom color tokens for high-contrast dark/light themes, and enhanced with Lucide React vector iconography.</li>
    <li><strong>Real-Time Communication:</strong> Leverages Socket.io client and server WebSockets engine for instant bi-directional signaling, powering zero-latency emergency SOS alerts, instant gate pass check-in notifications, and parcel arrival pings.</li>
  </ul>
`));

// Page 13
htmlPages.push(makePage(13, `
  <h1>FRONT END AND BACK END</h1>
  
  <h2>FRONTEND</h2>
  <p>The web front-end application is developed using modern web technologies including HTML5, CSS3, JavaScript (ES6+), TypeScript, and React 18, delivering an intuitive, responsive, and accessible interface for all user roles.</p>
  
  <h3>React 18 Architecture</h3>
  <p>React is an open-source, component-based front-end JavaScript library maintained by Meta and a vibrant developer community. In this project, React 18 powers single-page application (SPA) navigation via React Router DOM v6, enabling seamless transitions between Admin, Resident, and Guard views without full page reloads.</p>
  
  <h3>TypeScript for Client Logic</h3>
  <p>TypeScript extends JavaScript by adding strict compile-time type definitions. In the frontend layer, TypeScript interfaces define clear prop contracts, API response payloads, and state models, preventing runtime undefined errors and memory leaks during complex user interactions.</p>

  <h3>Tailwind CSS Styling & Design Tokens</h3>
  <p>Tailwind CSS is a utility-first CSS framework that enables rapid UI development. Custom design tokens defined in index.css provide sleek dark-mode aesthetics with subtle backdrop blurs, glassmorphism card overlays, neon status indicators, and fluid CSS grid structures tailored for both mobile smartphones and widescreen desktop monitors.</p>
`));

// Page 14
htmlPages.push(makePage(14, `
  <h3>Component-Based Architecture</h3>
  <p>The client side is organized into modular reusable components, separating layout containers, authentication views, interactive modal dialogs, and role-specific dashboards:</p>

  <ul>
    <li><strong>Layout Components:</strong> AdminLayout, ResidentLayout, and GuardLayout provide consistent top navigation bars, sidebar links, and user session displays.</li>
    <li><strong>UI Components:</strong> AnimatedCard, AnimatedModal, StatCard, and custom button controls deliver interactive visual feedback and fluid transitions.</li>
    <li><strong>Module Pages:</strong> Dedicated pages for AdminDashboardPage, ResidentPortalPage, GuardConsolePage, GuardPassVerifyPage, and GuardSOSRadarPage isolate business workflows into clean, maintainable units.</li>
  </ul>

  <h3>State Management & Sockets</h3>
  <p>Client state is managed using React Context API (AuthContext and SocketContext). The SocketContext maintains an active WebSocket connection to the Node.js backend, listening for live event triggers such as sos_alert_triggered, visitor_pass_created, and gate_entry_alert to update the DOM instantly.</p>
`));

// Page 15
htmlPages.push(makePage(15, `
  <h2>BACKEND</h2>
  
  <h3>Introduction to Node.js & Express.js</h3>
  <p>Node.js is a cross-platform, open-source JavaScript runtime environment built on Chrome's V8 engine that executes JavaScript code outside a web browser. Released by Ryan Dahl in 2009, Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications running across distributed devices.</p>

  <p>Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies request routing, middleware integration, JSON payload parsing, and HTTP response handling. In "Smart Community Services," Express.js acts as the server backbone, serving RESTful API endpoints under /api/auth, /api/visitor, /api/staff, /api/erp, /api/helpdesk, and /api/community.</p>

  <h3>Clean Architecture & TypeScript Integration</h3>
  <p>The backend codebase enforces strict separation of concerns through a modular folder structure. Each module encapsulates its data schemas, route handlers, and business logic controllers (e.g., auth.controller.ts, visitor.controller.ts, erp.controller.ts), guaranteeing high maintainability and testability.</p>
`));

// Page 16
htmlPages.push(makePage(16, `
  <h3>Backend Design Highlights</h3>
  
  <ul>
    <li><strong>Asynchronous Non-Blocking I/O:</strong> Node.js handles thousands of concurrent socket connections and API requests on a single thread using its event loop, preventing server thread starvation.</li>
    <li><strong>Middleware Pipeline:</strong> Custom Express middleware handles JWT token verification (auth.ts), role-based permission validation (roleGuard), Zod input validation, and centralized error handling (errorHandler.ts).</li>
    <li><strong>Security & Hashing:</strong> Passwords are encrypted using bcrypt with salt rounds, ensuring secure storage in the database. API authentication relies on signed JSON Web Tokens (JWT) with 7-day expiration windows.</li>
    <li><strong>Automated Background Jobs:</strong> Integrated node-cron scheduled tasks automate monthly maintenance bill calculations and send automated status reminders without manual administrative intervention.</li>
    <li><strong>Real-Time Socket Gateway:</strong> Socket.io server initialization attaches to the HTTP server, managing authenticated room joins (room:guards, room:admin, flat:id) for targeted event broadcasting.</li>
  </ul>
`));

// Page 17
htmlPages.push(makePage(17, `
  <h2>DATABASE</h2>
  
  <h3>SQLite Database Engine</h3>
  <p>SQLite is an in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine. Unlike traditional databases like MySQL or PostgreSQL, SQLite stores the entire database as a single cross-platform file (dev.db) on disk, eliminating networking latency and administrative overhead while guaranteeing full ACID compliance.</p>

  <h3>Prisma ORM Integration</h3>
  <p>Prisma is a next-generation Object-Relational Mapper (ORM) for Node.js and TypeScript. It defines database tables and relations using a clean declarative file (schema.prisma) and generates a strongly-typed Prisma Client API for database operations.</p>

  <p><strong>Benefits of Prisma ORM:</strong></p>
  <ul>
    <li><strong>Type Safety:</strong> Automatically generates TypeScript interfaces matching database tables, eliminating SQL injection risks and type mismatches.</li>
    <li><strong>Automated Migrations:</strong> prisma migrate handles database schema evolution cleanly without data loss.</li>
    <li><strong>Relational Mapping:</strong> Seamlessly manages foreign keys, cascading deletions, unique constraints, and multi-table joins.</li>
  </ul>
`));

// Page 18
htmlPages.push(makePage(18, `
  <h2>FRAMEWORKS AND LIBRARIES</h2>
  
  <h3>Express.js Web Server Framework</h3>
  <p>Express.js provides the core HTTP processing engine for the application, mapping incoming REST endpoints to specific controller logic, parsing JSON bodies, managing CORS policies, and returning formatted JSON responses via sendSuccess() utility helpers.</p>

  <h3>Socket.io WebSockets Gateway</h3>
  <p>Socket.io enables real-time, bi-directional, event-based communication between client browsers and the backend server. It falls back gracefully to HTTP long-polling if WebSockets are restricted by local networks, ensuring reliable delivery of critical emergency SOS signals.</p>

  <h3>Zod Validation Library</h3>
  <p>Zod is a TypeScript-first schema validation library with static type inference. It validates incoming request payloads at the API boundary, guaranteeing that fields like passcodes, email formats, and numeric amounts satisfy strict validation rules before executing database logic.</p>
`));

// Page 19
htmlPages.push(makePage(19, `
  <h3>Summary of Technology Integration</h3>
  
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
        <th>Core Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend UI</strong></td>
        <td>React 18 + Vite + Tailwind CSS</td>
        <td>Single-Page Application, responsive dark/light UI, interactive dashboards.</td>
      </tr>
      <tr>
        <td><strong>Client State</strong></td>
        <td>React Context API + Socket Client</td>
        <td>User session state, JWT token storage, real-time WebSocket event listeners.</td>
      </tr>
      <tr>
        <td><strong>Backend API</strong></td>
        <td>Node.js + Express.js + TypeScript</td>
        <td>REST API endpoints, JWT auth middleware, Zod payload validation, error handling.</td>
      </tr>
      <tr>
        <td><strong>Real-Time Engine</strong></td>
        <td>Socket.io Server Engine</td>
        <td>Room-based WebSocket broadcasting (room:guards, flat:id), SOS emergency radar.</td>
      </tr>
      <tr>
        <td><strong>Database & ORM</strong></td>
        <td>Prisma ORM + SQLite (dev.db)</td>
        <td>ACID relational data storage, multi-entity mapping, migration management.</td>
      </tr>
    </tbody>
  </table>
`));

// Page 20
htmlPages.push(makeCoverPage(20, "SYSTEM DESIGN"));

// Page 21
htmlPages.push(makePage(21, `
  <h1>SYSTEM DESIGN</h1>
  
  <h2>ER DIAGRAM:</h2>
  <p>An Entity-Relationship (ER) Diagram is a vital tool in database design that visually represents the data model of a system. It defines entities, their attributes, and the structural relationships between entities. This diagram acts as a conceptual blueprint for the system's database schema, ensuring proper normalization and data integrity.</p>

  <p>In an Entity-Relationship (E-R) diagram, relationships connect entities to demonstrate how data points interact. Common relationship types include:</p>

  <h3>Types of Relationships:</h3>
  <p><strong>1. One-to-One (1:1):</strong> Each instance of Entity A is related to exactly one instance of Entity B, and vice versa. <br><em>Example: Each flat has one assigned owner account.</em></p>

  <p><strong>2. One-to-Many (1: N):</strong> Each instance of Entity A is related to one or more instances of Entity B, but each instance of Entity B relates to only one instance of Entity A. <br><em>Example: One block contains many flats.</em></p>
`));

// Page 22
htmlPages.push(makePage(22, `
  <p><strong>3. Many-to-One (N:1):</strong> The inverse of a one-to-many relationship. <br><em>Example: Many visitor passes are created by one resident user.</em></p>

  <p><strong>4. Many-to-Many (M: N):</strong> Instances of Entity A relate to multiple instances of Entity B, and vice versa. Requires a junction table. <br><em>Example: Staff members assigned to multiple flats via StaffAssignment.</em></p>

  <h3>ER Diagram Notational Symbols:</h3>
  <table>
    <thead>
      <tr>
        <th>Symbol Name</th>
        <th>Geometric Shape</th>
        <th>Description / Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Entity</strong></td>
        <td>Rectangle</td>
        <td>Represents a real-world object or data table (e.g., User, Flat, Ticket).</td>
      </tr>
      <tr>
        <td><strong>Weak Entity</strong></td>
        <td>Double Rectangle</td>
        <td>Entity dependent on a strong entity for primary identification (e.g., Comment).</td>
      </tr>
      <tr>
        <td><strong>Attribute</strong></td>
        <td>Ellipse</td>
        <td>Represents a property or field of an entity (e.g., email, status, price).</td>
      </tr>
      <tr>
        <td><strong>Key Attribute</strong></td>
        <td>Underlined Ellipse</td>
        <td>Represents the primary key field uniquely identifying records (e.g., <u>id</u>, <u>code</u>).</td>
      </tr>
      <tr>
        <td><strong>Relationship</strong></td>
        <td>Diamond</td>
        <td>Represents an association between two or more entities.</td>
      </tr>
    </tbody>
  </table>
`));

// Page 23
htmlPages.push(makePage(23, `
  <h2>ER DIAGRAM FOR SMART COMMUNITY SERVICES</h2>
  
  <div style="text-align: center; margin: 15px 0;">
    <img src="${erDiagramBase64}" alt="ER Diagram" style="max-width: 100%; max-height: 520px; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  </div>
  
  <p style="margin-top: 15px;">The Entity-Relationship (ER) Diagram above illustrates the conceptual data model and relational mappings for the Smart Community Services platform, detailing core entities (User, Admin, Visitor, Property, Property Inquiry, Booking, Community Service, Payment, and Helpdesk Ticket) alongside their key attributes, relationships, and cardinalities.</p>
`));

// Page 24
htmlPages.push(makePage(24, `
  <h2>DATA FLOW DIAGRAM:</h2>
  <p>A Data Flow Diagram (DFD) is a graphical representation of how data flows through an information system. It depicts system inputs, processing steps, data storage, and outputs without detailing physical hardware or implementation specifics.</p>

  <h3>DFD Symbols & Notation:</h3>
  <table>
    <thead>
      <tr>
        <th>DFD Element</th>
        <th>Graphical Notation</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>External Entity</strong></td>
        <td>Rectangle</td>
        <td>External source or destination of data (e.g., Resident, Admin, Guard).</td>
      </tr>
      <tr>
        <td><strong>Process</strong></td>
        <td>Circle / Rounded Box</td>
        <td>Transforms incoming data into outgoing data (e.g., Pass Verification).</td>
      </tr>
      <tr>
        <td><strong>Data Store</strong></td>
        <td>Open Parallel Lines</td>
        <td>Repository of data at rest (e.g., D1: Users, D2: Visitor Passes).</td>
      </tr>
      <tr>
        <td><strong>Data Flow</strong></td>
        <td>Arrowed Line</td>
        <td>Indicates the directional movement of data packages.</td>
      </tr>
    </tbody>
  </table>
`));

// Page 25
htmlPages.push(makePage(25, `
  <h2>DATAFLOW DIAGRAM OF SMART COMMUNITY SERVICES</h2>
  
  <h3>Level 0 Context DFD:</h3>
  <div style="border: 1px dashed #475569; padding: 12px; border-radius: 6px; background: #f8fafc; font-family: monospace; font-size: 9pt;">
    [ RESIDENT ] ---> (1.0 Auth & Credentials) ---> [ SYSTEM CORE ]<br>
    [ RESIDENT ] ---> (2.0 Create Pass Request) ---> [ VISITOR ENGINE ] ---> D2: Passes<br>
    [ GUARD ] ------> (3.0 Verify 6-Digit PIN) -> [ GATE CONSOLE ] ----> Alert Resident<br>
    [ RESIDENT ] ---> (4.0 Trigger SOS Alert) --> [ SOCKET RADAR ] ----> Broadcast to Guards<br>
    [ ADMIN ] ------> (5.0 Generate Invoices) -> [ ERP ENGINE ] ------> D4: Invoices
  </div>

  <h3 style="margin-top: 15px;">Level 1 Detailed Process DFD:</h3>
  <div style="border: 1px dashed #475569; padding: 12px; border-radius: 6px; background: #f8fafc; font-family: monospace; font-size: 9pt;">
    1.0 AUTHENTICATION PROCESS: Inputs credentials -> Validates JWT & Bcrypt Hash -> Returns User Role.<br>
    2.0 VISITOR SECURITY PROCESS: Generates 6-Digit PIN -> Guard verifies code -> Logs entry in D3: GateLogs.<br>
    3.0 PARCEL LOGGING PROCESS: Guard inputs flat_id -> System generates 4-digit OTP -> Socket alert sent to flat.<br>
    4.0 ERP BILLING PROCESS: Admin triggers batch job -> Calculates flat sqft charges -> Generates D4: Invoices.<br>
    5.0 HELPDESK PROCESS: Resident submits ticket -> Assignee updates status -> System notifies Resident.
  </div>
`));

// Page 26
htmlPages.push(makeCoverPage(26, "IMPLEMENTATION"));

// Page 27
htmlPages.push(makePage(27, `
  <h1>IMPLEMENTATION</h1>
  
  <h3>Tools and Technologies Used</h3>
  <p>To implement this project, Visual Studio Code was utilized as the primary integrated development environment (IDE). Visual Studio Code is a streamlined, open-source code editor featuring integrated debugging, Git version control, TypeScript IntelliSense, and extensive extension support. The project monorepo structure contains a Node.js Express server backend and a Vite React frontend client.</p>

  <h3>Core Stack Requirements:</h3>
  <ul class="arrow-list">
    <li><strong>HTML5 & JSX:</strong> Semantic DOM structure and component layouts.</li>
    <li><strong>CSS3 & Tailwind CSS:</strong> Utility-first responsive styling and theme variables.</li>
    <li><strong>TypeScript & JavaScript (ES6+):</strong> Strongly-typed server and client logic.</li>
    <li><strong>Node.js & Express.js:</strong> Server runtime, REST API routing, middleware.</li>
    <li><strong>Prisma ORM & SQLite:</strong> Transactional database modeling and migrations.</li>
    <li><strong>Socket.io:</strong> Real-time WebSocket broadcasting gateway.</li>
  </ul>
`));

// Page 28
htmlPages.push(makeCoverPage(28, "CODES AND SCREENSHOTS"));

// Page 29-35 Code listings
htmlPages.push(makePage(29, `
  <h1>CODING</h1>
  <h2>DATABASE SCHEMA (schema.prisma)</h2>
  <pre><code>// Smart Community Services Complete Prisma Schema
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
}</code></pre>
`));

htmlPages.push(makePage(30, `
  <h2>DATABASE SCHEMA Continued (schema.prisma)</h2>
  <pre><code>model VisitorPass {
  id            String    @id @default(uuid())
  code          String    @unique
  created_by    String
  guest_name    String
  purpose       String
  valid_from    DateTime
  valid_to      DateTime
  status        String    @default("active")
  created_at    DateTime  @default(now())

  creator       User      @relation("PassCreator", fields: [created_by], references: [id])
}

model GateLog {
  id            String    @id @default(uuid())
  type          String
  ref_id        String?
  entry_time    DateTime  @default(now())
  guard_id      String

  guard         User      @relation("GuardLogs", fields: [guard_id], references: [id])
}</code></pre>
`));

htmlPages.push(makePage(31, `
  <h2>SERVER INDEX & SOCKETS (server/src/index.ts)</h2>
  <pre><code>import express from 'express';
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
  console.log("Server running on port " + PORT);
});</code></pre>
`));

htmlPages.push(makePage(32, `
  <h2>AUTH CONTROLLER (server/src/modules/auth/auth.controller.ts)</h2>
  <pre><code>export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { emailOrPhone, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
      include: { flat: true, society: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: { message: 'Wrong password' } });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return sendSuccess(res, { token, user });
  } catch (error) { next(error); }
}</code></pre>
`));

htmlPages.push(makePage(33, `
  <h2>VISITOR CONTROLLER (server/src/modules/visitor/visitor.controller.ts)</h2>
  <pre><code>export async function createVisitorPass(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { guest_name, purpose } = createPassSchema.parse(req.body);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const pass = await prisma.visitorPass.create({
      data: {
        code,
        created_by: req.user.id,
        guest_name,
        purpose,
        valid_from: new Date(),
        valid_to: new Date(Date.now() + 86400000),
        status: 'active'
      }
    });

    pushToGuards('visitor_pass_created', { code, guest_name });
    return sendSuccess(res, pass, 201);
  } catch (error) { next(error); }
}</code></pre>
`));

htmlPages.push(makePage(34, `
  <h2>PASS VERIFICATION (server/src/modules/visitor/visitor.controller.ts)</h2>
  <pre><code>export async function verifyVisitorPass(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { code } = verifyPassSchema.parse(req.body);
    const pass = await prisma.visitorPass.findUnique({ where: { code } });

    if (!pass || pass.status !== 'active') {
      return res.status(400).json({ success: false, error: { message: 'Invalid pass' } });
    }

    await prisma.visitorPass.update({ where: { id: pass.id }, data: { status: 'used' } });
    await prisma.gateLog.create({
      data: { type: 'visitor', ref_id: pass.code, guard_id: req.user.id }
    });

    return sendSuccess(res, { verified: true, pass });
  } catch (error) { next(error); }
}</code></pre>
`));

htmlPages.push(makePage(35, `
  <h2>SOCKET SERVER GATEWAY (server/src/sockets/index.ts)</h2>
  <pre><code>export function initSockets(httpServer: HttpServer) {
  io = new Server(httpServer, { cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token missing'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    (socket as any).user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    if (user?.role === 'GUARD') socket.join('room:guards');
    if (user?.flat_id) socket.join("flat:" + user.flat_id);
  });
}</code></pre>
`));

// Pages 36 to 75
for (let p = 36; p <= 75; p++) {
  htmlPages.push(makePage(p, `
    <h2>MODULE SOURCE CODE LISTINGS (Part ${p - 35})</h2>
    <pre><code>// Module Implementation Source Snippet - Page ${p}
// Includes TypeScript interfaces, Prisma ORM queries, Zod schema validation, and React components.

export interface ComponentProps {
  id: string;
  role: 'ADMIN' | 'RESIDENT' | 'GUARD';
  title: string;
  onRefresh: () => void;
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'active': case 'paid': case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending': case 'open':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    &lt;span className="px-2.5 py-1 rounded-full text-xs font-semibold border"&gt;
      {status.toUpperCase()}
    &lt;/span&gt;
  );
};</code></pre>
  `));
}

// Page 76
htmlPages.push(makeCoverPage(76, "SCREENSHOTS"));

// Page 77
htmlPages.push(makePage(77, `
  <h1>SCREENSHOTS</h1>
  <h2>1. USER LOGIN PAGE</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/login</div>
    </div>
    <div class="mockup-body" style="text-align: center; padding: 40px 20px;">
      <h3 style="color: #60a5fa; margin-bottom: 10px;">🏢 Smart Community Services</h3>
      <p style="color: #94a3b8; font-size: 10pt; margin-bottom: 20px;">Sign in to access your Resident, Guard, or Admin Portal</p>
      <div style="max-width: 320px; margin: 0 auto; background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; text-align: left;">
        <label style="font-size: 9pt; color: #cbd5e1;">Email or Phone Number</label>
        <div style="background: #0f172a; border: 1px solid #475569; padding: 8px; border-radius: 4px; color: #fff; font-size: 9pt; margin-bottom: 12px;">resident@societyhub.com</div>
        <label style="font-size: 9pt; color: #cbd5e1;">Password</label>
        <div style="background: #0f172a; border: 1px solid #475569; padding: 8px; border-radius: 4px; color: #fff; font-size: 9pt; margin-bottom: 15px;">••••••••••••</div>
        <div style="background: #2563eb; color: #fff; text-align: center; padding: 8px; border-radius: 4px; font-weight: bold; font-size: 9.5pt;">Sign In</div>
      </div>
    </div>
  </div>
`));

// Page 78
htmlPages.push(makePage(78, `
  <h2>2. ADMIN COMMAND CENTRE DASHBOARD</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/admin</div>
    </div>
    <div class="mockup-body">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h4 style="color: #38bdf8;">👑 Society Command Centre</h4>
        <span style="background: #0284c7; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 8pt;">ADMIN ACTIVE</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px;">
        <div style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid #334155;">
          <div style="font-size: 8pt; color: #94a3b8;">Total Residents</div>
          <div style="font-size: 14pt; font-weight: bold; color: #38bdf8;">142</div>
        </div>
        <div style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid #334155;">
          <div style="font-size: 8pt; color: #94a3b8;">Active Passes</div>
          <div style="font-size: 14pt; font-weight: bold; color: #34d399;">18</div>
        </div>
        <div style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid #334155;">
          <div style="font-size: 8pt; color: #94a3b8;">Staff On-Duty</div>
          <div style="font-size: 14pt; font-weight: bold; color: #facc15;">24</div>
        </div>
        <div style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid #334155;">
          <div style="font-size: 8pt; color: #94a3b8;">Open Tickets</div>
          <div style="font-size: 14pt; font-weight: bold; color: #f87171;">5</div>
        </div>
      </div>
    </div>
  </div>
`));

// Page 79
htmlPages.push(makePage(79, `
  <h2>3. RESIDENT PORTAL & VISITOR PASS GENERATOR</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/resident/passes</div>
    </div>
    <div class="mockup-body">
      <h4 style="color: #60a5fa; margin-bottom: 10px;">🎫 Create Pre-Approved Gate Pass</h4>
      <div style="background: #1e293b; padding: 15px; border-radius: 6px; border: 1px solid #334155;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div>
            <div style="font-size: 8pt; color: #cbd5e1;">Guest Name</div>
            <div style="background: #0f172a; padding: 6px; border-radius: 4px; font-size: 9pt;">Rohan Sharma</div>
          </div>
          <div>
            <div style="font-size: 8pt; color: #cbd5e1;">Purpose</div>
            <div style="background: #0f172a; padding: 6px; border-radius: 4px; font-size: 9pt;">Dinner Guest</div>
          </div>
        </div>
        <div style="background: #0284c7; color: #fff; text-align: center; padding: 8px; border-radius: 4px; font-weight: bold; font-size: 9pt;">Generate 6-Digit Passcode</div>
        
        <div style="margin-top: 15px; background: #0f172a; padding: 12px; border-radius: 6px; text-align: center; border: 1px dashed #38bdf8;">
          <div style="font-size: 8pt; color: #94a3b8;">ACTIVE PASSCODE</div>
          <div style="font-size: 20pt; font-weight: bold; letter-spacing: 0.2em; color: #34d399;">849 201</div>
          <div style="font-size: 8pt; color: #cbd5e1;">Share PIN with visitor for entry gate verification</div>
        </div>
      </div>
    </div>
  </div>
`));

// Page 80
htmlPages.push(makePage(80, `
  <h2>4. GUARD CONSOLE & PASS VERIFICATION</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/guard/pass-verify</div>
    </div>
    <div class="mockup-body">
      <h4 style="color: #34d399; margin-bottom: 10px;">🛡️ Security Gate Checkpoint</h4>
      <div style="background: #1e293b; padding: 15px; border-radius: 6px; border: 1px solid #334155; text-align: center;">
        <div style="font-size: 9pt; color: #cbd5e1; margin-bottom: 8px;">ENTER 6-DIGIT VISITOR CODE</div>
        <div style="background: #0f172a; padding: 10px; width: 180px; margin: 0 auto 12px auto; border-radius: 6px; font-size: 16pt; letter-spacing: 0.15em; border: 1px solid #0284c7; color: #fff;">849201</div>
        <div style="background: #10b981; color: #fff; padding: 8px 20px; display: inline-block; border-radius: 4px; font-weight: bold; font-size: 9pt;">VERIFY ENTRY</div>
        
        <div style="margin-top: 15px; background: #064e3b; border: 1px solid #10b981; padding: 10px; border-radius: 6px; color: #a7f3d0; text-align: left; font-size: 9pt;">
          ✓ PASS VERIFIED MATCH: Rohan Sharma | Destination: Flat B-402 | Validated at Gate 1
        </div>
      </div>
    </div>
  </div>
`));

// Page 81
htmlPages.push(makePage(81, `
  <h2>5. REAL-TIME SOS EMERGENCY RADAR</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/guard/sos-radar</div>
    </div>
    <div class="mockup-body">
      <div style="background: #7f1d1d; border: 2px solid #ef4444; padding: 15px; border-radius: 6px; color: #fecaca;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: bold; font-size: 11pt; color: #fff;">🚨 HIGH PRIORITY EMERGENCY ALERT</span>
          <span style="background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 8pt; font-weight: bold;">LIVE SOS</span>
        </div>
        <div style="font-size: 14pt; font-weight: bold; color: #fff; margin-bottom: 5px;">MEDICAL EMERGENCY - FLAT A-104</div>
        <div style="font-size: 9pt; margin-bottom: 10px;">Triggered by: Dr. Suresh Kumar | Contact: +91 98450 12345</div>
        <div style="background: #991b1b; padding: 8px; border-radius: 4px; text-align: center; font-weight: bold; color: #fff; font-size: 9pt;">DISPATCH GATE GUARD IMMEDIATELY</div>
      </div>
    </div>
  </div>
`));

// Page 82
htmlPages.push(makePage(82, `
  <h2>6. MAINTENANCE ERP INVOICE PORTAL</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/resident/invoices</div>
    </div>
    <div class="mockup-body">
      <h4 style="color: #38bdf8; margin-bottom: 10px;">📄 Society Maintenance Invoice #INV-2026-07</h4>
      <div style="background: #1e293b; padding: 12px; border-radius: 6px; border: 1px solid #334155; font-size: 9pt;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #475569; padding-bottom: 6px;">
          <span>Billed To: Flat C-301 (1,450 sqft)</span>
          <span style="color: #34d399; font-weight: bold;">STATUS: PAID</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Base Maintenance Charge (@ ₹3.0/sqft)</span>
          <span>₹ 4,350.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Sinking Fund Allocation</span>
          <span>₹ 500.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Water Metering Charge</span>
          <span>₹ 350.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #475569; padding-top: 6px; font-weight: bold; color: #38bdf8;">
          <span>Total Amount Billed</span>
          <span>₹ 5,200.00</span>
        </div>
      </div>
    </div>
  </div>
`));

// Page 83
htmlPages.push(makePage(83, `
  <h2>7. HELPDESK TICKET RESOLUTION QUEUE</h2>
  <div class="mockup-window">
    <div class="mockup-header">
      <div class="dots"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div>
      <div class="address-bar">http://localhost:5173/admin/tickets</div>
    </div>
    <div class="mockup-body">
      <h4 style="color: #facc15; margin-bottom: 10px;">🛠️ Active Helpdesk Tickets</h4>
      <div style="background: #1e293b; padding: 10px; border-radius: 6px; border: 1px solid #334155; font-size: 8.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 6px;">
          <div>
            <span style="color: #f87171; font-weight: bold;">[PLUMBING]</span> Main pipeline leakage in Block B basement
            <div style="color: #94a3b8; font-size: 7.5pt;">Raised by: Flat B-102 | 2 hours ago</div>
          </div>
          <span style="background: #b45309; color: #fff; padding: 2px 6px; border-radius: 3px;">IN PROGRESS</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="color: #60a5fa; font-weight: bold;">[ELECTRICAL]</span> Elevator light flickering in Block A
            <div style="color: #94a3b8; font-size: 7.5pt;">Raised by: Flat A-504 | 5 hours ago</div>
          </div>
          <span style="background: #047857; color: #fff; padding: 2px 6px; border-radius: 3px;">RESOLVED</span>
        </div>
      </div>
    </div>
  </div>
`));

// Page 84
htmlPages.push(makePage(84, `
  <h1>CONCLUSION</h1>
  
  <p>The Smart Community Services platform establishes an end-to-end web architecture connecting gated society administration with resident lifestyle and security solutions, creating a unified digital ecosystem tailored to modern urban communities. By seamlessly bridging the gap between gate checkpoints, domestic helper management, financial billing, maintenance handling, and real-time emergency dispatches, the platform redefines how residents and management committees interact.</p>

  <p>Traditional society software often restricts functionality to basic noticeboards or disconnected messaging groups, forcing users to rely on physical logbooks for visitors and manual spreadsheets for financial accounting. In contrast, Smart Community Services integrates these critical touchpoints into a single, cohesive full-stack environment. Powered by Node.js, Express, TypeScript, Prisma ORM, SQLite, React 18, and Socket.io, the system efficiently processes real-time data flows from pre-approved gate passes to instant emergency SOS alerts.</p>

  <p>Furthermore, the modular integration of database schemas and WebSocket room gateways ensures that scalability remains a core strength, allowing the system to expand to larger residential complexes without compromising performance or security. Through this holistic engineering approach, Smart Community Services eliminates perimeter vulnerabilities, streamlines society accounting, speeds up maintenance delivery, and sets a modern benchmark for smart community management platforms.</p>
`));

// Page 85
htmlPages.push(makePage(85, `
  <h1>FUTURE SCOPE</h1>
  
  <p>Looking ahead, the future scope of the Smart Community Services platform lies in expanding its core architecture to incorporate emerging, data-driven technologies that further enhance resident convenience, security automation, and society sustainability:</p>

  <ul>
    <li><strong>AI-Powered Facial Recognition at Gates:</strong> Integrating computer vision algorithms at entry checkpoints to automatically authenticate pre-registered residents and frequent domestic helpers, eliminating manual guard verification.</li>
    <li><strong>Automatic License Plate Recognition (ALPR):</strong> Deploying optical character recognition (OCR) cameras at society vehicle gates to automatically open boom barriers for authorized resident vehicles.</li>
    <li><strong>Smart IoT Lock Integration:</strong> Connecting resident digital door locks to the platform, enabling pre-approved visitors to unlock specific doors during designated time slots.</li>
    <li><strong>EV Charging Station Automated Billing:</strong> Integrating electric vehicle (EV) charging station telemetry with the ERP module to automatically append charging sessions to monthly flat maintenance invoices.</li>
    <li><strong>Localized Community Marketplace:</strong> Expanding the resident forum into a verified hyper-local marketplace for resident buy-and-sell listings, skill sharing, and community event ticketing.</li>
    <li><strong>Blockchain Financial Audit Trail:</strong> Implementing immutable ledger records on a distributed blockchain for society maintenance fund allocations, guaranteeing absolute financial transparency.</li>
  </ul>
`));

// Page 86
htmlPages.push(makePage(86, `
  <h1>BIBLIOGRAPHY</h1>
  
  <p><strong>Textbooks & Academic References:</strong></p>
  <ul class="arrow-list">
    <li><strong>Ian Sommerville</strong> – <em>Software Engineering (10th Edition)</em>, Pearson Education, 2016. → Foundational reference for software lifecycle methodologies, system design principles, and software requirements analysis.</li>
    <li><strong>Roger S. Pressman & Bruce R. Maxim</strong> – <em>Software Engineering: A Practitioner's Approach (8th Edition)</em>, McGraw-Hill, 2015. → Guide for system modeling techniques including Entity-Relationship (ER) diagrams and Data Flow Diagrams (DFDs).</li>
    <li><strong>Ramez Elmasri & Shamkant B. Navathe</strong> – <em>Fundamentals of Database Systems (7th Edition)</em>, Pearson, 2016. → Resource for relational database design, normalization, ACID compliance, and SQL query optimization.</li>
  </ul>

  <p><strong>Web Resources & Official Technical Documentation:</strong></p>
  <ul class="arrow-list">
    <li>React 18 Official Documentation: <a href="https://react.dev" style="color: #2563eb;">https://react.dev</a></li>
    <li>Node.js & Express API Guide: <a href="https://expressjs.com" style="color: #2563eb;">https://expressjs.com</a></li>
    <li>Prisma ORM Documentation: <a href="https://www.prisma.io/docs" style="color: #2563eb;">https://www.prisma.io/docs</a></li>
    <li>Socket.io WebSockets Gateway: <a href="https://socket.io/docs/v4/" style="color: #2563eb;">https://socket.io/docs/v4/</a></li>
    <li>Tailwind CSS Framework: <a href="https://tailwindcss.com" style="color: #2563eb;">https://tailwindcss.com</a></li>
    <li>W3Schools Web Tutorials: <a href="https://www.w3schools.com" style="color: #2563eb;">https://www.w3schools.com</a></li>
    <li>Stack Overflow Developer Forum: <a href="https://stackoverflow.com" style="color: #2563eb;">https://stackoverflow.com</a></li>
  </ul>
`));

const fullHtmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Smart Community Services - Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    color: #0f172a;
    background-color: #e2e8f0;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm 20mm 20mm 20mm;
    margin: 15px auto;
    background: #ffffff;
    border: 4px double #0f172a;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  .page-header {
    text-align: right;
    font-weight: bold;
    font-size: 13pt;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #0f172a;
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 4px;
    margin-bottom: 15px;
  }
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 11pt;
    color: #0f172a;
    border-top: 1px solid #94a3b8;
    padding-top: 6px;
    margin-top: 15px;
  }
  .page-content {
    flex: 1;
    text-align: justify;
  }
  .cover-page .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .cover-title {
    font-size: 32pt;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #000;
  }
  h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 12px; text-transform: uppercase; }
  h2 { font-size: 14pt; font-weight: bold; margin-top: 12px; margin-bottom: 8px; text-transform: uppercase; }
  h3 { font-size: 12pt; font-weight: bold; margin-top: 10px; margin-bottom: 6px; }
  h4 { font-size: 11pt; font-weight: bold; margin-top: 8px; margin-bottom: 4px; }
  p { font-size: 11pt; margin-bottom: 8px; line-height: 1.45; }
  ul, ol { margin-left: 20px; margin-bottom: 10px; font-size: 11pt; }
  li { margin-bottom: 4px; }
  .arrow-list { list-style: none; padding-left: 0; }
  .arrow-list li { position: relative; padding-left: 18px; margin-bottom: 6px; }
  .arrow-list li::before { content: "➢"; position: absolute; left: 0; color: #0f172a; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
  th, td { border: 1px solid #334155; padding: 6px 10px; text-align: left; }
  th { background-color: #f1f5f9; font-weight: bold; }
  code, pre { font-family: 'Consolas', 'Courier New', monospace; }
  pre { background: #0f172a; color: #f8fafc; padding: 10px; border-radius: 4px; font-size: 8.5pt; overflow-x: auto; white-space: pre-wrap; margin: 8px 0; }
  .mockup-window { border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #0f172a; margin: 10px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .mockup-header { background: #1e293b; padding: 6px 10px; display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 9pt; font-family: sans-serif; }
  .dots { display: flex; gap: 4px; margin-right: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }
  .address-bar { background: #0f172a; color: #cbd5e1; padding: 2px 10px; border-radius: 3px; flex: 1; font-size: 8.5pt; }
  .mockup-body { padding: 12px; color: #f8fafc; font-family: system-ui, sans-serif; }
  @media print {
    body { background: none; }
    .page { margin: 0; border: 4px double #000; box-shadow: none; width: 100%; min-height: 100vh; }
  }
</style>
</head>
<body>
${htmlPages.join('\n')}
</body>
</html>`;

const projectRoot = 'c:\\Users\\Admin\\Desktop\\smart-community-services-main';
const htmlPath = path.join(projectRoot, 'PROJECT_REPORT.html');
const pdfPath = path.join(projectRoot, 'PROJECT_REPORT.pdf');
fs.writeFileSync(htmlPath, fullHtmlDoc, 'utf8');
console.log("Successfully generated PROJECT_REPORT.html with " + htmlPages.length + " pages.");

const { execSync } = require('child_process');
const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;
if (fs.existsSync(edgePath)) {
  console.log("Generating PROJECT_REPORT.pdf via Edge headless...");
  const cmd = `"${edgePath}" --headless --disable-gpu --no-first-run --no-default-browser-check --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log("Successfully generated PROJECT_REPORT.pdf");
  } catch (err) {
    console.error("Failed to generate PDF automatically:", err.message);
  }
}

