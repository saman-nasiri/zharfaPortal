const httpStatus = require('http-status');
const { Intern } = require('../models');
const ApiError = require('../utils/ApiError');

const createIntern = async(internBody) => {
    console.log(internBody);
   try {
    const intern = await Intern.create({
        firstName: internBody.firstName,
        lastName: internBody.lastName,
        email: internBody.email,
        password: internBody.password,
        phoneNumber: internBody.phoneNumber,
    });

    return intern;
   } catch (error) {
       console.log(error);
   }
};


const updateIntern = async(intern, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await Intern.updateOne({ _id: intern._id }, {"$set": updateBody }, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });  

    return result;
};

const deleteIntern = async(internId) => {
    const result = await Intern.deleteOne({_id: internId});
    return result;
};

const getInternById = async(internId) => {
    const intern = await Intern.findById(internId);
    return intern;
};


const uploadAvatar = async(internId, imageDetails) => {
    const result = await Intern.updateOne({ _id: internId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getInternByEmail = async(email) => {
    const intern = await Intern.findOne({ email: email });
    return intern;
};

const changePassword = async(internId, passwordBody) => {
    const intern = await Intern.findOne({ _id: internId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await Intern.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await Intern.updateOne({ _id: internId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};
module.exports = {
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,
    uploadAvatar,
    getInternByEmail,
    changePassword
};