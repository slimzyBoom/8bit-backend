import Joi from "joi";
const updateUserSchema = Joi.object({
  display_name: Joi.string().alphanum().required(),
  bio: Joi.string(),
  nationality: Joi.string(),
});

export { updateUserSchema };
