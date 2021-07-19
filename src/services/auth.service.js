const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const config = require('../../src/config/config');
const { SuperUser, Intern } = require('../models');
const tokenService = require('./token.service');
const internService = require('./intern.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');


const loginSuperUser = async(username, password) => {
  const user = await SuperUser.findOne({ '$or': [ { email: username }, { phoneNumber: username } ]});
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  tokens = await tokenService.generateAuthTokens(user);
  return {user, tokens}
};

const loginIntern = async(username, password) => {
  const user = await Intern.findOne({ '$or': [{ email: username }, { phoneNumber: username }] });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  tokens = await tokenService.generateAuthTokens(user);
  return {user, tokens}
};


/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await findUserTypeById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
      const user = await findUserTypeById(resetPasswordTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await Token.deleteMany({ user: user.id, type: 'resetPassword' });
      newPassword = await bcrypt.hash(newPassword, 3);
      await updateUserById(user.id, newPassword);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};


const findUserTypeById = async(id) => {
  const admin  = await Admin.findOne({ _id: id });
  const intern = await Intern.findOne({ _id: id });
  const mentor = await Mentor.findOne({ _id: id });
  const supervisor = await Supervisor.findOne({ _id: id });
  if(admin)   { return user = admin };
  if(intern)  { return user = intern };
  if(mentor)  { return user = mentor };
  if(supervisor) { return user = supervisor };
};

const updateUserById = async(id, newPassword) => {
  const admin  = await Admin.updateOne({ _id: id },  { "$set": { password: newPassword }});
  const mentor = await Mentor.updateOne({ _id: id }, { "$set": { password: newPassword }});
  const intern = await Intern.updateOne({ _id: id }, { "$set": { password: newPassword }});
  const supervisor = await Supervisor.updateOne({ _id: id }, { "$set": { password: newPassword }});
};



const changePassword = async(user, passwordBody) => {
  switch(user.role) {
    case 'owner':
    case 'admin':
         result = await adminService.changePassword(user._id, passwordBody)
      return result;
    
    case 'mentor':
         result = await mentorService.changePassword(user._id, passwordBody)
      return result;

    case 'intern':
         result = await internService.changePassword(user._id, passwordBody)
      return result;

    case 'supervisor':
         result = await supervisorService.changePassword(user._id, passwordBody)
      return result;


    default:
        throw new ApiError(httpStatus.NOT_FOUND, 'UserNotFound');
  }
};

const baseURL = async () => {
  const domain = `${config.baseURL.serverDomain}`;
  const images =` ${domain}/${config.filePath.images}`;
  const videos = `${domain}/${config.filePath.videos}`;
  const audios = `${domain}/${config.filePath.audios}`;
  const pdfs   = `${domain}/${config.filePath.pdfs}`;

  return {
    domain:     domain,
    imagesPath: images,
    videosPath: videos,
    audiosPath: audios,
    pdfsPath:   pdfs,
  }
}



module.exports = {
  loginSuperUser,
  loginIntern,
  logout,
  refreshAuth,
  resetPassword,
  changePassword,
  baseURL,
  findUserTypeById,
};




// const emailValidator = require('email-validator');
// const validatePhoneNumber = require('validate-phone-number-node-js');



  // userRoleValidationAMS,
  // userRoleValidationInternByEmail,
  // userRoleValidationInternByPhoneNumber,
  // getUserDataByEmail,
  // getUserDataByPhoneNumber,
  // usernameTypeValidation



// const usernameTypeValidation = async(username) => {
//   const isEmail = emailValidator.validate(username);
//   if(isEmail) { return 'email'};
//   const isPhoneNumber = validatePhoneNumber.validate(username);
//   if(isPhoneNumber) { return 'phoneNumber' };
// };


// /**
//  * Login with username and password
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<User>}
//  */
// const loginUserWithEmailAndPassword = async (email, password) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//   }
//   return user;
// };

