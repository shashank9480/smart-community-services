import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { emailOrPhone, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
      include: {
        flat: {
          include: { block: true },
        },
        society: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Invalid credentials. User not found.' },
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Invalid credentials. Wrong password.' },
      });
    }

    const secret = process.env.JWT_SECRET || 'super-secret-smart-community-services-jwt-key-2026';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        flat_id: user.flat_id,
        society_id: user.society_id,
      },
      secret,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    return sendSuccess(res, {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, data: null, error: { message: 'Not authenticated' } });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        flat: {
          include: { block: true },
        },
        society: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, data: null, error: { message: 'User not found' } });
    }

    const { password_hash, ...userWithoutPassword } = user;
    return sendSuccess(res, userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().optional(),
});

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, data: null, error: { message: 'Not authenticated' } });
    }

    const { name, email, phone, password } = updateProfileSchema.parse(req.body);

    // Check if email or phone is taken by another user
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: req.user.id } },
          { OR: [{ email }, { phone }] },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Email or phone number is already registered to another account.' },
      });
    }

    const dataToUpdate: any = { name, email, phone };
    if (password && password.trim().length > 0) {
      dataToUpdate.password_hash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      include: {
        flat: { include: { block: true } },
        society: true,
      },
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return sendSuccess(res, userWithoutPassword);
  } catch (error) {
    next(error);
  }
}
