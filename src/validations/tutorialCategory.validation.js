const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createTutorialMainCategory = {
    body: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string(),
        tutorialCategory: Joi.string()
    }),
};

const createTutorialSubCategory = {
    params: Joi.object().keys({
        mainTutorial: Joi.string(),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string()
    }),
};


const updateTutorialById = {
    params: Joi.object().keys({
        TutorialId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            title: Joi.string(),
            slug: Joi.string()
        }).options({ stripUnknown: true }),
};


const getTutorialBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required()
    })
};

const deleteTutorialBySlug = {
    params: Joi.object().keys({
        slug: Joi.string()
    })
};


const getSubTutorial = {
    params: Joi.object().keys({
        mainSlug: Joi.string().required()
    })
};

module.exports = {
    createTutorialMainCategory,
    createTutorialSubCategory,
    updateTutorialById,
    deleteTutorialBySlug,
    getTutorialBySlug,
    getSubTutorial
};