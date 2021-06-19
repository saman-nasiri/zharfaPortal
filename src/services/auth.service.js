const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const config = require('../../src/config/config');
const { Admin, Intern, Mentor, Supervisor } = require('../models');
const tokenService = require('./token.service');
const userService = require('./user.service');
const adminService = require('./admin.service');
const mentorService = require('./mentor.service');
const internService = require('./intern.service');
const supervisorService = require('./supervisor.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const emailValidator = require('email-validator');
const validatePhoneNumber = require('validate-phone-number-node-js');


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Admin>}
 */
const loginAdminWithEmailAndPassword = async (email, password) => {
    const admin = await adminService.getAdminByEmail(email);
    if (!admin || !(await admin.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return admin;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Admin>}
 */
const loginMentorWithEmailAndPassword = async (email, password) => {
  const mentor = await mentorService.getMentorByEmail(email);
  if (!mentor || !(await mentor.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return mentor;
};


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Admin>}
 */
const loginInternWithEmailAndPassword = async (email, password) => {
  const intern = await internService.getInternByEmail(email);
  if (!intern || !(await intern.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return intern;
};



/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Admin>}
 */
const loginSupervisorWithEmailAndPassword = async (email, password) => {
  const supervisor = await supervisorService.getSupervisorByEmail(email);
  if (!supervisor || !(await supervisor.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return supervisor;
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

// user role validation function for admin & mentor & supervisor
const userRoleValidationAMS = async(email) => {
  const admin  = await Admin.findOne({ email: email });
  const mentor = await Mentor.findOne({ email: email });
  const supervisor = await Supervisor.findOne({ email: email });
  if(admin)   { return role = admin.role };
  if(mentor)  { return role = mentor.role };
  if(supervisor)    { return role = supervisor.role };
};

// user role validation function for Intern
const userRoleValidationInternByEmail = async(email) => {
  const intern = await Intern.findOne({ email: email });
  if(intern)  { return role = intern.role };
};

// user role validation function for Intern
const userRoleValidationInternByPhoneNumber = async(phoneNumber) => {
  const intern = await Intern.findOne({ phoneNumber: phoneNumber });
  if(intern)  { return role = intern.role };
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
  const admin = await Admin.updateOne({ _id: id }, { "$set": { password: newPassword }});
  const mentor = await Mentor.updateOne({ _id: id }, { "$set": { password: newPassword }});
  const intern = await Intern.updateOne({ _id: id }, { "$set": { password: newPassword }});
  const supervisor = await Supervisor.updateOne({ _id: id }, { "$set": { password: newPassword }});
};

const getUserData = async(userRole, email, password) => {
  switch(userRole) {
    case 'owner':
    case 'admin':
         user   = await loginAdminWithEmailAndPassword(email, password);
         tokens = await tokenService.generateAuthTokens(user);
      return {user, tokens};
    
    case 'mentor':
         user   = await loginMentorWithEmailAndPassword(email, password);
         tokens = await tokenService.generateAuthTokens(user);
      return {user, tokens};

    case 'intern':
         user   = await loginInternWithEmailAndPassword(email, password);
         tokens = await tokenService.generateAuthTokens(user);
      return {user, tokens};

    case 'supervisor':
         user   = await loginSupervisorWithEmailAndPassword(email, password);
         tokens = await tokenService.generateAuthTokens(user);
      return {user, tokens};


    default:
        // res.status(httpStatus.NOT_FOUND).send('UserNotFound');
        throw new ApiError(httpStatus.NOT_FOUND, 'UserNotFound');
  }
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

const usernameTypeValidation = async(username) => {
  const isEmail = emailValidator.validate(username);
  if(isEmail) { console.log('Is Email'); return 'email'}
  const isPhoneNumber = validatePhoneNumber.validate(username);
  if(isPhoneNumber) { console.log('Is Phone Number'); return 'phoneNumber' }
};


module.exports = {
  loginUserWithEmailAndPassword,
  loginAdminWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  changePassword,
  userRoleValidationAMS,
  userRoleValidationInternByEmail,
  userRoleValidationInternByPhoneNumber,
  getUserData,
  baseURL,
  findUserTypeById,
  usernameTypeValidation
};
