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
  console.log(userRole);
  const userData = await authService.getUserData(userRole, email, password);
  console.log(userData);
  res.status(httpStatus.OK).send(userData);
});

const loginIntern = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userRole = await authService.userRoleValidationIntern(email);
  const userData = await authService.getUserData(userRole, email, password);
  res.status(httpStatus.OK).send(userData);
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

module.exports = {
  register,
  loginAMS,
  loginIntern,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
