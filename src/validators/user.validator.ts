import Joi from "joi";
export class UserValidator {
  private static name = Joi.string().alphanum().min(2).max(30).messages({
    "string.min": "Name length must be at least 2 characters long",
    "string.max": "Name length must be maximum 30 characters long",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is a required field",
  });
  private static age = Joi.number().integer().min(0).max(150).messages({
    "number.min": "Age must be a positive number",
    "number.max": "Age must be less than or equal to 150",
    "number.integer": "Age must be an integer",
    "number.base": "Age must be a number",
  });
  private static email = Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .messages({
      "string.pattern.base":
        "Email address must be in a valid format (Example: user@example.com)",
    });
  private static password = Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must have minimum 8 characters, at least one lowercase  letter, one uppercase letter and at least one digit",
    });
  private static phone = Joi.string()
    .pattern(/^\+\d{1,3}\d{9}$/)
    .messages({
      "string.pattern.base": "Invalid phone number. (Example: +421900900900)",
    });
  public static create = Joi.object({
    name: this.name.required(),
    age: this.age,
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone,
  });

  public static update = Joi.object({
    name: this.name,
    age: this.age,
    phone: this.phone,
  });

  public static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static forgotPassword = Joi.object({
    email: this.email.required(),
  });

  public static setForgotPassword = Joi.object({
    password: this.password.required(),
  });
}
