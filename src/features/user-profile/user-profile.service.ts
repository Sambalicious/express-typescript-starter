import { removeUndefinedFields } from "@/src/utils/removeUndefinedValues";
import { MESSAGES } from "./user-profile.constant";
import { userProfileRepository } from "./user-profile.repository";
import type { ProfileListSchemaType } from "./user-profile.schema";

export class UserProfileService {
  async findAll(query: ProfileListSchemaType) {
    return userProfileRepository.findAll(query);
  }

  async findById(id: string) {
    const user = await userProfileRepository.findById(id);
    if (!user) throw new Error(MESSAGES.USER_PROFILE_NOT_FOUND);
    return user;
  }

  async update(id: string, body: any) {
    const user = await userProfileRepository.findById(id);
    if (!user) throw new Error(MESSAGES.USER_PROFILE_NOT_FOUND);
    const payload = removeUndefinedFields(body);
    return userProfileRepository.update(id, payload);
  }

  async delete(id: string) {
    const user = await userProfileRepository.findById(id);
    if (!user) throw new Error(MESSAGES.USER_PROFILE_NOT_FOUND);
    await userProfileRepository.delete(id);
  }
}