/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export function userValidate(req, res, next) {
  const userSignUp = Joi.object({
    name: Joi.string().min(4).required()
      .trim(),
    email: Joi.string().min(4).required().email()
      .trim(),
    password: Joi.string().min(6).max(8).required()
      .trim(),
    passwordConfirm: Joi.string().min(6).max(8).required()
      .trim()

  });
  const result = userSignUp.validate(req.body);
  if (result.error) return res.status(400).json({ Message: result.error.details[0].message });
  next();
}
