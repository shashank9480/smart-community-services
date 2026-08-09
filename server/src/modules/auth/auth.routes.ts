import { Router } from 'express';
import { login, getMe, updateProfile } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
