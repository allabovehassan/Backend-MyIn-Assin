const express = require("express");
const orderController = require("./orderController.js");
const {
  authorise
} = require("../../middleware/authorization.js");

const orderRouter = express.Router();

/**
 * @api {post} /
 * @apiName create Order
 * @apiDescription  user can create order
 * @apiPermission User
 * @apiParam { String } product Need to pass (Required)
 * @apiParam { String } qunatity Need to pass (Required)
 * @apiSuccess { Object} data of created order
 */
orderRouter.post("/", orderController.createOrder);

/**
 * @api {get} /
 * @apiName get Order
 * @apiDescription  user can get order
 * @apiPermission User , Admin
 * @apiSuccess { Object} data of created order
 */
orderRouter.get(
  "/",
  authorise(true),
  orderController.getOrders
);

/**
 * @api {get} /:id
 * @apiName getSingleOrder
 * @apiDescription  Get a specific order by ID
 * @apiPermission User
 * @apiParam { String } order id to pass (Required)
 * @apiSuccess { Object} data of created order
 */
orderRouter.get(
  "/:id",
  orderController.getSingleOrder
);

/**
 * @api {put} /:id
 * @apiName updateOrder
 * @apiDescription  Update order status (admin route)
 * @apiPermission User, Admin
 * @apiParam { String } order id to pass (Required)
 * @apiSuccess { Object} data of created order
 */
orderRouter.put(
  "/:id",
  authorise(true),
  orderController.updateOrder
);

/**
 * @api {delete} /:id
 * @apiName deleteOrder
 * @apiDescription  Delete an order
 * @apiPermission User
 * @apiParam { String } order id to pass (Required)
 * @apiSuccess { Object} data of created order
 */
orderRouter.delete(
  "/:id",
  orderController.deleteOrder
);

module.exports = { orderRouter };
