const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const ApiError = require('../utils/ApiError');

const createAdmin = async(adminBody) => {
    
   try {
    const admin = await Admin.create({
        firstName: adminBody.firstName,
        lastName: adminBody.lastName,
        password: adminBody.password,
        email: adminBody.email
    });

    return admin;

   } catch (error) {
       console.log(error);
   }
};


const updateAdmin = async(admin, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await Admin.updateOne({ _id: admin._id }, {"$set": updateBody }, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });  

    return result;
};

const deleteAdmin = async(adminId) => {
    const result = await Admin.deleteOne({_id: adminId});
    return result;
};


const getAdminById = async(adminId) => {
    const admin = await Admin.findOne({ _id: adminId });
    if(!admin) { throw new ApiError(httpStatus.NOT_FOUND, 'AdminNotFound') };
    return admin;
};

const uploadAvatar = async(adminId, imageDetails) => {
    const result = await Admin.updateOne({ _id: adminId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getAdminByEmail = async(email) => {
    const admin = await Admin.findOne({ email: email });
    return admin;
};

const changePassword = async(adminId, passwordBody) => {
    const admin = await Admin.findOne({ _id: adminId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await admin.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await Admin.updateOne({ _id: adminId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};

module.exports = {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    uploadAvatar,
    getAdminByEmail,
    changePassword
};