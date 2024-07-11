const Joi = require("joi");

function validateSignup(body) {
  const schema = Joi.object().keys({
    username: Joi.string()
      .replace(/  +/g, " ")
      .trim()
      .required(),
    name: Joi.string()
      .replace(/  +/g, " ")
      .trim()
      .required(),
    address: Joi.string().trim().optional(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
    phone: Joi.string().trim().optional()
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

function validateLogin(body) {
  const schema = Joi.object().keys({
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required()
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

module.exports = { validateSignup, validateLogin };
