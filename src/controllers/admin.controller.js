const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createAdmin = catchAsync(async(req, res) => {
    const adminBody = req.body;
    const result = await adminService.createAdmin(adminBody);
    res.status(httpStatus.CREATED).send(result);
});


const updateAdmin = catchAsync(async(req, res) => {
    const adminId = req.params.adminId;
    const updateBody = req.body;
    const admin = await adminService.getAdminById(adminId)
    if(!admin) { throw new ApiError(httpStatus.NOT_FOUND, 'AdminNotFound'); };

    const result = await adminService.updateAdmin(admin, updateBody);
    res.status(httpStatus.OK).send(result);
});

const deleteAdmin = catchAsync(async(req, res) => {
    const adminId = req.params.adminId;
    const result = await adminService.deleteAdmin(adminId);
    res.status(httpStatus.OK).send(result);
});

const uploadAvatar = catchAsync(async(req, res) => {
    const adminId = req.params.adminId;
    await adminService.getAdminById(adminId);
    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    const result = await adminService.uploadAvatar(adminId, imageDetails);
    res.status(httpStatus.OK).send(result);
});

const changePassword = catchAsync(async(req, res) => {
    const adminId = req.user; // req.user.id;
    console.log(adminId);
    // const passwordBody = req.body;
    // await adminService.changePassword(adminId, passwordBody);
    // res.status(httpStatus.OK).send();
});

module.exports = {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    uploadAvatar,
    changePassword
};