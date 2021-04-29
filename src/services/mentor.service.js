const httpStatus = require('http-status');
const { Mentor } = require('../models');
const ApiError = require('../utils/ApiError');

const createMentor = async(mentorBody) => {    
   try {
    const mentor = await Mentor.create({
        firstName: mentorBody.firstName,
        lastName: mentorBody.lastName,
        password: mentorBody.password,
        email: mentorBody.email
    });

    return mentor;

   } catch (error) {
       console.log(error);
   }
};


module.exports = {
    createMentor
};