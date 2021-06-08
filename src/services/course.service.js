const httpStatus = require('http-status');
const { courseService } = require('.');
const { Course, Task } = require('../models');
const ApiError = require('../utils/ApiError');
const { slsp, arrayShow } = require('../utils/defaultArrayType');


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
    await getCourseBySlug(slug);    
    const {sort, limit, skip, page} = slsp(options);


    const tasks = await Task.find({ course: slug })
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(tasks, limit, page);
    return result;
};



const getQuizesByCourseSlug = async(slug, options) => {
    await getCourseBySlug(slug);    
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ course: slug })
    .select('title quizes')
    .sort(sort).skip(skip).limit(limit).exec()

    const taskModel = [];

    tasks.forEach(async(task) => {
        if(task.videos.length > 0) {
            taskModel.push(task)
        }
    })

    const result = arrayShow(taskModel, limit, page);

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