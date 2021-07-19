const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, emailService} = require('../services');

// 

const loginSuperUser = catchAsync(async(req, res) => {
  const { username, password } = req.body;
  const result = await authService.loginSuperUser(username, password);
  res.status(httpStatus.OK).send(result);
});


const loginIntern = catchAsync(async(req, res) => {
  const { username, password } = req.body;
  const result = await authService.loginIntern(username, password);
  res.status(httpStatus.OK).send(result);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const email = await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send(email);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const changePassword = catchAsync(async(req, res) => {
  const userId = req.user._id;
  const passwordBody = req.body;
  const user = await authService.findUserTypeById(userId);
  const result = await authService.changePassword(user, passwordBody);
  res.status(httpStatus.OK).send(result);
});


const baseURL = catchAsync(async(req, res) => {
  const baseURL = await authService.baseURL();
  res.status(httpStatus.OK).send(baseURL);
});


module.exports = {

  loginSuperUser,
  loginIntern,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  baseURL
};


// register,
// loginAMS,

// const register = catchAsync(async (req, res) => {
//     const userExist = await authService.userRoleValidation(email);
//     if(userExist) { throw new ApiError(httpStatus.BAD_REQUEST, 'EmailIsExist') };
//     const user = await userService.createUser(req.body);
//     const tokens = await tokenService.generateAuthTokens(user);
//     res.status(httpStatus.CREATED).send({ user, tokens });
//   });
  
// login function for admin & mentor & supervisor
// const loginAMS = catchAsync(async (req, res) => {
//   const { username, password } = req.body;
//   const userRole = await authService.userRoleValidationAMS(username);
//   const userData = await authService.getUserDataByEmail(userRole, username, password);
//   res.status(httpStatus.OK).send(userData);
// });


// const loginIntern = catchAsync(async (req, res) => {
//   const { username, password } = req.body;
//   const usernameType = await authService.usernameTypeValidation(req.body.username);
  
//   if(usernameType === 'email') {
//     const userRole = await authService.userRoleValidationInternByEmail(username);
//     const userData = await authService.getUserDataByEmail(userRole, username, password);
//     res.status(httpStatus.OK).send(userData);
//   }
//   else if(usernameType === 'phoneNumber') {
//     const userRole = await authService.userRoleValidationInternByPhoneNumber(username);
//     const userData = await authService.getUserDataByPhoneNumber(userRole, username, password);
//     res.status(httpStatus.OK).send(userData);
//   }
// });