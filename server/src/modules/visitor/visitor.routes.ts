import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  createVisitorPass,
  getVisitorPasses,
  verifyVisitorPass,
  getGateLogs,
  createParcel,
  getParcels,
  collectParcel,
} from './visitor.controller.js';

const router = Router();

router.use(authenticate);

// Visitor Passes
router.post('/passes', requireRole('RESIDENT', 'ADMIN'), createVisitorPass);
router.get('/passes', getVisitorPasses);
router.post('/passes/verify', requireRole('GUARD', 'ADMIN'), verifyVisitorPass);

// Gate Logs
router.get('/logs', getGateLogs);

// Parcels
router.post('/parcels', requireRole('GUARD', 'ADMIN'), createParcel);
router.get('/parcels', getParcels);
router.post('/parcels/:id/collect', collectParcel);

export default router;
