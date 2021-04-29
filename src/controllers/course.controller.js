const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createHeadCourse = catchAsync(async(req, res) => {
    const courseBody = req.body;
    const result = await courseService.createHeadCourse(courseBody);
    res.status(httpStatus.CREATED).send(result);
});

const createSubsetHeadCourse = catchAsync(async(req, res) => {
    const headCourseSlug = req.params.headCourse;
    const courseBody = req.body;
    const headCourse = await courseService.getCourseBySlug(headCourseSlug);
    console.log(headCourse);
    if(!headCourse) { throw new ApiError(httpStatus.NOT_FOUND, 'CourseNotFound'); };
    const result = await courseService.createSubsetCourse(courseBody, headCourse);
    res.status(httpStatus.CREATED).send(result);
});


module.exports = {
    createHeadCourse,
    createSubsetHeadCourse
};