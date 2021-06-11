const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createSupervisor = {
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string(),
        email: Joi.string()
    }),
};

const updateSupervisorById = {
    params: Joi.object().keys({
        supervisorId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string()
        }).options({ stripUnknown: true }),
};

const deleteSupervisor = {
    params: Joi.object().keys({
        supervisorId: Joi.string().custom(objectId)
    })
};

const uploadAvatar = {
    params: Joi.object().keys({
        supervisorId: Joi.string().custom(objectId)
    })
};

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string(),
        newPassword: Joi.string(),
    }),
};


const getSupervisorById = {
    params: Joi.object().keys({
        supervisorId: Joi.string().custom(objectId)
    })
}

module.exports = {
    createSupervisor,
    updateSupervisorById,
    deleteSupervisor,
    uploadAvatar,
    changePassword,
    getSupervisorById
};