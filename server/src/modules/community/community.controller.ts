import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';
import { pushToGuards } from '../../sockets/index.js';

const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title required'),
  body: z.string().min(1, 'Body required'),
});

const createBookingSchema = z.object({
  facility_id: z.string().uuid(),
  date: z.string(), // YYYY-MM-DD
  slot: z.string(), // e.g. "10:00-11:00"
});

const triggerSOSSchema = z.object({
  type: z.enum(['medical', 'fire', 'gas', 'other']).default('medical'),
});

export async function getNotices(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notices = await prisma.notice.findMany({
      include: { author: { select: { name: true, role: true } } },
      orderBy: { created_at: 'desc' },
    });
    return sendSuccess(res, notices);
  } catch (error) {
    next(error);
  }
}

export async function createNotice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, body } = createNoticeSchema.parse(req.body);
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { message: 'Only admins can post notices' } });
    }

    const society = await prisma.society.findFirst();
    if (!society) return res.status(400).json({ success: false, error: { message: 'No society registered' } });

    const notice = await prisma.notice.create({
      data: {
        society_id: society.id,
        posted_by: req.user.id,
        title,
        body,
      },
      include: { author: true },
    });

    return sendSuccess(res, notice, 201);
  } catch (error) {
    next(error);
  }
}

export async function getFacilities(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        bookings: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });
    return sendSuccess(res, facilities);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { facility_id, date, slot } = createBookingSchema.parse(req.body);
    if (!req.user || !req.user.flat_id) {
      return res.status(400).json({ success: false, error: { message: 'User must be assigned to a flat to book facilities' } });
    }

    const existing = await prisma.booking.findUnique({
      where: {
        facility_id_date_slot: {
          facility_id,
          date,
          slot,
        },
      },
    });

    if (existing && existing.status === 'confirmed') {
      return res.status(400).json({ success: false, error: { message: 'Slot is already booked' } });
    }

    const booking = await prisma.booking.create({
      data: {
        facility_id,
        flat_id: req.user.flat_id,
        date,
        slot,
        status: 'confirmed',
      },
      include: { facility: true, flat: true },
    });

    return sendSuccess(res, booking, 201);
  } catch (error) {
    next(error);
  }
}

export async function triggerSOS(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { type } = triggerSOSSchema.parse(req.body);
    if (!req.user || !req.user.flat_id) {
      return res.status(400).json({ success: false, error: { message: 'Resident must have flat assigned for SOS' } });
    }

    const alert = await prisma.sOSAlert.create({
      data: {
        flat_id: req.user.flat_id,
        type,
        status: 'active',
      },
      include: {
        flat: { include: { block: true, owner: true } },
      },
    });

    // Real-time WebSocket alarm push to all Guards on duty
    pushToGuards('sos_alert', {
      alertId: alert.id,
      flatNumber: alert.flat.number,
      blockName: alert.flat.block?.name,
      residentName: req.user.name,
      type: alert.type,
      triggered_at: alert.triggered_at,
    });

    return sendSuccess(res, alert, 201);
  } catch (error) {
    next(error);
  }
}

export async function getSOSAlerts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const alerts = await prisma.sOSAlert.findMany({
      include: {
        flat: { include: { block: true, owner: { select: { name: true, phone: true } } } },
      },
      orderBy: { triggered_at: 'desc' },
      take: 20,
    });
    return sendSuccess(res, alerts);
  } catch (error) {
    next(error);
  }
}

export async function resolveSOS(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const alert = await prisma.sOSAlert.update({
      where: { id },
      data: {
        status: 'resolved',
        resolved_at: new Date(),
      },
    });
    return sendSuccess(res, alert);
  } catch (error) {
    next(error);
  }
}
