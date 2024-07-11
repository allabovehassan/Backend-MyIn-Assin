const Joi = require("joi");

function validateOrder(body) {
  const schema = Joi.object().keys({
    products: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().required(),
          quantity: Joi.number().min(1).required()
        })
      )
      .required(),
    totalAmount: Joi.number().min(0).required()
  });
  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return {
      error
    };
  }
  return {
    value
  };
}

function validateOrderStatus(body) {
  const schema = Joi.object().keys({
    status: Joi.string()
      .valid(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "paid"
      )
      .required()
  });

  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return {
      error
    };
  }
  return {
    value
  };
}

module.exports = {
  validateOrder,
  validateOrderStatus
};
