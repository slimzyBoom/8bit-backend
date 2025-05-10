import Joi from "joi";

export const TrivialSessionSchema = Joi.object({
    category: Joi.number().integer().min(0).max(31).optional(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    type: Joi.string().valid("multiple", "boolean").optional(),
    amount: Joi.number().integer().min(1).max(50).optional(),
});

export const TriviaAnswerSchema = Joi.object({
    questionIndex: Joi.number().integer().min(0).required(),
    answer: Joi.string().required(),
    isCorrect: Joi.boolean().required(),
});
