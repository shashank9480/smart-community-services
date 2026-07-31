import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  getNotices,
  createNotice,
  getFacilities,
  createBooking,
  triggerSOS,
  getSOSAlerts,
  resolveSOS,
} from './community.controller.js';

const router = Router();

router.use(authenticate);

// Notices
router.get('/notices', getNotices);
router.post('/notices', requireRole('ADMIN'), createNotice);

// Facilities & Bookings
router.get('/facilities', getFacilities);
router.post('/bookings', requireRole('RESIDENT', 'ADMIN'), createBooking);

// SOS Alerts
router.post('/sos', requireRole('RESIDENT', 'ADMIN'), triggerSOS);
router.get('/sos', getSOSAlerts);
router.patch('/sos/:id/resolve', requireRole('GUARD', 'ADMIN'), resolveSOS);

export default router;
