import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';
import { pushToGuards, pushToFlat } from '../../sockets/index.js';

// Pass Creation Schema
const createPassSchema = z.object({
  guest_name: z.string().min(1, 'Guest name is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
});

// Passcode Verification Schema
const verifyPassSchema = z.object({
  code: z.string().length(6, 'Passcode must be 6 digits'),
});

// Parcel Inward Schema
const createParcelSchema = z.object({
  flat_id: z.string().min(1, 'Flat ID is required'),
});

// Parcel OTP Collection Schema
const collectParcelSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export async function createVisitorPass(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { guest_name, purpose, valid_from, valid_to } = createPassSchema.parse(req.body);
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    // Generate random 6-digit passcode
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const fromDate = valid_from ? new Date(valid_from) : new Date();
    const toDate = valid_to ? new Date(valid_to) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const pass = await prisma.visitorPass.create({
      data: {
        code,
        created_by: req.user.id,
        guest_name,
        purpose,
        valid_from: fromDate,
        valid_to: toDate,
        status: 'active',
      },
    });

    // Notify guards via Socket
    pushToGuards('visitor_pass_created', {
      passId: pass.id,
      guest_name: pass.guest_name,
      code: pass.code,
      flat: req.user.flat_id,
    });

    return sendSuccess(res, pass, 201);
  } catch (error) {
    next(error);
  }
}

export async function getVisitorPasses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const where: any = {};
    if (req.user.role === 'RESIDENT') {
      where.created_by = req.user.id;
    }

    const passes = await prisma.visitorPass.findMany({
      where,
      include: {
        creator: {
          select: { name: true, email: true, flat: { include: { block: true } } },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return sendSuccess(res, passes);
  } catch (error) {
    next(error);
  }
}

export async function verifyVisitorPass(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { code } = verifyPassSchema.parse(req.body);
    if (!req.user || (req.user.role !== 'GUARD' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, error: { message: 'Only guards or admin can verify passes' } });
    }

    const pass = await prisma.visitorPass.findUnique({
      where: { code },
      include: {
        creator: {
          include: { flat: { include: { block: true } } },
        },
      },
    });

    if (!pass) {
      return res.status(404).json({ success: false, error: { message: 'Invalid 6-digit passcode. No pass found.' } });
    }

    if (pass.status !== 'active') {
      return res.status(400).json({ success: false, error: { message: `Passcode is ${pass.status}` } });
    }

    // Mark pass used and record gate log
    await prisma.visitorPass.update({
      where: { id: pass.id },
      data: { status: 'used' },
    });

    const gateLog = await prisma.gateLog.create({
      data: {
        type: 'visitor',
        ref_id: pass.code,
        guard_id: req.user.id,
      },
    });

    // Notify resident's flat via socket
    if (pass.creator.flat_id) {
      pushToFlat(pass.creator.flat_id, 'gate_entry_alert', {
        guest_name: pass.guest_name,
        purpose: pass.purpose,
        entry_time: gateLog.entry_time,
      });
    }

    return sendSuccess(res, { verified: true, pass, gateLog });
  } catch (error) {
    next(error);
  }
}

export async function getGateLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const logs = await prisma.gateLog.findMany({
      include: {
        guard: { select: { name: true } },
      },
      orderBy: { entry_time: 'desc' },
      take: 50,
    });
    return sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

export async function createParcel(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { flat_id } = createParcelSchema.parse(req.body);
    if (!req.user || (req.user.role !== 'GUARD' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, error: { message: 'Only guards can log parcels' } });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const parcel = await prisma.parcel.create({
      data: {
        flat_id,
        guard_id: req.user.id,
        otp,
        status: 'pending',
      },
      include: {
        flat: { include: { block: true } },
      },
    });

    pushToFlat(flat_id, 'parcel_arrived', { parcelId: parcel.id, otp });

    return sendSuccess(res, parcel, 201);
  } catch (error) {
    next(error);
  }
}

export async function getParcels(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const where: any = {};
    if (req.user.role === 'RESIDENT' && req.user.flat_id) {
      where.flat_id = req.user.flat_id;
    }

    const parcels = await prisma.parcel.findMany({
      where,
      include: {
        flat: { include: { block: true } },
        guard: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return sendSuccess(res, parcels);
  } catch (error) {
    next(error);
  }
}

export async function collectParcel(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { otp } = collectParcelSchema.parse(req.body);

    const parcel = await prisma.parcel.findUnique({ where: { id } });
    if (!parcel) {
      return res.status(404).json({ success: false, error: { message: 'Parcel not found' } });
    }

    if (parcel.otp !== otp) {
      return res.status(400).json({ success: false, error: { message: 'Invalid parcel collection OTP' } });
    }

    const updated = await prisma.parcel.update({
      where: { id },
      data: {
        status: 'collected',
        collected_at: new Date(),
      },
    });

    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}
