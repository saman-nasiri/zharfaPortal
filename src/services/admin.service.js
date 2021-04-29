const httpStatus = require('http-status');
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


module.exports = {
    createAdmin
};