const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createIntern = {
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string().custom(password),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string()
    }),
};

const updateInternById = {
    params: Joi.object().keys({
        internId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email(),
            phoneNumber: Joi.string(),
            birthday: Joi.string().allow('').allow(null).default('null'),
            skills: Joi.string().allow('').allow(null).default('null'),
            major: Joi.string().allow('').allow(null).default('null'),
            businessStory: Joi.string().allow('').allow(null).default('null'),
            inspirationalCharacters: Joi.string().allow('').allow(null).default('null'),
            inspirationalSentences: Joi.string().allow('').allow(null).default('null'),
            lastBooks: Joi.string().allow('').allow(null).default('null'),
            favoriteMovies: Joi.string().allow('').allow(null).default('null'),
            sex: Joi.string().allow('').allow(null).default('null'),
            maritalStatus: Joi.string().allow('').allow(null).default('null'),
            province: Joi.string().allow('').allow(null).default('null'),
            city: Joi.string().allow('').allow(null).default('null'),
            bloodType: Joi.string().allow('').allow(null).default('null'),
            jobStatus: Joi.string().allow('').allow(null).default('null'),
            degree: Joi.string().allow('').allow(null).default('null'),
            webSite: Joi.string().allow('').allow(null).default('null'),
            virgool: Joi.string().allow('').allow(null).default('null'),
            twitter: Joi.string().allow('').allow(null).default('null'),
            linkedin: Joi.string().allow('').allow(null).default('null'),
            instagram: Joi.string().allow('').allow(null).default('null')
        }).options({ stripUnknown: true }),
};

const deleteIntern = {
    params: Joi.object().keys({
        internId: Joi.string().custom(objectId)
    })
};

const uploadAvatar = {
    params: Joi.object().keys({
        internId: Joi.string().custom(objectId)
    })
};

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string(),
        newPassword: Joi.string(),
    }),
};


const getInternById = {
    params: Joi.object().keys({
        internId: Joi.string().custom(objectId)
    })
}

module.exports = {
    createIntern,
    updateInternById,
    deleteIntern,
    uploadAvatar,
    changePassword,
    getInternById
};