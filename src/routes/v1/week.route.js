const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const weekController = require('../../controllers/week.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create/:termId')
        .post(auth(scope.CREATE_WEEK), weekController.createWeek)

router
    .route('/progressbar/:weekId')
        .get(auth(scope.READ_WEEK_PROGRESSBAR), weekController.weekProgressbar)

router
    .route('/action/score/:weekId')
        .post(auth(scope.SCORE_WEEK), weekController.recordWeekScore)

router
    .route('/action/viewCount/:weekId')
        .post(auth(scope.ACTION_WEEK), weekController.recordWeekViewCount)

router
    .route('/')
        .get(auth(scope.READ_WEEKS), weekController.getWeeks)

router
    .route('/:weekId')
        .get(auth(scope.READ_WEEK_DETAILS), weekController.getWeekById)

router
    .route('/tasks/:weekId')
        .get(auth(scope.READ_WEEK_TASKS), weekController.getTaskOfTheWeekByWeekId)

router
    .route('/delete/:weekId')
        .delete(auth(scope.DELETE_WEEK), weekController.deleteWeekById)

        
module.exports = router;