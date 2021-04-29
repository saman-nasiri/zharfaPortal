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


const updateIntern = catchAsync(async(req, res) => {
    const internId = req.params.internId;
    const updateBody = req.body;
    const intern = await internService.getIntern(internId)
    if(!intern) { throw new ApiError(httpStatus.NOT_FOUND, 'InternNotFound'); };

    const result = await internService.updateIntern(intern, updateBody);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    createAdmin
};