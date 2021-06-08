const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { internService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createIntern = catchAsync(async(req, res) => {
    const internBody = req.body;
    const result = await internService.createIntern(internBody);
     res.status(httpStatus.CREATED).send(result);
});


const updateIntern = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const updateBody = req.body;
    const intern = await internService.getInternById(internId)
    const result = await internService.updateIntern(intern, updateBody);
    res.status(httpStatus.OK).send(result);
});

const deleteIntern = catchAsync(async(req, res) => {
    const internId = req.params.internId;
    const result = await internService.deleteIntern(internId);
    res.status(httpStatus.OK).send(result);
});

const uploadAvatar = catchAsync(async(req, res) => {
    const internId = req.params.internId;
    await internService.getInternById(internId);
    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    const result = await internService.uploadAvatar(internId, imageDetails);
    res.status(httpStatus.OK).send(result);
});

const changePassword = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const passwordBody = req.body;
    const result = await internService.changePassword(internId, passwordBody);
    res.status(httpStatus.OK).send(result);
});

const getInterns = catchAsync(async(req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const interns = await internService.queryInterns(filter, options);
    res.status(httpStatus.OK).send(interns);
});

const getInternById = catchAsync(async(req, res) => {
    const internId = req.params.internId;
    const intern = await internService.getInternById(internId);
    res.status(httpStatus.OK).send(intern);
});

const getInternTerms = catchAsync(async(req, res) => {
    const internId = req.params.internId;
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const terms = await internService.getInternTerms(internId, options);
    res.status(httpStatus.OK).send(terms);
});

module.exports = {
    createIntern,
    updateIntern,
    deleteIntern,
    uploadAvatar,
    changePassword,
    getInterns,
    getInternById,
    getInternTerms
};