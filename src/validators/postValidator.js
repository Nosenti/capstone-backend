/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export function postValidate(req, res, next) {
  const post = Joi.object({
    title: Joi.string().min(4).required()
      .trim(),
    text: Joi.string().min(6).required()
      .trim(),
    postedAnonymously: Joi.bool(),
    tags: Joi.array()

  });
  const result = post.validate(req.body);
  if (result.error) return res.status(400).json({ Message: result.error.details[0].message });
  next();
}