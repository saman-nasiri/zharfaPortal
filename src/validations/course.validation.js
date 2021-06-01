const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createHeadCourse = {
    body: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string(),
        tutorialCategory: Joi.string()
    }),
};

const createSubHeadCourse = {
    body: Joi.object().keys({
        title: Joi.string(),
        slug: Joi.string()
    }),
};


const updateCourseById = {
    params: Joi.object().keys({
        courseId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            title: Joi.string(),
            slug: Joi.string()
        }),
};

const deleteCourse = {
    params: Joi.object().keys({
        courseId: Joi.string().custom(objectId)
    })
};


const getCourseBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required()
    })
};

const getSubCourse = {
    params: Joi.object().keys({
        headSlug: Joi.string().required()
    })
};

module.exports = {
    createHeadCourse,
    createSubHeadCourse,
    updateCourseById,
    deleteCourse,
    getCourseBySlug,
    getSubCourse
};