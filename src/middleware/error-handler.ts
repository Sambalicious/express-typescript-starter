import type { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  status?: number;
  messageCode?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    messageCode: err.messageCode || "INTERNAL_ERROR",
    details: err.details || undefined,
  });
}
