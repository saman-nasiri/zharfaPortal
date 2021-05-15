const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { supervisorService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createSupervisor = catchAsync(async(req, res) => {
    const supervisorBody = req.body;
    console.log(supervisorBody);
    const result = await supervisorService.createSupervisor(supervisorBody);
    res.status(httpStatus.CREATED).send(result);
});

const updateSupervisor = catchAsync(async(req, res) => {
    const supervisorId = req.params.supervisorId;
    const updateBody = req.body;
    const supervisor = await supervisorService.getSupervisorById(supervisorId)
    if(!supervisor) { throw new ApiError(httpStatus.NOT_FOUND, 'SupervisorNotFound'); };

    const result = await supervisorService.updateSupervisor(supervisor, updateBody);
    res.status(httpStatus.OK).send(result);
});

const deleteSupervisor = catchAsync(async(req, res) => {
    const supervisorId = req.params.supervisorId;
    const result = await supervisorService.deleteSupervisor(supervisorId);
    res.status(httpStatus.OK).send(result);
});

const uploadAvatar = catchAsync(async(req, res) => {
    const supervisorId = req.params.supervisorId;
    await supervisorService.getSupervisorById(supervisorId);
    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    const result = await supervisorService.uploadAvatar(supervisorId, imageDetails);
    res.status(httpStatus.OK).send(result);
});

const changePassword = catchAsync(async(req, res) => {
    const supervisorId = req.user.id;
    const passwordBody = req.body;
    await supervisorService.changePassword(supervisorId, passwordBody);
    res.status(httpStatus.OK).send();
});

module.exports = {
    createSupervisor,
    updateSupervisor,
    deleteSupervisor,
    uploadAvatar,
    changePassword,
    
};