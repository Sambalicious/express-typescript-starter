import { Router } from "express";
import { healthCheckRoutes } from "./features/health-check/health-check.routes";
import { userAuthenticationRoutes } from "./features/user-authentication/user-authentication.routes";
import { userProfileRoutes } from "./features/user-profile/user-profile.routes";

export const apiV1Router: Router = Router();

apiV1Router.use("/health-check", healthCheckRoutes);
apiV1Router.use(userAuthenticationRoutes);
apiV1Router.use("/profiles", userProfileRoutes);
