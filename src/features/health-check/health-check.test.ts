import request from "supertest";
import { describe, expect, test } from "vitest";

import { buildApp } from "@/src/app";
describe("/api/v1/health-check", () => {
  test("should pass a basic test", async () => {
    // Placeholder test

    const app = buildApp();

    const actual = await request(app).get("/api/v1/health-check").expect(200);

    const expected = {
      status: "OK",
      timeStamp: expect.any(Number),
      uptime: expect.any(Number),
    };
    expect(actual.body).toEqual(expected);
  });
});
