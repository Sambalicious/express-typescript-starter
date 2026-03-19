import { asyncHandler } from "@/src/utils/asyncHandler.js";
import { Router } from "express";

import { UserProfileController } from "./user-profile.controller.js";
import { UserProfileService } from "./user-profile.service.js";

const userProfileService = new UserProfileService();
const userProfileController = new UserProfileController(userProfileService);

const routes = Router();

routes.get("/", asyncHandler(userProfileController.getUserProfiles));
routes.get("/:id", asyncHandler(userProfileController.getUserProfile));
routes.put("/:id", asyncHandler(userProfileController.updateProfile));
routes.delete("/:id", asyncHandler(userProfileController.deleteProfile));

export { routes as userProfileRoutes };
