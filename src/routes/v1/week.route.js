const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const weekController = require('../../controllers/week.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create/:termId')
        .post(weekController.createWeek)

router
    .route('/progressbar/:weekId')
        .get(weekController.weekProgressbar)

router
    .route('/action/score/:weekId')
        .post(weekController.recordWeekScore)

router
    .route('/action/viewCount/:weekId')
        .post(weekController.recordWeekViewCount)

router
    .route('/')
        .get(weekController.getWeeks)

router
    .route('/:weekId')
        .get(weekController.getWeekById)

router
    .route('/tasks/:weekId')
        .get(weekController.getTaskOfTheWeekByWeekId)

router
    .route('/delete/:weekId')
        .delete(weekController.deleteWeekById)

        
module.exports = router;