import { database } from "@/database.js";
import type { Prisma, UserProfile } from "@prisma/client";
import type { ProfileListSchemaType } from "./user-profile.schema.js";

export interface UserProfileRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  create(data: Prisma.UserProfileCreateInput): Promise<UserProfile>;
  update(
    id: string,
    data: Omit<Prisma.UserProfileUpdateInput, "createdAt">
  ): Promise<UserProfile>;
  delete(id: string): Promise<UserProfile>;
  findAll(options: ProfileListSchemaType): Promise<UserProfile[]>;
}

class UserProfileRepositoryImpl implements UserProfileRepository {
  findById(id: string) {
    return database.userProfile.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return database.userProfile.findUnique({ where: { email } });
  }

  create(data: Prisma.UserProfileCreateInput) {
    return database.userProfile.create({ data });
  }

  update(id: string, data: Omit<Prisma.UserProfileUpdateInput, "createdAt">) {
    return database.userProfile.update({ where: { id }, data });
  }

  delete(id: string) {
    return database.userProfile.delete({ where: { id } });
  }

  findAll({ page, pageSize }: ProfileListSchemaType) {
    return database.userProfile.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  }
}

export const userProfileRepository = new UserProfileRepositoryImpl();
