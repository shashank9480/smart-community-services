import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: 'Validation error',
        details: formattedErrors,
      },
    });
  }

  if (err?.code === 'P2002' || (typeof err?.message === 'string' && err.message.includes('Unique constraint failed'))) {
    const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(', ') : err?.meta?.target || 'unique fields';
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: `A record with duplicate ${target} already exists.`,
      },
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
    },
  });
}

export function sendSuccess(res: Response, data: any, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    error: null,
  });
}
