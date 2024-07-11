const Joi = require("joi");

const validatePayment = (body) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    amount: Joi.number().min(0).required()
  });

  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return { error };
  }
  return { value };
};

module.exports = { validatePayment };
