import Joi from "joi";

export const createUserValidator = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required().messages({
    "string.min": "Name length must be at least 2 characters long",
    "string.max": "Name length must be maximum 30 characters long",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is a required field",
  }),
  age: Joi.number().integer().min(0).max(150).messages({
    "number.min": "Age must be a positive number",
    "number.max": "Age must be less than or equal to 150",
    "number.integer": "Age must be an integer",
    "number.base": "Age must be a number",
  }),
  email: Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email address must be in a valid format (Example: user@example.com)",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have minimum 8 characters, at least one lowercase  letter, one uppercase letter and at least one digit",
    }),
  phone: Joi.string()
    .pattern(/^\+\d{1,3}\d{9}$/)
    .messages({
      "string.pattern.base": "Invalid phone number. (Example: +421900900900)",
    }),
});
export const updateUserValidator = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).messages({
    "string.min": "Name length must be at least 2 characters long",
    "string.max": "Name length must be maximum 30 characters long",
    "string.empty": "Name cannot be an empty field",
  }),
  age: Joi.number().integer().min(0).max(150).messages({
    "number.min": "Age must be a positive number",
    "number.max": "Age must be less than or equal to 150",
    "number.integer": "Age must be an integer",
    "number.base": "Age must be a number",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must have minimum 8 characters, at least one lowercase  letter, one uppercase letter and at least one digit",
    }),
  phone: Joi.string()

    .pattern(/'(^\+?[\d\s?]{10,15})/)
    .messages({
      "string.pattern.base": "",
    }),
});

export const loginUserValidator = Joi.object({
  email: Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email address must be in a valid format (Example: user@example.com)",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must have minimum 8 characters, at least one lowercase  letter, one uppercase letter and at least one digit",
    }),
});
