import { requireAuthentication } from "@/src/middleware/require-authentication.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/src/middleware/validate.js";
import { removeUndefinedFields } from "@/src/utils/removeUndefinedValues.js";
import type { Request, Response } from "express";
import { MESSAGES } from "./user-profile.constant.js";
import { userProfileRepository } from "./user-profile.repository.js";
import {
  ProfileListSchema,
  ProfileParamsSchema,
  UpdateProfileSchema,
} from "./user-profile.schema.js";

export async function getUserProfiles(request: Request, response: Response) {
  requireAuthentication(request, response);

  const query = await validateQuery(ProfileListSchema, request, response);

  const profiles = await userProfileRepository.findAll(query);

  return response
    .status(200)
    .json({ message: MESSAGES.USER_PROFILES_RETRIEVED, profiles });
}

export async function getUserProfile(req: Request, res: Response) {
  requireAuthentication(req, res);

  const params = await validateParams(ProfileParamsSchema, req, res);

  const user = await userProfileRepository.findById(params.id);

  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_PROFILE_NOT_FOUND });
  }

  return res
    .status(200)
    .json({ message: MESSAGES.USER_PROFILE_RETRIEVED, profile: user });
}

export async function updateProfile(req: Request, res: Response) {
  requireAuthentication(req, res);
  const params = await validateParams(ProfileParamsSchema, req, res);
  const body = await validateBody(UpdateProfileSchema, req, res);

  const user = await userProfileRepository.findById(params.id);

  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_PROFILE_NOT_FOUND });
  }

  const payload = removeUndefinedFields(body);

  const updatedUser = await userProfileRepository.update(params.id, payload);

  return res
    .status(200)
    .json({ message: MESSAGES.USER_PROFILE_UPDATED, profile: updatedUser });
}

export async function deleteProfile(req: Request, res: Response) {
  requireAuthentication(req, res);
  const params = await validateParams(ProfileParamsSchema, req, res);

  const user = await userProfileRepository.findById(params.id);

  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_PROFILE_NOT_FOUND });
  }

  await userProfileRepository.delete(params.id);
  return res.status(200).json({ message: MESSAGES.USER_PROFILE_DELETED });
}
