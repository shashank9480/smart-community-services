import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes.js';
import foundationRoutes from './modules/foundation/foundation.routes.js';
import visitorRoutes from './modules/visitor/visitor.routes.js';
import staffRoutes from './modules/staff/staff.routes.js';
import erpRoutes from './modules/erp/erp.routes.js';
import helpdeskRoutes from './modules/helpdesk/helpdesk.routes.js';
import communityRoutes from './modules/community/community.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSockets } from './sockets/index.js';
import { initCronJobs } from './jobs/index.js';
import { prisma } from './config/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foundation', foundationRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/community', communityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Initialize Sockets & Jobs
initSockets(server);
initCronJobs();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Smart Community Services Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
