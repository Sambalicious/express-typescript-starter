import { buildApp } from "@/src/app.js";
import { onTestFinished } from "vitest";
import { createFakeUserProfile } from "../user-authentication/user-authentication.factories.js";
import { generateJwtToken } from "../user-authentication/user-authentication.helpers.js";
import {
  createUserProfile,
  deleteUserProfile,
} from "../user-profile/user-profile.models.js";

export async function setUp(numberOfProfiles: number) {
  const app = buildApp();

  const profiles = await Promise.all(
    Array.from({ length: numberOfProfiles }, () =>
      createUserProfile(createFakeUserProfile())
    )
  );

  const authenticatedUser = createFakeUserProfile();

  await createUserProfile(authenticatedUser);

  const token = generateJwtToken(authenticatedUser);

  onTestFinished(async () => {
    try {
      await Promise.all(
        profiles.map((profile) => deleteUserProfile(profile.id))
      );
      await deleteUserProfile(authenticatedUser.id);
    } catch (error) {}
  });

  return {
    app,
    token,
    profiles: profiles.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    ),
  };
}
