import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', details: err.flatten() });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};
