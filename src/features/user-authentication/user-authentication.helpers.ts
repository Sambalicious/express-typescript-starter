import type { UserProfile } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

export function generateRefreshToken(userProfile: UserProfile) {
  const tokenPayload: TokenPayload = {
    id: userProfile.id,
    email: userProfile.email,
  };
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not set");
  }
  return jwt.sign(tokenPayload, refreshTokenSecret, {
    expiresIn: "7d", // 7 days
    algorithm: "HS256",
  });
}

export function setRefreshTokenCookie(response: Response, token: string) {
  response.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearRefreshTokenCookie(response: Response) {
  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export function getRefreshTokenFromCookie(request: Request) {
  const token = request.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!token) {
    throw new Error("Refresh token missing");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      { algorithms: ["HS256"] }
    );
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
  if (isTokenValid(decodedToken)) {
    return decodedToken;
  }
  throw new Error("Invalid or expired refresh token");
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10); // Placeholder for actual hashing logic
}

export async function isPasswordValid(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export type TokenPayload = {
  id: string;
  email: string;
};

export function generateJwtToken(
  userProfile: Pick<UserProfile, "id" | "email">
) {
  const tokenPayload: TokenPayload = {
    id: userProfile.id,
    email: userProfile.email,
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // 1 hour
    algorithm: "HS256",
  });
}

export const JWT_COOKIE_NAME = "jwt";

export function setJwtCookie(response: Response, token: string) {
  response.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60, // 1 hour
    path: "/",
  });
}

export function clearJwtCookie(response: Response) {
  response.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

const isTokenValid = (
  token: jwt.JwtPayload | string
): token is TokenPayload => {
  if (
    typeof token === "object" &&
    token !== null &&
    "id" in token &&
    "email" in token
  ) {
    return true;
  }

  return false;
};

export function getJwtTokenFromCookie(request: Request) {
  const token = request.cookies[JWT_COOKIE_NAME];

  if (!token) {
    throw new Error("JWT token not found in cookies");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    throw new Error("JWT verification failed");
  }

  if (isTokenValid(decodedToken)) {
    return decodedToken;
  }

  throw new Error("Invalid JWT token payload");
}
