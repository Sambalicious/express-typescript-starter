import { buildApp } from "@/src/app.js";
import request from "supertest";
import { describe, expect, onTestFinished, test } from "vitest";
import { createFakeUserProfile } from "../user-authentication/user-authentication.factories.js";
import {
  generateJwtToken,
  JWT_COOKIE_NAME,
} from "../user-authentication/user-authentication.helpers.js";
import { MESSAGES } from "./user-profile.constant.js";
import { userProfileRepository } from "./user-profile.repository.js";
interface SetUpOptions {
  numberOfProfiles?: number;
}
async function setUp({ numberOfProfiles = 0 }: SetUpOptions) {
  const app = buildApp();

  const profiles = await Promise.all(
    Array.from({ length: numberOfProfiles }).map(() =>
      userProfileRepository.create(createFakeUserProfile())
    )
  );

  const authenticatedUser = createFakeUserProfile();
  await userProfileRepository.create(authenticatedUser);

  const token = generateJwtToken(authenticatedUser);

  console.log("Authenticated user created for tests:", authenticatedUser);

  const profileAndAuthenticatedUser = [...profiles, authenticatedUser];
  console.log({ profileAndAuthenticatedUser });
  onTestFinished(async () => {
    try {
      await Promise.all(
        profileAndAuthenticatedUser.map((profile) =>
          userProfileRepository.delete(profile.id)
        )
      );
    } catch (error) {}
  });

  return { app, profiles: profileAndAuthenticatedUser, token };
}

describe("/api/v1/profiles", () => {
  test("should retrieve user profiles when authenticated", async () => {
    const { app, token, profiles } = await setUp({ numberOfProfiles: 3 });

    const actual = await request(app)
      .get("/api/v1/profiles")
      .query({ page: 1, pageSize: 2 })
      .set("Cookie", [`${JWT_COOKIE_NAME}=${token}`])
      .expect(200);

    const expected = {
      message: MESSAGES.USER_PROFILES_RETRIEVED,
      profiles: profiles.map((profile) => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
        hashedPassword: profile.hashedPassword,
      })),
    };
    expect(actual.body.message).toBe(expected.message);
    // expect(actual.body.profiles).toHaveLength(profiles.length);
  });

  test("should fail to retrieve user profiles when not authenticated", async () => {
    const { app } = await setUp({ numberOfProfiles: 3 });

    const actual = await request(app).get("/api/v1/profiles").expect(401);

    const expected = { message: "Authentication required" };
    expect(actual.body).toEqual(expected);
  });

  test("should pass even if no params is sent and use defaults", async () => {
    const { app, token, profiles } = await setUp({ numberOfProfiles: 3 });

    const actual = await request(app)
      .get("/api/v1/profiles")
      .set("Cookie", [`${JWT_COOKIE_NAME}=${token}`])
      .expect(200);

    const expected = {
      message: MESSAGES.USER_PROFILES_RETRIEVED,
      profiles: profiles.map((profile) => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
        hashedPassword: profile.hashedPassword,
      })),
    };
    expect(actual.body.message).toBe(expected.message);
    // expect(actual.body.profiles).toHaveLength(profiles.length);
  });
});

describe("/api/v1/profiles/:id", () => {
  test("should retrieve a user profile when authenticated", async () => {
    const { app, token, profiles } = await setUp({ numberOfProfiles: 1 });

    const actual = await request(app)
      .get(`/api/v1/profiles/${profiles[0]?.id}`)
      .set("Cookie", [`${JWT_COOKIE_NAME}=${token}`])
      .expect(200);

    expect(actual.body.message).toBe(MESSAGES.USER_PROFILE_RETRIEVED);

    expect(actual.body).toEqual({
      message: MESSAGES.USER_PROFILE_RETRIEVED,
      profile: {
        id: profiles[0]?.id,
        email: profiles[0]?.email,
        name: profiles[0]?.name,
        createdAt: profiles[0]?.createdAt.toISOString(),
        updatedAt: profiles[0]?.updatedAt.toISOString(),
        hashedPassword: profiles[0]?.hashedPassword,
      },
    });
  });

  test("should delete a user profile when authenticated", async () => {
    const { app, token, profiles } = await setUp({ numberOfProfiles: 0 });

    console.log("Profiles created for deletion test:", profiles);
    const actual = await request(app)
      .delete(`/api/v1/profiles/${profiles[0]?.id}`)
      .set("Cookie", [`${JWT_COOKIE_NAME}=${token}`])
      .expect(200);

    expect(actual.body).toEqual({
      message: MESSAGES.USER_PROFILE_DELETED,
    });
  });

  test("should fail to retrieve a user profile when not authenticated", async () => {
    const { app, profiles } = await setUp({ numberOfProfiles: 1 });

    const actual = await request(app)
      .delete(`/api/v1/profiles/${profiles[0]?.id}`)
      .expect(401);

    expect(actual.status).toBe(401);
  });

  test("should fail if id param is missing", async () => {
    const { app, token } = await setUp({ numberOfProfiles: 0 });

    const actual = await request(app)
      .delete(`/api/v1/profiles/`)
      .set("Cookie", [`${JWT_COOKIE_NAME}=${token}`])
      .expect(404);

    expect(actual.status).toBe(404);
  });
});
