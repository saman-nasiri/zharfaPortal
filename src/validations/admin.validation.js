const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createAdmin = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required()
    }),
};

const updateAdminById = {
    params: Joi.object().keys({
        adminId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string()
        }).options({ stripUnknown: true }),
};

const deleteAdmin = {
    params: Joi.object().keys({
        adminId: Joi.string().custom(objectId)
    })
};

const uploadAvatar = {
    params: Joi.object().keys({
        adminId: Joi.string().custom(objectId)
    })
};

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string(),
        newPassword: Joi.string(),
    }),
};


const getAdminById = {
    params: Joi.object().keys({
        adminId: Joi.string().custom(objectId)
    })
}

module.exports = {
    createAdmin,
    updateAdminById,
    deleteAdmin,
    uploadAvatar,
    changePassword,
    getAdminById
};