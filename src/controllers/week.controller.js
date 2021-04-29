const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weekService, termService, taskService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createWeek = catchAsync(async(req, res) => {
    const termId = req.params.termId;
    const weekBody = req.body;
    const term = await termService.getTerm(termId);
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermNotFound'); };
    const week = await weekService.createWeek(weekBody);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotCreated'); };
    await termService.addWeekToTheTerm(term, week._id)
    res.status(httpStatus.CREATED).send(week);
});

const recordWeekScore = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = "6087b87b104caa2307e68566" // req.user._id
    const action = await weekService.getInternWeekAction(weekId, internId); //if exist return not create action
    const week = await weekService.recordWeekScore(action); //if score is false do true and add week score
    res.status(httpStatus.OK).send('success');
 });

 const recordWeekViewCount = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = "6087b87b104caa2307e68566" // req.user._id
    const action = await weekService.getInternWeekAction(weekId, internId); //if exist return not create action
    const week = await weekService.recordWeekViewCount(action) //if viewCount is false do true and add week score
    res.status(httpStatus.OK).send('success');
 });

 const weekProgressbar = catchAsync(async(req, res) => {
    const weekId = req.params.weekId;
    const internId = "6087b87b104caa2307e68566" // req.user._id
    const week = await weekService.getWeek(weekId);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotFound'); };
    const progressbar = await weekService.weekProgressbar(week, internId);
    res.status(httpStatus.OK).send(progressbar);
 });


module.exports = {
    createWeek,
    recordWeekScore,
    recordWeekViewCount,
    weekProgressbar
};