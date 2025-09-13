import { asyncHandler } from "@/src/utils/asyncHandler.js";
import { Router } from "express";
import { login } from "./user-authentication.controller.js";

const userAuthenticationRoutes: Router = Router();

userAuthenticationRoutes.post("/login", asyncHandler(login));

export { userAuthenticationRoutes };
