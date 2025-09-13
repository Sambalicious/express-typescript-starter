import type { Factory } from "@/src/utils/types.js";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import type { UserProfile } from "@prisma/client";
export const createFakeUserProfile: Factory<UserProfile> = ({
  id = createId(),
  email = faker.internet.email(),
  name = faker.person.fullName(),
  updatedAt = faker.date.recent({ days: 10 }),
  createdAt = faker.date.past({ years: 2, refDate: updatedAt }),
  hashedPassword = faker.internet.password(),
} = {}) => ({
  id,
  email,
  name,
  updatedAt,
  createdAt,
  hashedPassword,
});
