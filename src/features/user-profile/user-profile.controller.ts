
import { requireAuthentication } from "@/src/middleware/require-authentication.js";
import { validateBody, validateParams, validateQuery } from "@/src/middleware/validate.js";
import type { Request, Response } from "express";
import { MESSAGES } from "./user-profile.constant.js";
import { ProfileListSchema, ProfileParamsSchema, UpdateProfileSchema } from "./user-profile.schema.js";
import { UserProfileService } from "./user-profile.service.js";

export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {
    this.getUserProfiles = this.getUserProfiles.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  async getUserProfiles(req: Request, res: Response) {
    requireAuthentication(req, res);
    try {
      const query = await validateQuery(ProfileListSchema, req, res);
      const profiles = await this.userProfileService.findAll(query);
      return res.status(200).json({ message: MESSAGES.USER_PROFILES_RETRIEVED, profiles });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    requireAuthentication(req, res);
    try {
      const params = await validateParams(ProfileParamsSchema, req, res);
      const user = await this.userProfileService.findById(params.id);
      return res.status(200).json({ message: MESSAGES.USER_PROFILE_RETRIEVED, profile: user });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    requireAuthentication(req, res);
    try {
      const params = await validateParams(ProfileParamsSchema, req, res);
      const body = await validateBody(UpdateProfileSchema, req, res);
      const updatedUser = await this.userProfileService.update(params.id, body);
      return res.status(200).json({ message: MESSAGES.USER_PROFILE_UPDATED, profile: updatedUser });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async deleteProfile(req: Request, res: Response) {
    requireAuthentication(req, res);
    try {
      const params = await validateParams(ProfileParamsSchema, req, res);
      await this.userProfileService.delete(params.id);
      return res.status(200).json({ message: MESSAGES.USER_PROFILE_DELETED });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
