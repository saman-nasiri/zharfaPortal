const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const courseController = require('../../controllers/course.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create-head')
        .post(auth(scope.CREATE_COURSE), courseController.createHeadCourse)

router
    .route('/create-sub/:headSlug')
        .post(auth(scope.CREATE_COURSE), courseController.createSubsetHeadCourse)

router
    .route('/showHead')
        .get(auth(scope.READ_COURSES), courseController.getHeadCourse)

router
    .route('/showSub/:headSlug')
        .get(auth(scope.READ_COURSES), courseController.getSubCourse)

router
    .route('/:slug')
        .get(auth(scope.READ_COURSE_DETAILS), courseController.getCourseBySlug)

router
    .route('/update/:courseId')
        .put(auth(scope.UPDATE_COURSE), courseController.updateCourseById)

router
    .route('/delete/:courseId')
        .delete(auth(scope.DELETE_COURSE), courseController.deleteCourseBySlug)

module.exports = router;