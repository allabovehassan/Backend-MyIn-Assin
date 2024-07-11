import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { nock } from "./mockIntegration.js"; // Import the mock integration

describe("Payment API", () => {
  it("should process payment successfully", async () => {
    const res = await request(app)
      .post("/api/payment")
      .send({
        orderId: "60d9f9f9f9f9f9f9f9f9f9f9",
        paymentMethod: "credit_card",
        amount: 2000
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property(
      "status",
      "succeeded"
    );
  });
});

describe("Logistics API", () => {
  it("should get tracking information", async () => {
    const res = await request(app)
      .get("/api/logistics/track")
      .query({ trackingNumber: "1234567890" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "status",
      "in transit"
    );
  });
});

describe("Domain Registration API", () => {
  it("should register domain successfully", async () => {
    const res = await request(app)
      .post("/api/domain/register")
      .send({
        domain: "example.com"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "status",
      "registered"
    );
  });
});
