import Joi from "joi";

const register_schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  email: Joi.string().email().required(),
});

const login_schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const forgot_password_schema = Joi.object({
  email: Joi.string().email().required(),
});

export { register_schema, login_schema, forgot_password_schema };
