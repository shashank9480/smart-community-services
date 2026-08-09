import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';

const createTicketSchema = z.object({
  category: z.string().min(1, 'Category required'),
  description: z.string().min(1, 'Description required'),
  attachment_url: z.string().optional(),
});

const updateTicketSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Resolved']).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  comment: z.string().optional(),
});

export async function getTickets(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const where: any = {};
    if (req.user.role === 'RESIDENT') {
      where.raised_by = req.user.id;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        creator: { select: { name: true, email: true, flat: { include: { block: true } } } },
        assignee: { select: { name: true, role: true } },
        updates: { orderBy: { created_at: 'asc' } },
      },
      orderBy: { created_at: 'desc' },
    });

    return sendSuccess(res, tickets);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { category, description, attachment_url } = createTicketSchema.parse(req.body);
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const ticket = await prisma.ticket.create({
      data: {
        raised_by: req.user.id,
        category,
        description,
        attachment_url,
        status: 'Open',
      },
      include: { creator: true },
    });

    return sendSuccess(res, ticket, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { status, assigned_to, comment } = updateTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return res.status(404).json({ success: false, error: { message: 'Ticket not found' } });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

    const updated = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: { creator: true, assignee: true, updates: true },
    });

    if (comment || status) {
      await prisma.ticketUpdate.create({
        data: {
          ticket_id: id,
          comment: comment || `Status updated to ${status}`,
          status_change: status || null,
        },
      });
    }

    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}
