const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weekService, termService, taskService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createWeek = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const weekBody = req.body;
    const term = await termService.getTermById(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const week = await weekService.createWeek(weekBody);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotCreated'); };
    await termService.addWeekToTheTerm(term, week._id)
    res.status(httpStatus.CREATED).send(week);
});

const updateWeekById = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const updateBody = req.body;
    const result = await weekService.updateWeekById(weekId, updateBody);
    res.status(httpStatus.OK).send(result);
});

const recordWeekScore = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = req.user.id;
    const action = await weekService.getInternWeekAction(weekId, internId); //if exist return not create action
    const week = await weekService.recordWeekScore(action); //if score is false do true and add week score
    res.status(httpStatus.OK).send('success');
 });

 const recordWeekViewCount = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = req.user.id;
    const action = await weekService.getInternWeekAction(weekId, internId); //if exist return not create action
    const week = await weekService.recordWeekViewCount(action) //if viewCount is false do true and add week score
    res.status(httpStatus.OK).send('success');
 });

 const weekProgressbar = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = req.user.id;
    const week = await weekService.getWeekById(weekId);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotFound'); };
    const progressbar = await weekService.weekProgressbar(week, internId);
    res.status(httpStatus.OK).send(progressbar);
 });

const getWeeks = catchAsync(async(req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const weeks = await weekService.getWeeks(filter, options);
    if(!weeks) { throw new ApiError(httpStatus.NOT_FOUND, 'WeeksNotFound') };
    res.status(httpStatus.OK).send(weeks);
});

const getWeekById = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const week = await weekService.getWeekById(weekId);
    res.status(httpStatus.OK).send(week);
});

const getWeekTasks = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const tasks = await weekService.getWeekTasks(weekId);
    res.status(httpStatus.OK).send(tasks);
});

const deleteWeekById = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const week = await weekService.getWeekById(weekId);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotFound') };
    const result = await weekService.deleteWeekById(weekId);
    res.status(httpStatus.OK).send(result);
});


module.exports = {
    createWeek,
    updateWeekById,
    recordWeekScore,
    recordWeekViewCount,
    weekProgressbar,
    getWeeks,
    getWeekById,
    deleteWeekById,
    getWeekTasks
};