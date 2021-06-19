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
            birthday: Joi.string(),
            skills: Joi.string(),
            major: Joi.string(),
            businessStory: Joi.string(),
            inspirationalCharacters: Joi.string(),
            inspirationalSentences: Joi.string(),
            lastBooks: Joi.string(),
            favoriteMovies: Joi.string().allow('').allow(null).default('null'),
            sex: Joi.string().allow('').allow(null).default('null'),
            maritalStatus: Joi.string().allow('').allow(null).default('null'),
            address: Joi.object({
                state: Joi.string(),
                city: Joi.string()
            }).allow('').allow(null).default('null'),
            bloodType: Joi.string().allow('').allow(null).default('null'),
            jobStatus: Joi.string().allow('').allow(null).default('null'),
            degree: Joi.string().allow('').allow(null).default('null'),
            socialMedia: Joi.object({
                webSite: Joi.string(),
                virgool: Joi.string(),
                twitter: Joi.string(),
                linkedin: Joi.string(),
                instagram: Joi.string()
            }).allow('').allow(null).default('null'),
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