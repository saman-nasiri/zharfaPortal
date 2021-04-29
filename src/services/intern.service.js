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


const getIntern = async(internId) => {
    const intern = await Intern.findById(internId);
    return intern;
};

module.exports = {
    createIntern,
    updateIntern,
    getIntern
};