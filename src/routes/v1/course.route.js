const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const courseController = require('../../controllers/course.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create-head')
        .post(courseController.createHeadCourse)

router
    .route('/create-sub/:headSlug')
        .post(courseController.createSubsetHeadCourse)

router
    .route('/showHead')
        .get(courseController.getHeadCourse)

router
    .route('/showSub/:headSlug')
        .get(courseController.getSubCourse)

router
    .route('/showOne/:slug')
        .get(courseController.getCourseBySlug)

router
    .route('/delete/:slug')
        .delete(courseController.deleteCourseBySlug)

module.exports = router;