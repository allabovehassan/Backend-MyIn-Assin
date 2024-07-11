import { expect } from "chai";
import { Product } from "../models/productModel";
import request from "supertest";
import app from "../index.js";

describe("Product API", () => {
  let token; // Add a token if your routes are protected

  before(async () => {
    // Add setup code here, such as creating a user and obtaining a JWT token
  });

  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 100,
        category: "Electronics",
        stock: 10
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property(
      "name",
      "Test Product"
    );
  });

  it("should fetch all products", async () => {
    const res = await request(app).get("/api/product");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should fetch a single product by ID", async () => {
    const product = await Product.create({
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      category: "Electronics",
      stock: 10
    });

    const res = await request(app).get(
      `/api/product/${product._id}`
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "_id",
      product._id.toString()
    );
  });

  it("should update a product", async () => {
    const product = await Product.create({
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      category: "Electronics",
      stock: 10
    });

    const res = await request(app)
      .put(`/api/product/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Product",
        price: 150
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "name",
      "Updated Product"
    );
    expect(res.body).to.have.property("price", 150);
  });

  it("should delete a product", async () => {
    const product = await Product.create({
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      category: "Electronics",
      stock: 10
    });

    const res = await request(app)
      .delete(`/api/product/${product._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "message",
      "Product deleted successfully"
    );
  });
});
