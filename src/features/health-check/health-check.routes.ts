import { Router } from "express";

import { asyncHandler } from "@/src/utils/asyncHandler.js";

import { healthCheckHandler } from "./health-check.controllers.js";

const router: Router = Router();
router.get("/", asyncHandler(healthCheckHandler));

export { router as healthCheckRoutes };
