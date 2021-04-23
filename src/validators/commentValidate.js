/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export function commentValidate(req, res, next) {
  const comment = Joi.object({
    text: Joi.string().min(6).required()
      .trim()

  });
  const result = comment.validate(req.body);
  if (result.error) return res.status(400).json({ Message: result.error.details[0].message });
  next();
}