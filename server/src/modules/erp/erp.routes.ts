import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  getInvoices,
  createInvoice,
  payInvoice,
  getLedgers,
} from './erp.controller.js';

const router = Router();

router.use(authenticate);

router.get('/invoices', getInvoices);
router.post('/invoices', requireRole('ADMIN'), createInvoice);
router.post('/invoices/:id/pay', requireRole('RESIDENT', 'ADMIN'), payInvoice);
router.get('/ledgers', getLedgers);

export default router;
