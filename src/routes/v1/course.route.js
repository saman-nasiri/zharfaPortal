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
    .route('/create-subhead/:headCourse')
        .post(courseController.createSubsetHeadCourse)

module.exports = router;