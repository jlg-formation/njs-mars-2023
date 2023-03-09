import Joi from "joi";

export const newArticleSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  price: Joi.number().precision(2).min(0).required(),
  qty: Joi.number().integer().min(0).required(),
});

export const partialArticleSchema = newArticleSchema.fork(
  ["name", "price", "qty"],
  (field) => field.optional()
);
