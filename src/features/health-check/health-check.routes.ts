import { Router } from "express";

import { asyncHandler } from "@/src/utils/asyncHandler";

import { healthCheckHandler } from "./health-check.controllers";

const router: Router = Router();
router.get("/", asyncHandler(healthCheckHandler));

export { router as healthCheckRoutes };
