import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { apiV1Router } from "./routes.js";
import { setupSwagger, swaggerDocument } from "./utils/swagger.js";

export function buildApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  setupSwagger(app);

  app.get("/swagger.json", (_req, res) => {
    res.json(swaggerDocument);
  });

  app.use("/api/v1", apiV1Router);
  app.use(errorHandler);
  return app;
}
