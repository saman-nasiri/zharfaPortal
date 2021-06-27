const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Mentor } = require('../models');
const ApiError = require('../utils/ApiError');


const createMentor = async(mentorBody) => {   
    if (await Mentor.isEmailTaken(mentorBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'EmailAlreadyTaken');
    };
    const mentor = await Mentor.create({
        firstName: mentorBody.firstName,
        lastName: mentorBody.lastName,
        password: mentorBody.password,
        email: mentorBody.email
    });

    return mentor;
};


const updateMentor = async(mentor, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await Mentor.updateOne({ _id: mentor._id }, {"$set": updateBody }, { "new": true, "upsert": true });  

    return result;
};

const deleteMentor = async(mentorId) => {
    const result = await Mentor.deleteOne({_id: mentorId});
    return result;
};


const getMentorById = async(mentorId) => {
    const mentor = await Mentor.findOne({ _id: mentorId });
    if(!mentor) { throw new ApiError(httpStatus.NOT_FOUND, 'MentorNotFound') };
    return mentor;
};

const uploadAvatar = async(mentorId, imageDetails) => {
    const result = await Mentor.updateOne({ _id: mentorId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getMentorByEmail = async(email) => {
    const mentor = await Mentor.findOne({ email: email });
    return mentor;
};

const getMentors = async(filter, options) => {
    const mentors = await Mentor.paginate(filter, options);
    if(!mentors) { throw new ApiError(httpStatus.NOT_FOUND, 'MentorNotFound')};
    return mentors;
};

const changePassword = async(mentorId, passwordBody) => {
    const mentor = await Mentor.findOne({ _id: mentorId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await mentor.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await Mentor.updateOne({ _id: mentorId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};

module.exports = {
    createMentor,
    updateMentor,
    deleteMentor,
    getMentorById,
    getMentorByEmail,
    getMentors,
    changePassword,
    uploadAvatar
};