import { validateBody } from "@/src/middleware/validate.js";
import type { Request, Response } from "express";
import {
  createUserProfile,
  getUserProfileByEmail,
} from "../user-profile/user-profile.models.js";
import { MESSAGES } from "./user-authentication.constant.js";
import {
  clearJwtCookie,
  clearRefreshTokenCookie,
  generateJwtToken,
  generateRefreshToken,
  getRefreshTokenFromCookie,
  hashPassword,
  isPasswordValid,
  setJwtCookie,
  setRefreshTokenCookie,
} from "./user-authentication.helpers.js";
import { LoginSchema, RegisterSchema } from "./user-authentication.schema.js";

export async function login(req: Request, res: Response) {
  const body = await validateBody(LoginSchema, req, res);

  const user = await getUserProfileByEmail(body.email);
  if (!user) {
    return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
  }

  const isValidPassword = await isPasswordValid(
    body.password,
    user.hashedPassword
  );

  if (!isValidPassword) {
    return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
  }
  const token = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user);
  setJwtCookie(res, token);
  setRefreshTokenCookie(res, refreshToken);
  return res.status(200).json({ message: MESSAGES.LOGIN_SUCCESS });
}

export async function register(req: Request, res: Response) {
  const body = await validateBody(RegisterSchema, req, res);

  const existingUser = await getUserProfileByEmail(body.email);
  if (existingUser) {
    return res.status(409).json({ message: MESSAGES.ALREADY_IN_USE });
  }

  const hashedPassword = await hashPassword(body.password);

  const userProfile = await createUserProfile({
    email: body.email,
    hashedPassword,
    name: body.name,
  });

  const token = generateJwtToken(userProfile);
  const refreshToken = generateRefreshToken(userProfile);
  setJwtCookie(res, token);
  setRefreshTokenCookie(res, refreshToken);

  return res
    .status(201)
    .json({ message: MESSAGES.REGISTRATION_SUCCESS, userId: userProfile.id });
}

export async function logout(_req: Request, res: Response) {
  clearJwtCookie(res);
  clearRefreshTokenCookie(res);
  return res.status(200).json({ message: MESSAGES.LOG_OUT_SUCCESS });
}

interface RefreshTokenPayload {
  id: string;
  email: string;
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const user = getRefreshTokenFromCookie(req) as RefreshTokenPayload;

    // Check if user still exists or is active
    const existingUser = await getUserProfileByEmail(user.email);
    if (!existingUser) {
      return res.status(401).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
    const payload = { id: existingUser.id, email: existingUser.email };
    const accessToken = generateJwtToken(payload);
    setJwtCookie(res, accessToken);
    return res.status(200).json({ message: MESSAGES.ACCESS_TOKEN_REFRESHED });
  } catch (error) {
    return res.status(401).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
  }
}
