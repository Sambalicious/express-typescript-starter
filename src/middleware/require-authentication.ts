import type { Request, Response } from "express";
import { getJwtTokenFromCookie } from "../features/user-authentication/user-authentication.helpers";

export function requireAuthentication(request: Request, res: Response) {
  try {
    const jwt = getJwtTokenFromCookie(request);
    return jwt;
  } catch (error) {
    throw res.status(401).json({ message: "Authentication required" });
  }
}
