const { Payment } = require("./paymentModel.js");
const { Order } = require("../order/orderModel.js");
const messages = require("../../utils/messages.js");
const {
  validatePayment
} = require("./paymentValidation.js");
const axios = require("axios");
require("dotenv").config();

async function payment(req, res) {
  try {
    const { value, error } = validatePayment(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error.details
      });
    }

    const { orderId, paymentMethod, amount } = value;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
        data: null
      });
    }

    let paymentStatus;
    let transactionId;

    if (paymentMethod === "stripe") {
      const stripeResponse = await axios.post(
        process.env.STRIPE_API_URL,
        {
          amount,
          currency: "usd",
          source: "tok_visa" // Replace with Stripe.js or Elements tokenization
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_API_KEY}`
          }
        }
      );
      paymentStatus = stripeResponse.data.status;
      transactionId = stripeResponse.data.id;
    } else if (paymentMethod === "paypal") {
      const paypalResponse = await axios.post(
        process.env.PAYPAL_API_URL,
        {
          intent: "sale",
          payer: { payment_method: "paypal" },
          transactions: [
            {
              amount: {
                total: (amount / 100).toFixed(2),
                currency: "USD"
              }
            }
          ],
          redirect_urls: {
            return_url: "https://example.com/return",
            cancel_url: "https://example.com/cancel"
          }
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
            ).toString("base64")}`
          }
        }
      );
      paymentStatus = paypalResponse.data.state;
      transactionId = paypalResponse.data.id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported payment method",
        data: null
      });
    }

    if (
      paymentStatus !== "succeeded" &&
      paymentStatus !== "approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
        data: null
      });
    }

    const newPayment = new Payment({
      order: orderId,
      user: req.user.id,
      amount,
      paymentMethod,
      status: "completed", // In a real-world scenario, you would handle payment gateway response
      transactionId: transactionId
    });

    const savedPayment = await newPayment.save();

    order.status = "paid";
    await order.save();

    return res.status(201).send({
      success: true,
      message: "Payment completed successfully",
      data: savedPayment
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

async function paymentDetails(req, res) {
  try {
    const payment = await Payment.findById(
      req.params.id
    )
      .populate("order")
      .populate("user", "username email");
    if (!payment)
      return res.status(404).send({
        success: false,
        message: "Payment not found",
        data: null
      });

    if (
      payment.user._id.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: "Records Fetched Sucess",
      data: payment
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: JSON.stringify(error)
    });
  }
}

module.exports = { payment, paymentDetails };
