import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

describe("User API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        name: "Test User"
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("token");
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("should fetch user profile", async () => {
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "email",
      "testuser@example.com"
    );
  });
});
