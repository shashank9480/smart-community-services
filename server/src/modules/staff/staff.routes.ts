import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  getStaff,
  createStaff,
  assignStaff,
  punchStaff,
  reviewStaff,
} from './staff.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getStaff);
router.post('/', requireRole('ADMIN'), createStaff);
router.post('/assign', requireRole('ADMIN', 'RESIDENT'), assignStaff);
router.post('/punch', requireRole('GUARD', 'ADMIN'), punchStaff);
router.post('/review', requireRole('RESIDENT'), reviewStaff);

export default router;
