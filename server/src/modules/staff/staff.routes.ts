import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  assignStaff,
  deleteAssignment,
  punchStaff,
  reviewStaff,
} from './staff.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getStaff);
router.post('/', requireRole('ADMIN'), createStaff);
router.put('/:id', requireRole('ADMIN'), updateStaff);
router.delete('/:id', requireRole('ADMIN'), deleteStaff);
router.post('/assign', requireRole('ADMIN', 'RESIDENT'), assignStaff);
router.delete('/assign/:id', requireRole('ADMIN'), deleteAssignment);
router.post('/punch', requireRole('GUARD', 'ADMIN'), punchStaff);
router.post('/review', requireRole('RESIDENT'), reviewStaff);

export default router;

