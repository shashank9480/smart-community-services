import { Router } from 'express';
import {
  getSocieties,
  createSociety,
  updateSociety,
  deleteSociety,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from './foundation.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

// Protect all routes with auth
router.use(authenticate);

// Societies
router.get('/societies', getSocieties);
router.post('/societies', requireRole('ADMIN'), createSociety);
router.put('/societies/:id', requireRole('ADMIN'), updateSociety);
router.delete('/societies/:id', requireRole('ADMIN'), deleteSociety);

// Blocks
router.get('/blocks', getBlocks);
router.post('/blocks', requireRole('ADMIN'), createBlock);
router.put('/blocks/:id', requireRole('ADMIN'), updateBlock);
router.delete('/blocks/:id', requireRole('ADMIN'), deleteBlock);

// Flats
router.get('/flats', getFlats);
router.post('/flats', requireRole('ADMIN'), createFlat);
router.put('/flats/:id', requireRole('ADMIN'), updateFlat);
router.delete('/flats/:id', requireRole('ADMIN'), deleteFlat);

// Users / Residents / Guards
router.get('/users', requireRole('ADMIN'), getUsers);
router.post('/users', requireRole('ADMIN'), createUser);
router.put('/users/:id', requireRole('ADMIN'), updateUser);
router.delete('/users/:id', requireRole('ADMIN'), deleteUser);

export default router;

