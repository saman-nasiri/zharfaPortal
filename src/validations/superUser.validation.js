const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const createOwner =  {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string()
    }),
};


const createSuperUser = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required(),
        role: Joi.string().required(),
        phoneNumber: Joi.string()
    }),
};

const updateSuperUserById = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string()
        }).options({ stripUnknown: true }),
};

const deleteSuperUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId)
    })
};

const uploadAvatar = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId)
    })
};

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string(),
        newPassword: Joi.string(),
    }),
};


const getSuperUserById = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId)
    })
}

const getSuperUserByRole = {
    params: Joi.object().keys({
        role: Joi.string().custom(objectId)
    })
}

module.exports = {
    createSuperUser,
    updateSuperUserById,
    deleteSuperUser,
    uploadAvatar,
    changePassword,
    getSuperUserById
};