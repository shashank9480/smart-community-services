import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';
import { pushToFlat } from '../../sockets/index.js';

const createStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  category: z.string().min(1, 'Category is required'),
  photo_url: z.string().optional(),
});

const assignStaffSchema = z.object({
  staff_id: z.string().uuid(),
  flat_id: z.string().uuid(),
});

const punchStaffSchema = z.object({
  staff_id: z.string().uuid(),
  flat_id: z.string().uuid().optional().nullable(),
});

const reviewStaffSchema = z.object({
  staff_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function getStaff(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { society_id, category } = req.query;
    const where: any = {};
    if (category && category !== 'ALL') where.category = String(category);

    const staff = await prisma.staff.findMany({
      where,
      include: {
        assignments: {
          include: {
            flat: { include: { block: { include: { society: true } } } },
          },
        },
        reviews: {
          include: { reviewer: { select: { id: true, name: true, email: true } } },
          orderBy: { created_at: 'desc' },
        },
        attendance: {
          take: 5,
          orderBy: { punch_in: 'desc' },
          include: { guard: { select: { id: true, name: true } } },
        },
      },
      orderBy: { avg_rating: 'desc' },
    });

    let filteredStaff = staff;
    if (society_id && String(society_id) !== 'ALL') {
      const targetSocId = String(society_id);
      filteredStaff = staff.filter((s) => {
        // If staff is assigned to a flat in this society
        const matchesAssignment = s.assignments.some(
          (a) => a.flat?.block?.society_id === targetSocId || a.flat?.block?.society?.id === targetSocId
        );
        // Or if staff has no assignments yet, show in all
        return matchesAssignment || s.assignments.length === 0;
      });
    }

    return sendSuccess(res, filteredStaff);
  } catch (error) {
    next(error);
  }
}

export async function createStaff(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createStaffSchema.parse(req.body);
    const staff = await prisma.staff.create({ data });
    return sendSuccess(res, staff, 201);
  } catch (error) {
    next(error);
  }
}

export async function assignStaff(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { staff_id, flat_id } = assignStaffSchema.parse(req.body);

    const existing = await prisma.staffAssignment.findUnique({
      where: {
        staff_id_flat_id: { staff_id, flat_id },
      },
      include: { staff: true, flat: true },
    });

    if (existing) {
      return sendSuccess(res, existing, 200);
    }

    const assignment = await prisma.staffAssignment.create({
      data: { staff_id, flat_id },
      include: { staff: true, flat: true },
    });
    return sendSuccess(res, assignment, 201);
  } catch (error) {
    next(error);
  }
}

export async function punchStaff(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { staff_id, flat_id } = punchStaffSchema.parse(req.body);
    if (!req.user || (req.user.role !== 'GUARD' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, error: { message: 'Only guards can record staff attendance' } });
    }

    // Check if staff has active un-closed punch
    const active = await prisma.staffAttendance.findFirst({
      where: { staff_id, punch_out: null },
    });

    if (active) {
      // Punch out
      const updated = await prisma.staffAttendance.update({
        where: { id: active.id },
        data: { punch_out: new Date() },
        include: { staff: true },
      });
      return sendSuccess(res, { action: 'PUNCH_OUT', attendance: updated });
    } else {
      // Punch in
      const created = await prisma.staffAttendance.create({
        data: {
          staff_id,
          flat_id: flat_id || null,
          verified_by: req.user.id,
        },
        include: { staff: true },
      });

      if (flat_id) {
        pushToFlat(flat_id, 'staff_punched_in', {
          staffName: created.staff.name,
          category: created.staff.category,
        });
      }

      return sendSuccess(res, { action: 'PUNCH_IN', attendance: created }, 201);
    }
  } catch (error) {
    next(error);
  }
}

export async function reviewStaff(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { staff_id, rating, comment } = reviewStaffSchema.parse(req.body);
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const review = await prisma.staffReview.create({
      data: {
        staff_id,
        reviewer_id: req.user.id,
        rating,
        comment,
      },
    });

    // Re-calculate avg_rating
    const allReviews = await prisma.staffReview.findMany({ where: { staff_id } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.staff.update({
      where: { id: staff_id },
      data: { avg_rating: parseFloat(avg.toFixed(1)) },
    });

    return sendSuccess(res, review, 201);
  } catch (error) {
    next(error);
  }
}
