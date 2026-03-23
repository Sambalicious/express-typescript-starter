
import { validateBody } from "@/src/middleware/validate";
import type { Request, Response } from "express";
import { MESSAGES } from "./user-authentication.constant";
import {
  clearJwtCookie,
  clearRefreshTokenCookie,
  generateJwtToken,
  generateRefreshToken,
  getRefreshTokenFromCookie,
  setJwtCookie,
  setRefreshTokenCookie,
} from "./user-authentication.helpers";
import { LoginSchema, RegisterSchema } from "./user-authentication.schema";
import { UserAuthenticationService } from "./user-authentication.service";

/**
 * UserAuthenticationController Class
 * Handles HTTP requests and responses for authentication operations.
 * Acts as the bridge between routes and business logic (service layer).
 */
export class UserAuthenticationController {
  constructor(private authService: UserAuthenticationService) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  /**
   * Login Endpoint
   * POST /auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const body = await validateBody(LoginSchema, req, res);
      const user = await this.authService.login(body);
      const token = generateJwtToken(user);
      const refreshToken = generateRefreshToken(user);
      setJwtCookie(res, token);
      setRefreshTokenCookie(res, refreshToken);
      return res.status(200).json({ message: MESSAGES.LOGIN_SUCCESS });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || MESSAGES.INVALID_CREDENTIALS });
    }
  }

  /**
   * Register Endpoint
   * POST /auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const body = await validateBody(RegisterSchema, req, res);
      const userProfile = await this.authService.register(body);
      const token = generateJwtToken(userProfile);
      const refreshToken = generateRefreshToken(userProfile);
      setJwtCookie(res, token);
      setRefreshTokenCookie(res, refreshToken);
      return res.status(201).json({ message: MESSAGES.REGISTRATION_SUCCESS, userId: userProfile.id });
    } catch (error: any) {
      return res.status(409).json({ message: error.message || MESSAGES.ALREADY_IN_USE });
    }
  }

  /**
   * Logout Endpoint
   * POST /auth/logout
   */
  async logout(_req: Request, res: Response) {
    clearJwtCookie(res);
    clearRefreshTokenCookie(res);
    return res.status(200).json({ message: MESSAGES.LOG_OUT_SUCCESS });
  }

  /**
   * Refresh Token Endpoint
   * POST /auth/refresh-token
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const user = getRefreshTokenFromCookie(req) as { id: string; email: string };
      const existingUser = await this.authService.refreshToken(user);
      const payload = { id: existingUser.id, email: existingUser.email };
      const accessToken = generateJwtToken(payload);
      setJwtCookie(res, accessToken);
      return res.status(200).json({ message: MESSAGES.ACCESS_TOKEN_REFRESHED });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || MESSAGES.INVALID_REFRESH_TOKEN });
    }
  }
}
