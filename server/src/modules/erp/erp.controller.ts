import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendSuccess } from '../../middleware/errorHandler.js';

const createInvoiceSchema = z.object({
  flat_id: z.string().uuid(),
  month: z.string().min(1, 'Month format YYYY-MM required'),
  amount: z.number().positive(),
  breakdown: z.object({
    maintenance: z.number(),
    sinking_fund: z.number(),
    water_charges: z.number(),
    parking: z.number(),
  }),
  due_date: z.string(),
});

const payInvoiceSchema = z.object({
  method: z.string().default('upi'),
  txn_id: z.string().optional(),
});

export async function getInvoices(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const where: any = {};
    if (req.user.role === 'RESIDENT' && req.user.flat_id) {
      where.flat_id = req.user.flat_id;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        flat: { include: { block: true, owner: { select: { name: true, email: true } } } },
        payments: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return sendSuccess(res, invoices);
  } catch (error) {
    next(error);
  }
}

export async function createInvoice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { flat_id, month, amount, breakdown, due_date } = createInvoiceSchema.parse(req.body);

    const existing = await prisma.invoice.findUnique({
      where: {
        flat_id_month: {
          flat_id,
          month,
        },
      },
      include: { flat: { include: { block: true } } },
    });

    if (existing) {
      const flatName = existing.flat ? `Flat ${existing.flat.number}` : 'this flat';
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          message: `An invoice for ${flatName} for month '${month}' already exists.`,
        },
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        flat_id,
        month,
        amount,
        breakdown_json: JSON.stringify(breakdown),
        due_date: new Date(due_date),
        status: 'pending',
      },
      include: { flat: { include: { block: true } } },
    });

    return sendSuccess(res, invoice, 201);
  } catch (error) {
    next(error);
  }
}

export async function payInvoice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { method, txn_id } = payInvoiceSchema.parse(req.body);

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });

    if (invoice.status === 'paid') {
      return res.status(400).json({ success: false, error: { message: 'Invoice is already paid' } });
    }

    const payment = await prisma.payment.create({
      data: {
        invoice_id: invoice.id,
        amount: invoice.amount,
        method: method || 'razorpay_mock',
        txn_id: txn_id || `TXN_${Date.now()}`,
        status: 'completed',
      },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'paid' },
      include: { payments: true, flat: true },
    });

    // Create Ledger record
    await prisma.ledger.create({
      data: {
        flat_id: invoice.flat_id,
        type: 'credit',
        amount: invoice.amount,
        note: `Maintenance Payment for ${invoice.month} (Txn: ${payment.txn_id})`,
      },
    });

    return sendSuccess(res, { invoice: updatedInvoice, payment });
  } catch (error) {
    next(error);
  }
}

export async function getLedgers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const where: any = {};
    if (req.user.role === 'RESIDENT' && req.user.flat_id) {
      where.flat_id = req.user.flat_id;
    }

    const ledgers = await prisma.ledger.findMany({
      where,
      include: { flat: { include: { block: true } } },
      orderBy: { created_at: 'desc' },
    });

    return sendSuccess(res, ledgers);
  } catch (error) {
    next(error);
  }
}
