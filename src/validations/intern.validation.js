const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createIntern = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(), //.custom(password)
        email: Joi.string().email(),
        phoneNumber: Joi.string().required()
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
            skills: Joi.string().allow('').allow(null),
            major: Joi.string().allow('').allow(null),
            businessStory: Joi.string().allow('').allow(null),
            inspirationalCharacters: Joi.string().allow('').allow(null),
            inspirationalSentences: Joi.string().allow('').allow(null),
            lastBooks: Joi.string().allow('').allow(null),
            favoriteMovies: Joi.string().allow('').allow(null),
            sex: Joi.string().allow('').allow(null),
            maritalStatus: Joi.string().allow('').allow(null),
            province: Joi.string().allow('').allow(null),
            city: Joi.string().allow('').allow(null),
            bloodType: Joi.string().allow('').allow(null),
            jobStatus: Joi.string().allow('').allow(null),
            degree: Joi.string().allow('').allow(null),
            webSite: Joi.string().allow('').allow(null),
            virgool: Joi.string().allow('').allow(null),
            twitter: Joi.string().allow('').allow(null),
            linkedin: Joi.string().allow('').allow(null),
            instagram: Joi.string().allow('').allow(null)
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