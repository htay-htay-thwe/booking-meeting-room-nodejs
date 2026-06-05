const request = require("supertest");
const app = require("../index");

describe("auth", () => {
  beforeEach(async () => {
    process.env.NODE_ENV = "test";
    await request(app).post("/api/test/reset");
  });

  it("registers a user and returns a token", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "newuser", password: "pass123" });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.role).toBe("user");
  });

  it("rejects invalid login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ name: "admin", password: "wrong" });

    expect(response.status).toBe(401);
  });
});
