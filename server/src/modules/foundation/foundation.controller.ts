import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';
export enum Role {
  RESIDENT = 'RESIDENT',
  GUARD = 'GUARD',
  ADMIN = 'ADMIN',
  STAFF_MANAGER = 'STAFF_MANAGER',
}


// =======================
// Society CRUD
// =======================
const societySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export async function getSocieties(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const societies = await prisma.society.findMany({
      include: {
        _count: {
          select: { blocks: true, users: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    return sendSuccess(res, societies);
  } catch (error) {
    next(error);
  }
}

export async function createSociety(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = societySchema.parse(req.body);
    const society = await prisma.society.create({ data });
    return sendSuccess(res, society, 201);
  } catch (error) {
    next(error);
  }
}

// =======================
// Block CRUD
// =======================
const blockSchema = z.object({
  society_id: z.string().uuid('Invalid society ID'),
  name: z.string().min(1, 'Block name required'),
});

export async function getBlocks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { society_id } = req.query;
    const where = society_id ? { society_id: String(society_id) } : {};
    const blocks = await prisma.block.findMany({
      where,
      include: {
        society: true,
        _count: {
          select: { flats: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, blocks);
  } catch (error) {
    next(error);
  }
}

export async function createBlock(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = blockSchema.parse(req.body);
    const block = await prisma.block.create({ data });
    return sendSuccess(res, block, 201);
  } catch (error) {
    next(error);
  }
}

// =======================
// Flat CRUD
// =======================
const flatSchema = z.object({
  block_id: z.string().uuid('Invalid block ID'),
  number: z.string().min(1, 'Flat number required'),
  bhk_type: z.string().min(1, 'BHK type required'),
  sqft: z.number().positive('Sqft must be positive'),
  owner_id: z.string().uuid().optional().nullable(),
});

export async function getFlats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { block_id, society_id } = req.query;
    const where: any = {};
    if (block_id) where.block_id = String(block_id);
    if (society_id) where.block = { society_id: String(society_id) };

    const flats = await prisma.flat.findMany({
      where,
      include: {
        block: {
          include: { society: true },
        },
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
        residents: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
      orderBy: [{ block: { name: 'asc' } }, { number: 'asc' }],
    });
    return sendSuccess(res, flats);
  } catch (error) {
    next(error);
  }
}

export async function createFlat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = flatSchema.parse(req.body);
    const flat = await prisma.flat.create({ data });
    return sendSuccess(res, flat, 201);
  } catch (error) {
    next(error);
  }
}

// =======================
// User / Resident CRUD
// =======================
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters').default('password123'),
  role: z.nativeEnum(Role).default(Role.RESIDENT),
  society_id: z.string().uuid().optional().nullable(),
  flat_id: z.string().uuid().optional().nullable(),
});

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { role, society_id, flat_id } = req.query;
    const where: any = {};
    if (role) where.role = role;
    if (society_id) where.society_id = String(society_id);
    if (flat_id) where.flat_id = String(flat_id);

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        flat: {
          include: {
            block: {
              include: { society: true },
            },
          },
        },
        society: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { password, ...data } = userSchema.parse(req.body);
    const password_hash = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: 'A user with this email or phone already exists.' },
      });
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        password_hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        flat_id: true,
        society_id: true,
      },
    });

    // If resident created and flat assigned, also link owner if flat has no owner yet
    if (user.flat_id && user.role === Role.RESIDENT) {
      const flat = await prisma.flat.findUnique({ where: { id: user.flat_id } });
      if (flat && !flat.owner_id) {
        await prisma.flat.update({
          where: { id: user.flat_id },
          data: { owner_id: user.id },
        });
      }
    }

    return sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    await prisma.user.delete({ where: { id } });
    return sendSuccess(res, { message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}
