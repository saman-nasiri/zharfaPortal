const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mentorService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createMentor = catchAsync(async(req, res) => {
    const mentorBody = req.body;
    const result = await mentorService.createMentor(mentorBody);
     res.status(httpStatus.CREATED).send(result);
});


const updateMentor = catchAsync(async(req, res) => {
    const mentorId = req.params.mentorId;
    const updateBody = req.body;
    const mentor = await mentorService.getMentorById(mentorId)
    if(!mentor) { throw new ApiError(httpStatus.NOT_FOUND, 'MentorNotFound'); };

    const result = await mentorService.updateMentor(mentor, updateBody);
    res.status(httpStatus.OK).send(result);
});

const deleteMentor = catchAsync(async(req, res) => {
    const mentorId = req.params.mentorId;
    const result = await mentorService.deleteMentor(mentorId);
    res.status(httpStatus.OK).send(result);
});

const uploadAvatar = catchAsync(async(req, res) => {
    const mentorId = req.params.mentorId;
    await mentorService.getMentorById(mentorId);
    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    const result = await mentorService.uploadAvatar(mentorId, imageDetails);
    res.status(httpStatus.OK).send(result);
});

const changePassword = catchAsync(async(req, res) => {
    const mentorId = req.user.id;
    const passwordBody = req.body;
    await mentorService.changePassword(mentorId, passwordBody);
    res.status(httpStatus.OK).send();
});

const getMentors = catchAsync(async(req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const mentors = await mentorService.getMentors(filter, options);
    res.status(httpStatus.OK).send(mentors);
});

const getMentorById = catchAsync(async(req, res) => {
    const mentorId = req.params.mentorId;
    const mentor = await mentorService.getMentorById(mentorId);
    res.status(httpStatus.OK).send(mentor);
});

module.exports = {
    createMentor,
    updateMentor,
    deleteMentor,
    uploadAvatar,
    changePassword,
    getMentors,
    getMentorById
};