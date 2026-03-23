import { asyncHandler } from "@/src/utils/asyncHandler";
import { Router } from "express";

import { UserAuthenticationController } from "./user-authentication.controller";
import { UserAuthenticationService } from "./user-authentication.service";

const authService = new UserAuthenticationService();
const authController = new UserAuthenticationController(authService);

const routes: Router = Router();

routes.post("/login", asyncHandler(authController.login));
routes.post("/register", asyncHandler(authController.register));
routes.post("/logout", asyncHandler(authController.logout));
routes.post("/refresh", asyncHandler(authController.refreshToken));

export { routes as userAuthenticationRoutes };
