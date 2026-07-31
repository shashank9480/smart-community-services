import { Router } from 'express';
import {
  getSocieties,
  createSociety,
  getBlocks,
  createBlock,
  getFlats,
  createFlat,
  getUsers,
  createUser,
  deleteUser,
} from './foundation.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

// Protect all routes with auth
router.use(authenticate);

// Societies
router.get('/societies', getSocieties);
router.post('/societies', requireRole('ADMIN'), createSociety);

// Blocks
router.get('/blocks', getBlocks);
router.post('/blocks', requireRole('ADMIN'), createBlock);

// Flats
router.get('/flats', getFlats);
router.post('/flats', requireRole('ADMIN'), createFlat);

// Users / Residents / Guards
router.get('/users', requireRole('ADMIN'), getUsers);
router.post('/users', requireRole('ADMIN'), createUser);
router.delete('/users/:id', requireRole('ADMIN'), deleteUser);

export default router;
