import { database } from "@/database.js";
import type { Prisma } from "@prisma/client";

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

export function deleteUserProfile(userId: string) {
  return database.userProfile.delete({ where: { id: userId } });
}
export function listUserProfiles() {
  return database.userProfile.findMany();
}
