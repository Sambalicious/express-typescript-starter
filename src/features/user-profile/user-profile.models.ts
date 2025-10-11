import { database } from "@/database.js";
import type { Prisma } from "@prisma/client";
import type { ProfileListSchemaType } from "./user-profile.schema.js";

export function createUserProfile(profile: Prisma.UserProfileCreateInput) {
  return database.userProfile.create({ data: profile });
}

export function getUserProfileByUserId(userId: string) {
  return database.userProfile.findUnique({ where: { id: userId } });
}

export function getUserProfileByEmail(email: string) {
  return database.userProfile.findUnique({ where: { email } });
}

export function updateUserProfile(
  userId: string,
  updates: Omit<Prisma.UserProfileUpdateInput, "createdAt">
) {
  return database.userProfile.update({
    where: { id: userId },
    data: updates,
  });
}

export function deleteUserProfile(id: string) {
  return database.userProfile.delete({ where: { id } });
}
export async function listUserProfiles({
  page,
  pageSize,
}: ProfileListSchemaType) {
  return database.userProfile.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
}
