const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const courseController = require('../../controllers/course.controller');
const courseValidation = require('../../validations/course.validation');
const courseService = require('../../services/course.service');

const router = express.Router();

router
    .route('/create-head')
        .post(auth(scope.CREATE_COURSE), validate(courseValidation.createHeadCourse), courseController.createHeadCourse)

router
    .route('/create-sub/:headSlug')
        .post(auth(scope.CREATE_COURSE), validate(courseValidation.createSubHeadCourse), courseController.createSubsetHeadCourse)

router
    .route('/headCourse')
        .get(auth(scope.READ_COURSES), courseController.getHeadCourse)

router
    .route('/subCourse/:headSlug')
        .get(auth(scope.READ_COURSES), validate(courseValidation.getSubCourse), courseController.getSubCourse)

router
    .route('/:slug')
        .get(auth(scope.READ_COURSE_DETAILS), validate(courseValidation.getCourseBySlug), courseController.getCourseBySlug)

router
    .route('/update/:courseId')
        .put(auth(scope.UPDATE_COURSE), validate(courseValidation.updateCourseById), courseController.updateCourseById)

router
    .route('/delete/:courseId')
        .delete(auth(scope.DELETE_COURSE), validate(courseValidation.deleteCourse), courseController.deleteCourseBySlug)

router
    .route('/lessons/:courseSlug')
        .get(courseController.getTaskByCourseSlug);

router
    .route('/quizes/:courseSlug')
        .get(courseController.getQuizesByCourseSlug)



module.exports = router;