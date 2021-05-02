const httpStatus = require('http-status');
const { courseService } = require('.');
const { Course } = require('../models');
const ApiError = require('../utils/ApiError');

const createHeadCourse = async(courseBody) => {
    const course = await Course.create({
        title: courseBody.title,
        slug: courseBody.slug,
        tutorialCategory: courseBody.tutorialCategory, //add from dropDoen tutorialCategory list
        category: `/${courseBody.slug}`,
        parent: '/',
    });
    
    return course;
};

const createSubsetCourse = async(courseBody, headCourse) => {
    const course = await Course.create({
        title: courseBody.title,
        slug: courseBody.slug,
        tutorialCategory: headCourse.tutorialCategory, //add from dropDoen tutorialCategory list
        category: `${headCourse.category}/${courseBody.slug}`,
        parent: `${headCourse.category}`,
    });
    
    return course;
};

const getHeadCourse = async() => {
    const course = await Course.find({ parent: '/' });
    return course;
};


const getSubCourse = async(headSlug) => {
    const course = await Course.findOne({ slug: headSlug });
    const subCourses = await Course.find({ parent: { $in: [new RegExp('^' + course.parent)] } });
    return subCourses;
};


const getCourseBySlug = async(courseSlug) => {
    const course = await Course.findOne({ slug: courseSlug });
    if(!course) { throw new ApiError(httpStatus.NOT_FOUND, 'CourseNotFound'); };
    return course;
};

const deleteCourseBySlug = async(slug) => {
    const course = await Course.findOne({ slug: slug });
    if(!course) { throw new ApiError(httpStatus.NOT_FOUND, "CourseNotFound")}
    const deleteCourse = await Course.deleteMany({ category: { $in: [new RegExp('^' + course.category)] } });
    return deleteCourse;
};

const courseSlugIsExist = async(slug) => {
    if(await Course.findOne({ slug: slug })) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'SlugIsAlreadyExist')
    }
};

module.exports = {
    createHeadCourse,
    createSubsetCourse,
    getHeadCourse,
    getSubCourse,
    getCourseBySlug,
    deleteCourseBySlug,
    courseSlugIsExist
};