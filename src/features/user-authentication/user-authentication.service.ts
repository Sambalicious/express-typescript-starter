import { userProfileRepository } from "../user-profile/user-profile.repository.js";
import { MESSAGES } from "./user-authentication.constant.js";
import { hashPassword, isPasswordValid } from "./user-authentication.helpers.js";
import { LoginSchema, RegisterSchema } from "./user-authentication.schema.js";
import type { z } from "zod";

type LoginSchemaType = z.infer<typeof LoginSchema>;
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export class UserAuthenticationService {
  async login(body: LoginSchemaType) {
    const user = await userProfileRepository.findByEmail(body.email);
    if (!user) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }
    const isValidPassword = await isPasswordValid(body.password, user.hashedPassword);
    if (!isValidPassword) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }
    return user;
  }

  async register(body: RegisterSchemaType) {
    const existingUser = await userProfileRepository.findByEmail(body.email);
    if (existingUser) {
      throw new Error(MESSAGES.ALREADY_IN_USE);
    }
    const hashedPassword = await hashPassword(body.password);
    return userProfileRepository.create({
      email: body.email,
      hashedPassword,
      name: body.name,
    });
  }

  async refreshToken(user: { email: string }) {
    const existingUser = await userProfileRepository.findByEmail(user.email);
    if (!existingUser) {
      throw new Error(MESSAGES.INVALID_REFRESH_TOKEN);
    }
    return existingUser;
  }
}
