const Joi = require("joi");

function validateProduct(body) {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string()
      .trim()
      .allow("")
      .optional(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().allow("").optional(),
    stock: Joi.number().min(0).required()
  });
  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return { error };
  }
  return { value };
}

function validateUpdateProduct(body) {
  const schema = Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string()
      .trim()
      .allow("")
      .optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().trim().allow("").optional(),
    stock: Joi.number().min(0).optional()
  }).min(1); // Ensure at least one field is provided for update
  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return { error };
  }
  return { value };
}

module.exports = {
  validateProduct,
  validateUpdateProduct
};
