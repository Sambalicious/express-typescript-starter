import { database } from "@/database.js";
import { BaseRepository, type PaginatedResult } from "@/src/utils/baseRepository.js";
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
  findAll(options: ProfileListSchemaType): Promise<PaginatedResult<UserProfile>>;
}


class UserProfileRepositoryImpl extends BaseRepository<UserProfile, typeof database.userProfile> implements UserProfileRepository {
  constructor() {
    super(database.userProfile);
  }

  findById(id: string) {
    return this.model.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }

  create(data: Prisma.UserProfileCreateInput) {
    return this.model.create({ data });
  }

  update(id: string, data: Omit<Prisma.UserProfileUpdateInput, "createdAt">) {
    return this.model.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.model.delete({ where: { id } });
  }

  findAll(options: ProfileListSchemaType) {
    return this.findAllPaginated({
      page: options.page,
      pageSize: options.pageSize,
      orderBy: { createdAt: "desc" },
      // Add 'where' if you want to support filtering
    });
  }
}

export const userProfileRepository = new UserProfileRepositoryImpl();
