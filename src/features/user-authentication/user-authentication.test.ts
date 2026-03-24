import { buildApp } from "@/src/app";
import { UserProfileRepository } from "@/src/features/user-profile/user-profile.repository";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, onTestFinished, test } from "vitest";
import { MESSAGES } from "./user-authentication.constant";
import { createFakeUserProfile } from "./user-authentication.factories";
import { hashPassword } from "./user-authentication.helpers";
interface SetUp {
  password: string;
}
async function setUp({ password }: SetUp) {
  const app = buildApp();
  const userProfileRepository = new UserProfileRepository();
  const savedUser = await userProfileRepository.create(
    createFakeUserProfile({
      hashedPassword: await hashPassword(password),
    })
  );

  onTestFinished(async () => {
    await userProfileRepository.delete(savedUser.id);
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
        email: faker.internet.email(),
        password: "password123",
        name: faker.person.fullName(),
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
