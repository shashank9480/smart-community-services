import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  getTickets,
  createTicket,
  updateTicket,
} from './helpdesk.controller.js';

const router = Router();

router.use(authenticate);

router.get('/tickets', getTickets);
router.post('/tickets', requireRole('RESIDENT', 'ADMIN'), createTicket);
router.patch('/tickets/:id', requireRole('ADMIN', 'STAFF_MANAGER', 'RESIDENT'), updateTicket);

export default router;
