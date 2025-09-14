import { Router } from "express";
import { healthCheckRoutes } from "./features/health-check/health-check.routes.js";
import { userAuthenticationRoutes } from "./features/user-authentication/user-authentication.routes.js";

export const apiV1Router: Router = Router();

apiV1Router.use("/health-check", healthCheckRoutes);
apiV1Router.use(userAuthenticationRoutes);
