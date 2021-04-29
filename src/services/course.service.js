const httpStatus = require('http-status');
const { Course } = require('../models');
const ApiError = require('../utils/ApiError');

const createHeadCourse = async(courseBody, tutorialCategory) => {
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

const getCourseBySlug = async(courseSlug) => {
    const course = await Course.findOne({ slug: courseSlug });
    return course;
};

module.exports = {
    createHeadCourse,
    createSubsetCourse,
    getCourseBySlug
};