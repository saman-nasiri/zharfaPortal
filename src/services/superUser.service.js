const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { SuperUser } = require('../models');
const ApiError = require('../utils/ApiError');


const createOwner = async(userBody) => {
    if (await SuperUser.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'EmailAlreadyTaken');
    };
   try {
    const superUser = await SuperUser.create({
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        password: userBody.password,
        email: userBody.email,
        role: 'owner'
    });

    return superUser;

   } catch (error) {
       console.log(error);
   }
};


const createSuperUser = async(userBody) => {
    if (await SuperUser.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'EmailAlreadyTaken');
    };
    if (await SuperUser.isPhoneNumberTaken(userBody.phoneNumber)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'PhoneNumberAlreadyTaken');
    };
   try {
    const superUser = await SuperUser.create({
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        password: userBody.password,
        role: userBody.role,
        email: userBody.email,
        phoneNumber: userBody.phoneNumber
    });

    return superUser;

   } catch (error) {
       console.log(error);
   }
};


const updateSuperUser= async(user, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await SuperUser.updateOne({ _id: user._id }, {"$set": updateBody }, { "new": true, "upsert": true });  

    return result;
};

const deleteSuperUser = async(userId) => {
    const result = await SuperUser.deleteOne({_id: userId});
    return result;
};


const getSuperUserById = async(userId) => {
    const superUser = await SuperUser.findOne({ _id: userId });
    if(!superUser) { throw new ApiError(httpStatus.NOT_FOUND, 'SuperUserNotFound') };
    return superUser;
};

const uploadAvatar = async(userId, imageDetails) => {
    const result = await SuperUser.updateOne({ _id: userId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getSuperUserByEmail = async(email) => {
    const superUser = await SuperUser.findOne({ email: email });
    return superUser;
};


const getSuperUserByPhoneNumber = async(phoneNumber) => {
    const superUser = await SuperUser.findOne({ phoneNumber: phoneNumber });
    return superUser;
};


const changePassword = async(userId, passwordBody) => {
    const superUser = await SuperUser.findOne({ _id: userId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await SuperUser.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await SuperUser.updateOne({ _id: userId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};


const getSuperUsers = async(filter, options) => {
    const superUser = await SuperUser.paginate(filter, options);
    if(!superUser) { throw new ApiError(httpStatus.NOT_FOUND, 'SuperUsersNotFound')};
    return superUser;
};

const getSuperUseByRole = async(role) => {
    const superusers = await SuperUser.find({ role: role });
    if(!superusers) { throw new ApiError(httpStatus.NOT_FOUND, 'SuperUsersNotFound')};
    return superusers;
};


module.exports = {
    createOwner,
    createSuperUser,
    uploadAvatar,
    getSuperUserByPhoneNumber,
    changePassword,
    getSuperUserByEmail,
    getSuperUserById,
    deleteSuperUser,
    updateSuperUser,
    getSuperUsers,
    getSuperUseByRole
};