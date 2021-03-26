/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export function userSignInValidate(req, res, next) {
  const userSignIn = Joi.object({
    email: Joi.string().min(4).required().email()
      .trim(),
    password: Joi.string().min(6).max(8).required()
      .trim()

  });
  const result = userSignIn.validate(req.body);
  if (result.error) return res.status(400).json({ Message: result.error.details[0].message });
  next();
}
