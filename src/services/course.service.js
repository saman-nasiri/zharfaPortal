const httpStatus = require('http-status');
const { courseService } = require('.');
const { Course, Task } = require('../models');
const ApiError = require('../utils/ApiError');
const { slsp, arrayShow } = require('../utils/defaultArrayType');


const createHeadCourse = async(courseBody, tutorial) => {
    const course = await Course.create({
        title: courseBody.title,
        slug: courseBody.slug,
        tutorialCategory: tutorial.category, //add from dropDoen tutorialCategory list
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

const getHeadCourse = async(options) => {
    const {sort, limit, skip, page} = slsp(options);

    const courses = await Course.find({ parent: '/' })
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(courses, limit, page);
    return result;
};


const getSubCourse = async(headSlug, options) => {
    const {sort, limit, skip, page} = slsp(options);

    const course = await Course.findOne({ slug: headSlug });
    const subCourses = await Course.find({ parent: { $in: [new RegExp('^' + course.parent)] } })
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(subCourses, limit, page);
    return result;
};


const getCourseBySlug = async(courseSlug) => {
    const course = await Course.findOne({ slug: courseSlug });
    if(!course) { throw new ApiError(httpStatus.NOT_FOUND, 'CourseNotFound'); };
    return course;
};

const getCourseById = async(courseId) => {
    const course = await Course.findOne({ _id: courseId });
    if(!course) { throw new ApiError(httpStatus.NOT_FOUND, 'CourseNotFound'); };
    return course;
};

const updateCourseById = async(courseId, updateBody) => {
    await getCourseById(courseId);
    const updateCourse = await Course.updateOne({ _id: courseId }, { "$set": updateBody }, { "new": true, "upsert": true });
    return updateCourse;
};

const deleteCourseBySlug = async(courseId) => {
    const course = await Course.findOne({ _id: courseId });
    if(!course) { throw new ApiError(httpStatus.NOT_FOUND, "CourseNotFound")}
    const deleteCourse = await Course.deleteMany({ category: { $in: [new RegExp('^' + course.category)] } });
    return deleteCourse;
};


const courseSlugIsExist = async(slug) => {
    if(await Course.findOne({ slug: slug })) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'SlugIsAlreadyExist')
    }
};

const getTaskByCourseSlug = async(slug, options) => {
    const course = await getCourseBySlug(slug);    
    const {sort, limit, skip, page} = slsp(options);


    const tasks = await Task.find({ course: course.category })
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(tasks, limit, page);
    return result;
};



const getQuizesByCourseSlug = async(slug, options) => {
    const course = await getCourseBySlug(slug);    
    const {sort, limit, skip, page} = slsp(options);

    console.log('course.category:', course.category);

    const tasks = await Task.find({ "$and": [{ course: course.category }, { "$or": [{discriptiveQuiz: true}, { testQuiz: true }] } ]})
    .select('title order')
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(tasks, limit, page);

    return result;
};


module.exports = {
    createHeadCourse,
    createSubsetCourse,
    getHeadCourse,
    getSubCourse,
    getCourseBySlug,
    updateCourseById,
    deleteCourseBySlug,
    courseSlugIsExist,
    getTaskByCourseSlug,
    getQuizesByCourseSlug
};