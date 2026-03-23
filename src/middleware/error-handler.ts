import type { NextFunction, Request, Response } from "express";
import { mapPrismaError } from "@/src/utils/prismaError";

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
  const prismaError = mapPrismaError(err);
  const normalizedError = prismaError || err;
  const status = normalizedError.status || 500;
  const details =
    process.env.NODE_ENV === "production" ? undefined : normalizedError.details;

  res.status(status).json({
    message: normalizedError.message || "Internal Server Error",
    messageCode: normalizedError.messageCode || "INTERNAL_ERROR",
    details,
  });
}
