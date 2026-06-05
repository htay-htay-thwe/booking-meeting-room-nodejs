const request = require("supertest");
const app = require("../index");

async function login(name, password) {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ name, password });
  return response.body.token;
}

describe("bookings", () => {
  beforeEach(async () => {
    process.env.NODE_ENV = "test";
    await request(app).post("/api/test/reset");
  });

  it("prevents overlapping bookings", async () => {
    const token = await login("user", "user123");
    const first = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startTime: "2026-06-05T10:00:00.000Z",
        endTime: "2026-06-05T11:00:00.000Z"
      });

    expect(first.status).toBe(201);

    const overlap = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startTime: "2026-06-05T10:30:00.000Z",
        endTime: "2026-06-05T11:30:00.000Z"
      });

    expect(overlap.status).toBe(409);
  });

  it("allows back-to-back bookings", async () => {
    const token = await login("user", "user123");
    const first = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startTime: "2026-06-05T12:00:00.000Z",
        endTime: "2026-06-05T13:00:00.000Z"
      });

    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startTime: "2026-06-05T13:00:00.000Z",
        endTime: "2026-06-05T14:00:00.000Z"
      });

    expect(second.status).toBe(201);
  });

  it("blocks deleting other users' bookings", async () => {
    const userToken = await login("user", "user123");

    await request(app)
      .post("/api/auth/register")
      .send({ name: "user2", password: "pass456" });
    const otherToken = await login("user2", "pass456");

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        startTime: "2026-06-05T15:00:00.000Z",
        endTime: "2026-06-05T16:00:00.000Z"
      });

    const denied = await request(app)
      .delete(`/api/bookings/${booking.body.id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(denied.status).toBe(403);
  });
});
