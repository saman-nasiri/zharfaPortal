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
            favoriteMovies: Joi.string(),
            sex: Joi.string(),
            maritalStatus: Joi.string(),
            address: Joi.string(),
            bloodType: Joi.string(),
            jobStatus: Joi.string(),
            degree: Joi.string(),
            socialMedia: Joi.string(),
        }),
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