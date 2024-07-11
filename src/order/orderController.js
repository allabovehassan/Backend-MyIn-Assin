const { Order } = require("./orderModel.js");
const {
  Product
} = require("../product/productModel.js");
const messages = require("../../utils/messages.js");
const {
  validateOrder,
  validateOrderStatus
} = require("./orderValidation.js");
const { default: mongoose } = require("mongoose");


// Create an Order
async function createOrder(req, res) {
  try {
    const { value, error } = validateOrder(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error
      });
    }
    console.log(3);

    const { products, totalAmount } = value;

    // Convert product names to ObjectIds
    const productObjects = [];
    for (let item of products) {
      const product = await Product.findOne({
        name: item.product
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
          data: null
        });
      }
      productObjects.push({
        product: product._id,
        quantity: item.quantity
      });
    }

    const newOrder = new Order({
      user: new mongoose.Types.ObjectId(req.user.id),
      products: productObjects,
      totalAmount: totalAmount
    });
    console.log(4);
    if (newOrder && newOrder.products) {
      console.log(5);
      await newOrder.save();
      return res.status(201).send({
        success: true,
        message: messages.ORDER_CREATED_SUCESSFULLY,
        data: {
          order: newOrder
        }
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}


// Get all Orders
async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product");

    if (!orders || orders.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No orders found",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: messages.RECORDS_FETCHED_SUCCESS,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}


// Get  Single order 
async function getSingleOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("products.product");

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
        data: null
      });
    }

    if (
      order.user._id.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: messages.RECORD_FETCHED_SUCCESS,
      data: order
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}


// Update order status 
async function updateOrder(req, res) {
  try {
    const { value, error } = validateOrderStatus(
      req.body
    );

    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error.details
      });
    }

    const { status } = value;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: messages.RECORD_UPDATED_SUCCESS,
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}


// Delete an order 
async function deleteOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await Order.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder
};