// user role validation function for admin & mentor & supervisor
// const userRoleValidationAMS = async(email) => {
//   const admin  = await Admin.findOne({ email: email });
//   const mentor = await Mentor.findOne({ email: email });
//   const supervisor = await Supervisor.findOne({ email: email });
//   if(admin)   { return role = admin.role };
//   if(mentor)  { return role = mentor.role };
//   if(supervisor)    { return role = supervisor.role };
// };

// user role validation function for Intern
// const userRoleValidationInternByEmail = async(email) => {
//   const intern = await Intern.findOne({ email: email });
//   if(intern)  { return role = intern.role };
// };

// user role validation function for Intern
// const userRoleValidationInternByPhoneNumber = async(phoneNumber) => {
//   const intern = await Intern.findOne({ phoneNumber: phoneNumber });
//   if(intern)  { return role = intern.role };
// };


// const getUserDataByPhoneNumber = async(userRole, phoneNumber, password) => {
//   switch(userRole) {
//     case 'owner':
//           user   = await loginWithPhoneNumberAndPassword(userRole, phoneNumber, password);
//           tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};
//     case 'admin':
//          user   = await loginWithPhoneNumberAndPassword(userRole, phoneNumber, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};
    
//     case 'mentor':
//          user   = await loginWithPhoneNumberAndPassword(userRole, phoneNumber, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};

//     case 'intern':
//          user   = await loginWithPhoneNumberAndPassword(userRole, phoneNumber, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};

//     case 'supervisor':
//          user   = await loginWithPhoneNumberAndPassword(userRole, phoneNumber, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};


//     default:
        
//         throw new ApiError(httpStatus.NOT_FOUND, 'UserNotFound');
//   }
// };

// const loginWithPhoneNumberAndPassword = async(role, phoneNumber, password) => {
  
//   if(role === 'owner' || role === 'admin') {
//       const admin = await adminService.getAdminByPhoneNumber(phoneNumber);
//       if (!admin || !(await admin.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//       }
//       return admin;
//   }
//   if(role === 'mentor') {
//       const mentor = await mentorService.getMentorByPhoneNumber(phoneNumber);
//       if (!mentor || !(await mentor.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
//       }
//       return mentor;
//   }
//   if(role === 'intern') {
//       const intern = await internService.getInternByPhoneNumber(phoneNumber);
//       if (!intern || !(await intern.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
//       }
//       return intern;
//   }
//   if(role === 'supervisor') {
//       const supervisor = await supervisorService.getSupervisorByPhoneNumber(phoneNumber);
//       if (!supervisor || !(await supervisor.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//       }
//       return supervisor;
//   }
// };


// const getUserDataByEmail = async(userRole, email, password) => {
//   switch(userRole) {
//     case 'owner':
//           user   = await loginWithEmailAndPassword(userRole, email, password);
//           tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};
//     case 'admin':
//          user   = await loginWithEmailAndPassword(userRole, email, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};
    
//     case 'mentor':
//          user   = await loginWithEmailAndPassword(userRole, email, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};

//     case 'intern':
//          user   = await loginWithEmailAndPassword(userRole, email, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};

//     case 'supervisor':
//          user   = await loginWithEmailAndPassword(userRole, email, password);
//          tokens = await tokenService.generateAuthTokens(user);
//       return {user, tokens};


//     default:
        
//         throw new ApiError(httpStatus.NOT_FOUND, 'UserNotFound');
//   }
// };



// const loginWithEmailAndPassword = async(role, email, password) => {
  
//   if(role === 'owner' || role === 'admin') {
//       const admin = await adminService.getAdminByEmail(email);
//       if (!admin || !(await admin.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//       }
//       return admin;
//   }
//   if(role === 'mentor') {
//       const mentor = await mentorService.getMentorByEmail(email);
//       if (!mentor || !(await mentor.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
//       }
//       return mentor;
//   }
//   if(role === 'intern') {
//       const intern = await internService.getInternByEmail(email);
//       if (!intern || !(await intern.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
//       }
//       return intern;
//   }
//   if(role === 'supervisor') {
//       const supervisor = await supervisorService.getSupervisorByEmail(email);
//       if (!supervisor || !(await supervisor.isPasswordMatch(password))) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//       }
//       return supervisor;
//   }
// };
