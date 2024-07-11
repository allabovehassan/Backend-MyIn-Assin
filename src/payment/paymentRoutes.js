const express = require("express");
const {
  payment,
  paymentDetails
} = require("./paymentController.js");
const {
  authorise
} = require("../../middleware/authorization.js");

const paymentRouter = express.Router();

//creation order route
paymentRouter.post("/", payment);

// Get all orders (admin route)
paymentRouter.get("/:id", paymentDetails);

module.exports = { paymentRouter };
