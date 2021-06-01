const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createAdmin = {
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string(),
        email: Joi.string()
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
        }),
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