const express = require("express");
const orderController = require("./orderController.js");
const {
  authorise
} = require("../../middleware/authorization.js");

const orderRouter = express.Router();

//creation order route
orderRouter.post("/", orderController.createOrder);

// Get all orders (admin route)
orderRouter.get(
  "/",
  authorise(true),
  orderController.getOrders
);

// Get a specific order by ID (protected route)
orderRouter.get(
  "/:id",
  orderController.getSingleOrder
);

// Update order status (admin route)
orderRouter.put(
  "/:id",
  authorise(true),
  orderController.updateOrder
);

// Delete an order (protected route)
orderRouter.delete(
  "/:id",
  orderController.deleteOrder
);

module.exports = { orderRouter };
// export { orderRouter };
