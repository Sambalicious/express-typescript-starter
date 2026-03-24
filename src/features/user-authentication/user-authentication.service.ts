import { IUserProfileRepository } from "@/src/features/user-profile/user-profile.repository";
import type { z } from "zod";
import { MESSAGES } from "./user-authentication.constant";
import { hashPassword, isPasswordValid } from "./user-authentication.helpers";
import { LoginSchema, RegisterSchema } from "./user-authentication.schema";

type LoginSchemaType = z.infer<typeof LoginSchema>;
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export class UserAuthenticationService {
  constructor(private userRepository : IUserProfileRepository) {
    
  }
  async login(body: LoginSchemaType) {
    const user = await this.userRepository.findByEmail(body.email);
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
    const existingUser = await this.userRepository.findByEmail(body.email);
    if (existingUser) {
      throw new Error(MESSAGES.ALREADY_IN_USE);
    }
    const hashedPassword = await hashPassword(body.password);
    return this.userRepository.create({
      email: body.email,
      hashedPassword,
      name: body.name,
    });
  }

  async refreshToken(user: { email: string }) {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (!existingUser) {
      throw new Error(MESSAGES.INVALID_REFRESH_TOKEN);
    }
    return existingUser;
  }
}
