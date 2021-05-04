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
    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.addInternsToTheTerm(term, internsList);
    res.status(httpStatus.OK).send(term);
});

const removeInternsFromTheTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const internsList = req.body.internsList;
    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.removeInternsFromTheTerm(term, internsList);
    res.status(httpStatus.OK).send(result);
});


const addMentorsToTheTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const mentorsList = req.body.mentorsList;
    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.addMentorToTheTerm(term, mentorsList);
    res.status(httpStatus.OK).send(result);
});

const removeMentorsFromTheTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const mentorsList = req.body.mentorsList;
    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    console.log(term);
    const result = await termService.removeMentorsFromTheTerm(term, mentorsList);
    res.status(httpStatus.OK).send(result);
});

const updateTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const updateBody = req.body;

    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const result = await termService.updateTerm(term, updateBody);
    res.status(httpStatus.OK).send(result);
});

const getTerms = catchAsync(async(req, res) => {
    const terms = await termService.getTerms();
    res.status(httpStatus.OK).send(result);
});

const getTermById = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const result = await termService.getTermById(termId);
    res.status(httpStatus.OK).send(result);
});

const deleteTermById = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const result = await termService.deleteTermById(termId);
    res.status(httpStatus.OK).send(result);
});


const getWeeksOfTheTermById = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const internId = '6087b87b104caa2307e68566';
    const weeks = await termService.getWeeksOfTheTermById(termId, internId);
    res.status(httpStatus.OK).send(weeks);
});

const removeWeekFromTerm = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const weekId = req.params.weekId;
    const result = await termService.removeWeekFromTerm(termId, weekId);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    createTerm,
    addInternsToTheTerm,
    removeInternsFromTheTerm,
    addMentorsToTheTerm,
    removeMentorsFromTheTerm,
    updateTerm,
    getTerms,
    getTermById,
    deleteTermById,
    getWeeksOfTheTermById,
    removeWeekFromTerm
};