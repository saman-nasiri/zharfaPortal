const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { superUserService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createOwner = catchAsync(async(req, res) => {
    const ownerBody = req.body;
    const result = await superUserService.createOwner(ownerBody);
    res.status(httpStatus.CREATED).send(result);
});


const createSuperUser = catchAsync(async(req, res) => {
    const userBody = req.body;
    const result = await superUserService.createSuperUser(userBody);
    res.status(httpStatus.CREATED).send(result);
});

const updateSuperUser = catchAsync(async(req, res) => {
    const userId = req.params.userId;
    const updateBody = req.body;
    const superUser = await superUserService.getSuperUserById(userId)
    if(!superUser) { throw new ApiError(httpStatus.NOT_FOUND, 'SuperUserNotFound'); };

    const result = await superUserService.updateSuperUser(superUser, updateBody);
    res.status(httpStatus.OK).send(result);
});

const deleteSuperUser = catchAsync(async(req, res) => {
    const userId = req.params.userId;
    const result = await superUserService.deleteSuperUser(userId);
    res.status(httpStatus.OK).send(result);
});

const uploadAvatar = catchAsync(async(req, res) => {
    const userId = req.params.userId;
    await superUserService.getSuperUserById(userId);
    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    const result = await superUserService.uploadAvatar(userId, imageDetails);
    res.status(httpStatus.OK).send(result);
});

const changePassword = catchAsync(async(req, res) => {
    const userId = req.user.id;
    const passwordBody = req.body;
    const result = await superUserService.changePassword(userId, passwordBody);
    res.status(httpStatus.OK).send(result);
});

const getSuperUsers = catchAsync(async(req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const superUsers = await superUserService.getSuperUsers(filter, options);
    res.status(httpStatus.OK).send(superUsers);
});

const getSuperUserById = catchAsync(async(req, res) => {
    const userId = req.params.userId;
    const superUser = await superUserService.getSuperUserById(userId);
    res.status(httpStatus.OK).send(superUser);
});


const getSuperUseByRole = catchAsync(async(req, res) => {
    const role = req.params.role;
    const superusers = await superUserService.getSuperUseByRole(role);
    res.status(httpStatus.OK).send(superusers);
});


module.exports = {
    createOwner,
    createSuperUser,
    updateSuperUser,
    deleteSuperUser,
    uploadAvatar,
    changePassword,
    getSuperUsers,
    getSuperUserById,
    getSuperUseByRole
};