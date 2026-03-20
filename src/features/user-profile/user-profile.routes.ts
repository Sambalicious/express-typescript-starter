import { asyncHandler } from "@/src/utils/asyncHandler.js";
import { Router } from "express";

import { UserProfileService } from "@/src/features/user-profile/user-profile.service.js";
import { UserProfileController } from "./user-profile.controller.js";


const userProfileService = new UserProfileService();
const userProfileController = new UserProfileController(userProfileService);

const routes = Router();

routes.get("/", asyncHandler(userProfileController.getUserProfiles));
routes.get("/:id", asyncHandler(userProfileController.getUserProfile));
routes.put("/:id", asyncHandler(userProfileController.updateProfile));
routes.delete("/:id", asyncHandler(userProfileController.deleteProfile));

export { routes as userProfileRoutes };
