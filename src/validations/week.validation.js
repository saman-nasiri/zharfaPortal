const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createWeek = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        order: Joi.number()
    }),
};

const updateWeekById = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string(),
            order: Joi.number()
        }),
};

const deleteWeek = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const weekProgressbar = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const recordWeekScore = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const recordWeekViewCount = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const getWeekTasks = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const deleteWeekById = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};

const getWeekById = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId)
    })
};


module.exports = {
    createWeek,
    updateWeekById,
    deleteWeek,
    weekProgressbar,
    recordWeekScore,
    recordWeekViewCount,
    getWeekTasks,
    deleteWeekById,
    getWeekById
};