import { validateBody } from "@/src/middleware/validate.js";
import type { Request, Response } from "express";
import z from "zod";
import { getUserProfileByEmail } from "../user-profile/user-profile.models.js";
import {
  generateJwtToken,
  isPasswordValid,
  setJwtCookie,
} from "./user-authentication.helpers.js";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export async function login(req: Request, res: Response) {
  const body = await validateBody(LoginSchema, req, res);

  const user = await getUserProfileByEmail(body.email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await isPasswordValid(
    body.password,
    user.hashedPassword
  );

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = generateJwtToken(user);

  setJwtCookie(res, token);
  return res.status(200).json({ message: "Login successful" });
}
