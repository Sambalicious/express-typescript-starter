import { buildApp } from "@/src/app.js";
import request from "supertest";
import { describe, expect, onTestFinished, test } from "vitest";
import {
  createUserProfile,
  deleteUserProfile,
} from "../user-profile/user-profile.models.js";
import { MESSAGES } from "./user-authentication.constant.js";
import { createFakeUserProfile } from "./user-authentication.factories.js";
import { hashPassword } from "./user-authentication.helpers.js";
interface SetUp {
  password: string;
}
async function setUp({ password }: SetUp) {
  const app = buildApp();
  const savedUser = await createUserProfile(
    createFakeUserProfile({
      hashedPassword: await hashPassword(password),
    })
  );

  onTestFinished(async () => {
    await deleteUserProfile(savedUser.id);
  });

  return { app, savedUser };
}

describe("/api/v1/login", async () => {
  test("should login successfully with valid credentials", async () => {
    const { app, savedUser } = await setUp({ password: "password123" });

    const actual = await request(app)
      .post("/api/v1/login")
      .send({
        email: savedUser.email,
        password: "password123",
      })
      .expect(200);

    expect(actual.body).toEqual({ message: MESSAGES.LOGIN_SUCCESS });
  });
  test("should fail login with invalid credentials", async () => {
    const { app } = await setUp({ password: "password123" });

    const actual = await request(app)
      .post("/api/v1/login")
      .send({
        email: "test@test.com",
        password: "invalid_password",
      })
      .expect(401);

    expect(actual.body).toEqual({ message: MESSAGES.INVALID_CREDENTIALS });
  });

  test("should fail for valid user with wrong password", async () => {
    const { app, savedUser } = await setUp({ password: "password12345" });

    const actual = await request(app)
      .post("/api/v1/login")
      .send({
        email: savedUser.email,
        password: "wrong_password",
      })
      .expect(401);

    expect(actual.body).toEqual({ message: MESSAGES.INVALID_CREDENTIALS });
  });

  test("should fail when email and password is missing", async () => {
    const app = buildApp();
    const actual = await request(app)
      .post("/api/v1/login")
      .send({})
      .expect(400);

    expect(actual.body).toEqual({
      message: "Bad Request",
      errors: [
        {
          code: "invalid_type",
          expected: "string",
          message: "Invalid input: expected string, received undefined",
          path: ["email"],
        },
        {
          code: "invalid_type",
          expected: "string",
          message: "Invalid input: expected string, received undefined",
          path: ["password"],
        },
      ],
    });
  });

  test("should expect cookie to be set on successful login", async () => {
    const { app, savedUser } = await setUp({ password: "password123" });

    const actual = await request(app)
      .post("/api/v1/login")
      .send({
        email: savedUser.email,
        password: "password123",
      })
      .expect(200);

    const cookies = actual.headers["set-cookie"] as unknown as string[];
    expect(cookies).toBeDefined();
    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
    expect(jwtCookie).toBeDefined();
  });
});

describe("/api/v1/register", () => {
  test("should register a user successfully", async () => {
    const app = buildApp();
    const actual = await request(app)
      .post("/api/v1/register")
      .send({
        email: "test3@test.com",
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    expect(actual.body).toEqual({
      message: MESSAGES.REGISTRATION_SUCCESS,
      userId: actual.body.userId,
    });
  });

  test("should fail when email is already in use", async () => {
    const { app, savedUser } = await setUp({ password: "password12345" });

    const actual = await request(app)
      .post("/api/v1/register")
      .send({
        email: savedUser.email,
        password: "password123",
        name: "Test User",
      })
      .expect(409);

    expect(actual.body).toEqual({ message: MESSAGES.ALREADY_IN_USE });
  });
});

describe("/api/v1/logout", () => {
  test("should logout successfully", async () => {
    const app = buildApp();
    const actual = await request(app).post("/api/v1/logout").expect(200);

    expect(actual.body).toEqual({ message: MESSAGES.LOG_OUT_SUCCESS });
  });
});
