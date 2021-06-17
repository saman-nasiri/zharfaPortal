const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, adminService } = require('../services');

const register = catchAsync(async (req, res) => {
  const userExist = await authService.userRoleValidation(email);
  if(userExist) { throw new ApiError(httpStatus.BAD_REQUEST, 'EmailIsExist') };
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

// login function for admin & mentor & supervisor
const loginAMS = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userRole = await authService.userRoleValidationAMS(email);
  const userData = await authService.getUserData(userRole, email, password);
  res.status(httpStatus.OK).send(userData);
});

const loginIntern = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const usernameType = await authService.usernameTypeValidation(req.body.email);
  
  if(usernameType === 'email') {
    const userRole = await authService.userRoleValidationInternByEmail(email);
    const userData = await authService.getUserData(userRole, email, password);
    res.status(httpStatus.OK).send(userData);
  }
  else if(usernameType === 'phoneNumber') {
    const userRole = await authService.userRoleValidationInternByPhoneNumber(email);
    const userData = await authService.getUserData(userRole, email, password);
    res.status(httpStatus.OK).send(userData);
  }
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
  console.log(userId, passwordBody);
  const user = await authService.findUserTypeById(userId);
  console.log(user.role);
  const result = await authService.changePassword(user, passwordBody);
  res.status(httpStatus.OK).send(result);
});


const baseURL = catchAsync(async(req, res) => {
  const baseURL = await authService.baseURL();
  res.status(httpStatus.OK).send(baseURL);
});


module.exports = {
  register,
  loginAMS,
  loginIntern,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  baseURL
};
