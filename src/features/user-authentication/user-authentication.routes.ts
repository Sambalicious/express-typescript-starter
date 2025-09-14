import { asyncHandler } from "@/src/utils/asyncHandler.js";
import { Router } from "express";
import { login, logout, register } from "./user-authentication.controller.js";

const routes: Router = Router();

routes.post("/login", asyncHandler(login));
routes.post("/register", asyncHandler(register));
routes.post("/logout", asyncHandler(logout));

export { routes as userAuthenticationRoutes };
