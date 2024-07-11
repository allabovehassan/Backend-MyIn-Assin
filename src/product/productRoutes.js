const express = require("express");
const productController = require("./productController.js");
const {
  authorise
} = require("../../middleware/authorization.js");


const productRouter = express.Router();

//creation order route
productRouter.post(
  "/",
  authorise(true),
  productController.createProduct
);

// Get all orders (admin route)
productRouter.get("/", productController.getProducts);

// Get a specific order by ID (protected route)
productRouter.get(
  "/:id",
  productController.getSingleProduct
);

// Update order status (admin route)
productRouter.put(
  "/:id",
  authorise(true),
  productController.updateProduct
);

// Delete an order (protected route)
productRouter.delete(
  "/:id",
  authorise(true),
  productController.deleteProduct
);

module.exports = { productRouter };


