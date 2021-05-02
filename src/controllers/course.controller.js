const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courseService, tutorialService } = require('../services');
const upload = require('../middlewares/uploadFile');

const createHeadCourse = catchAsync(async(req, res) => {
    const courseBody = req.body;
    const tutorialCategory = req.body.tutorialCategory;
    const tutorial = await tutorialService.getTutorialBySlug(tutorialCategory);
    if(!tutorial) { throw new ApiError(httpStatus.NOT_FOUND, 'TutorialNotFound') };
    await courseService.courseSlugIsExist(req.body.slug);
    const result = await courseService.createHeadCourse(courseBody);
    res.status(httpStatus.CREATED).send(result);
});

const createSubsetHeadCourse = catchAsync(async(req, res) => {
    const headCourseSlug = req.params.headSlug;
    const courseBody = req.body;
    const headCourse = await courseService.getCourseBySlug(headCourseSlug);
    console.log(headCourseSlug);
    await tutorialService.getTutorialBySlug(headCourse.tutorialCategory);
    await courseService.courseSlugIsExist(req.body.slug);
    const result = await courseService.createSubsetCourse(courseBody, headCourse);
    res.status(httpStatus.CREATED).send(result);
});


const getHeadCourse = catchAsync(async(req, res) => {
    const courses = await courseService.getHeadCourse();
    res.status(httpStatus.OK).send(courses);
});

const getSubCourse = catchAsync(async(req, res) => {
    const headSlug = req.params.headSlug;
    const subCourse = await courseService.getSubCourse(headSlug);
    res.status(httpStatus.OK).send(subCourse);
});

const getCourseBySlug = catchAsync(async(req, res) => {
    const slug = req.params.slug;
    const course = await courseService.getCourseBySlug(slug);
    res.status(httpStatus.OK).send(course);
});

const deleteCourseBySlug = catchAsync(async(req, res) => {
    const slug = req.params.slug;
    const deleteCourse = await courseService.deleteCourseBySlug(slug);
    res.status(httpStatus.OK).send(deleteCourse);
});


module.exports = {
    createHeadCourse,
    createSubsetHeadCourse,
    getHeadCourse,
    getSubCourse,
    getCourseBySlug,
    deleteCourseBySlug
};

