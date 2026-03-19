import { buildApp } from "@/src/app.js";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, test } from "vitest";
import { userProfileRepository } from "../user-profile/user-profile.repository.ts";
import { MESSAGES } from "./user-authentication.constant.js";
import { createFakeUserProfile } from "./user-authentication.factories.js";
import {
  generateRefreshToken,
  JWT_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "./user-authentication.helpers.js";

describe("/refresh", () => {
  test("should issue a new access token when given a valid refresh token cookie", async () => {
    const app = buildApp();
    const user = createFakeUserProfile();
    await userProfileRepository.create(user);
    const refreshToken = generateRefreshToken(user);
    const res = await request(app)
      .post("/api/v1/refresh")
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])
      .expect(200);
    expect(res.body.message).toBe(MESSAGES.ACCESS_TOKEN_REFRESHED);
    const setCookieHeader = res.headers["set-cookie"];
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];
    expect(
      cookies.some(
        (cookie) => cookie && cookie.startsWith(`${JWT_COOKIE_NAME}=`)
      )
    ).toBe(true);
  });

  test("should fail with 401 if refresh token is missing", async () => {
    const app = buildApp();
    const res = await request(app).post("/api/v1/refresh").expect(401);
    expect(res.body.message).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  test("should fail with 401 if refresh token is expired", async () => {
    const app = buildApp();
    const user = createFakeUserProfile();
    await userProfileRepository.create(user);
    // Create an expired token
    const expiredToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: -1, // expired
        algorithm: "HS256",
      }
    );
    const res = await request(app)
      .post("/api/v1/refresh")
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${expiredToken}`])
      .expect(401);
    expect(res.body.message).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  test("should fail with 401 if refresh token is tampered", async () => {
    const app = buildApp();
    const user = createFakeUserProfile();
    await userProfileRepository.create(user);
    const refreshToken = generateRefreshToken(user) + "tampered";
    const res = await request(app)
      .post("/api/v1/refresh")
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])
      .expect(401);
    expect(res.body.message).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });

  test("should fail with 401 if refresh token is valid but user does not exist", async () => {
    const app = buildApp();
    const user = createFakeUserProfile();
    // Do NOT create user in DB
    const refreshToken = generateRefreshToken(user);
    const res = await request(app)
      .post("/api/v1/refresh")
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])
      .expect(401);
    expect(res.body.message).toBe(MESSAGES.INVALID_REFRESH_TOKEN);
  });
});
