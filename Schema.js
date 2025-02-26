const Joi = require("joi");

module.exports.userValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  googleId: Joi.string().optional(),
  role: Joi.string().valid("faculty", "student", "alumni").default("student"),
  image: Joi.string().optional(),
});


