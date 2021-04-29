const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { termService, tutorialService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createTerm = catchAsync(async(req, res) => {
    const termBody = req.body;
    const tutorialCategory = await tutorialService.getTutorialCategoryBySlug(req.body.tutorialCategory);
    if(!tutorialCategory) { throw new ApiError(httpStatus.NOT_FOUND, 'TutorialCategoryNotFound'); };
    const result = await termService.createTerm(termBody, tutorialCategory);
    res.status(httpStatus.CREATED).send(result);
});

const addInternsToTheTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const internsList = req.body.internsList;

    const term = await termService.getTerm(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.addInternsToTheTerm(term, internsList);
    res.status(httpStatus.OK).send(term);
});

const addMentorsToTheTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const mentorsList = req.body.mentorsList;

    const term = await termService.getTerm(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.addMentorToTheTerm(term, mentorsList);
    res.status(httpStatus.OK).send(result);
});

const updateTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const updateBody = req.body;

    const term = await termService.getTerm(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.updateTerm(term, updateBody);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    createTerm,
    addInternsToTheTerm,
    addMentorsToTheTerm,
    updateTerm
};