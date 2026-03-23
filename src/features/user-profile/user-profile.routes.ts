import { asyncHandler } from "@/src/utils/asyncHandler";
import { Router } from "express";

import { UserProfileService } from "@/src/features/user-profile/user-profile.service";
import { UserProfileController } from "./user-profile.controller";


const userProfileService = new UserProfileService();
const userProfileController = new UserProfileController(userProfileService);

const routes = Router();

routes.get("/", asyncHandler(userProfileController.getUserProfiles));
routes.get("/:id", asyncHandler(userProfileController.getUserProfile));
routes.put("/:id", asyncHandler(userProfileController.updateProfile));
routes.delete("/:id", asyncHandler(userProfileController.deleteProfile));

export { routes as userProfileRoutes };
