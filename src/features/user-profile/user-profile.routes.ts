import { asyncHandler } from "@/src/utils/asyncHandler.js";
import { Router } from "express";
import {
  deleteProfile,
  getUserProfile,
  getUserProfiles,
  updateProfile,
} from "./user-profile.controller.js";

const routes = Router();

routes.get("/", asyncHandler(getUserProfiles));
routes.get("/:id", asyncHandler(getUserProfile));
routes.put("/:id", asyncHandler(updateProfile));
routes.delete("/:id", asyncHandler(deleteProfile));

export { routes as userProfileRoutes };
