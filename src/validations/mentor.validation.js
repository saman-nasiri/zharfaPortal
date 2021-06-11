const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createMentor = {
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string(),
        email: Joi.string()
    }),
};

const updateMentorById = {
    params: Joi.object().keys({
        mentorId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string()
        }).options({ stripUnknown: true }),
};

const deleteMentor = {
    params: Joi.object().keys({
        mentorId: Joi.string().custom(objectId)
    })
};

const uploadAvatar = {
    params: Joi.object().keys({
        mentorId: Joi.string().custom(objectId)
    })
};

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string(),
        newPassword: Joi.string(),
    }),
};


const getMentorById = {
    params: Joi.object().keys({
        mentorId: Joi.string().custom(objectId)
    })
}

module.exports = {
    createMentor,
    updateMentorById,
    deleteMentor,
    uploadAvatar,
    changePassword,
    getMentorById
};