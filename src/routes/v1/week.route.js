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
        .get(weekController.recordWeekScore)

router
    .route('/action/viewCount/:weekId')
        .get(weekController.recordWeekViewCount)

        
module.exports = router;