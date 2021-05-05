const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const updateTaskById = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            title: Joi.string(),
            order:Joi.number(), 
            content:Joi.string(),
            duration:Joi.number(),
            // tellers: Joi.string().allow('').allow(null).default('null')
        }),
};


module.exports = {
    updateTaskById
};