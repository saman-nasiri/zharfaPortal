const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Supervisor } = require('../models');
const ApiError = require('../utils/ApiError');

const createSupervisor = async(supervisorBody) => {    

    if (await Supervisor.isEmailTaken(internBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'EmailAlreadyTaken');
    };
    const supervisor = await Supervisor.create({
        firstName: supervisorBody.firstName,
        lastName: supervisorBody.lastName,
        password: supervisorBody.password,
        email: supervisorBody.email
    });

    return supervisor;
};


const updateSupervisor = async(supervisor, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await Supervisor.updateOne({ _id: supervisor._id }, {"$set": updateBody }, { "new": true, "upsert": true });  

    return result;
};

const deleteSupervisor = async(supervisorId) => {
    const result = await Supervisor.deleteOne({_id: supervisorId});
    return result;
};


const getSupervisorById = async(supervisorId) => {
    const supervisor = await Supervisor.findOne({ _id: supervisorId });
    if(!supervisor) { throw new ApiError(httpStatus.NOT_FOUND, 'SupervisorNotFound') };
    return supervisor;
};

const uploadAvatar = async(supervisorId, imageDetails) => {
    const result = await Supervisor.updateOne({ _id: supervisorId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getSupervisorByEmail = async(email) => {
    const supervisor = await Supervisor.findOne({ email: email });
    return supervisor;
};

const changePassword = async(supervisorId, passwordBody) => {
    const supervisor = await Supervisor.findOne({ _id: supervisorId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await supervisor.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await Supervisor.updateOne({ _id: supervisorId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};

const getSupervisor = async(filter, options) => {
    const supervisors = await Supervisor.paginate(filter, options);
    return supervisors;
};

module.exports = {
    createSupervisor,
    updateSupervisor,
    deleteSupervisor,
    getSupervisorById,
    getSupervisorByEmail,
    changePassword,
    uploadAvatar,
    getSupervisor
};