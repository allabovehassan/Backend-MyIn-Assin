import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

describe("Order API", () => {
  let token; // Add a token if your routes are protected

  before(async () => {
    // Add setup code here, such as creating a user and obtaining a JWT token
  });

  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/order")
      .set("Authorization", `Bearer ${token}`)
      .send({
        products: [
          {
            product: "60d0fe4f5311236168a109ca",
            quantity: 2
          }
        ],
        totalAmount: 100
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("products");
  });

  it("should fetch all orders", async () => {
    const res = await request(app)
      .get("/api/order")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should fetch a single order by ID", async () => {
    const order = await Order.create({
      user: "60d0fe4f5311236168a109ca",
      products: [
        {
          product: "60d0fe4f5311236168a109ca",
          quantity: 1
        }
      ],
      totalAmount: 50
    });

    const res = await request(app)
      .get(`/api/order/${order._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "_id",
      order._id.toString()
    );
  });

  it("should update an order status", async () => {
    const order = await Order.create({
      user: "60d0fe4f5311236168a109ca",
      products: [
        {
          product: "60d0fe4f5311236168a109ca",
          quantity: 1
        }
      ],
      totalAmount: 50
    });

    const res = await request(app)
      .put(`/api/order/${order._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "status",
      "completed"
    );
  });

  it("should delete an order", async () => {
    const order = await Order.create({
      user: "60d0fe4f5311236168a109ca",
      products: [
        {
          product: "60d0fe4f5311236168a109ca",
          quantity: 1
        }
      ],
      totalAmount: 50
    });

    const res = await request(app)
      .delete(`/api/order/${order._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Order deleted successfully"
    );
  });
});
