import { Prisma } from "@prisma/client";
import type { AppError } from "@/src/middleware/error-handler.js";

export function mapPrismaError(error: unknown): AppError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code === "P2002") {
    return {
      name: "PrismaUniqueConstraintError",
      message: "Resource already exists",
      messageCode: "UNIQUE_CONSTRAINT_VIOLATION",
      status: 409,
      details: {
        target: error.meta?.target,
      },
    };
  }

  if (error.code === "P2003") {
    return {
      name: "PrismaForeignKeyError",
      message: "Operation violates a related resource constraint",
      messageCode: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
      status: 409,
    };
  }

  if (error.code === "P2025") {
    return {
      name: "PrismaRecordNotFoundError",
      message: "Requested resource was not found",
      messageCode: "RECORD_NOT_FOUND",
      status: 404,
    };
  }

  return {
    name: "PrismaKnownRequestError",
    message: "Database request failed",
    messageCode: "DATABASE_REQUEST_FAILED",
    status: 400,
  };
}
