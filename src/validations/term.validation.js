const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createTerm = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        tutorialCategory: Joi.string(),
        termCode: Joi.string(),
        description: Joi.string(),
    }),
};

const updateTermById = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        tutorialCategory: Joi.string(),
        termCode: Joi.string(),
        description: Joi.string(),
        }),
};

const removeWeekFromTerm = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId),
        weekId: Joi.string().custom(objectId)
    })
};

const addInternsToTheTerm = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const removeInternsFromTheTerm = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const addMentorsToTheTerm = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const removeMentorsFromTheTerm = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const getTermWeeks = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const deleteTermById = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const getTermById = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};

const getTermInterns = {
    params: Joi.object().keys({
        termId: Joi.string().custom(objectId)
    })
};


module.exports = {
    createTerm,
    updateTermById,
    removeWeekFromTerm,
    addInternsToTheTerm,
    removeInternsFromTheTerm,
    addMentorsToTheTerm,
    removeMentorsFromTheTerm,
    getTermWeeks,
    deleteTermById,
    getTermById,
    getTermInterns
};