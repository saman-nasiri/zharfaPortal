const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const weekController = require('../../controllers/week.controller');
const weekValidation = require('../../validations/week.validation');
const taskController = require('../../controllers/task.controller');

const router = express.Router();

router
    .route('/create/:termId')
        .post(auth(scope.CREATE_WEEK), validate(weekValidation.createWeek), weekController.createWeek)

router
    .route('/update/:weekId')
        .put(auth(scope.UPDATE_WEEK), validate(weekValidation.updateWeekById), weekController.updateWeekById)

router
    .route('/progressbar/:weekId')
        .get(auth(scope.READ_WEEK_PROGRESSBAR), validate(weekValidation.weekProgressbar), weekController.weekProgressbar)

router
    .route('/delete-action/:weekId/:internId')
        .delete(auth(scope.DELETE_WEEK_ACTION), weekController.deleteWeekProgressbar);

router
    .route('/action/score/:weekId')
        .post(auth(scope.SCORE_WEEK), validate(weekValidation.recordWeekScore), weekController.recordWeekScore)

router
    .route('/action/viewCount/:weekId')
        .post(auth(scope.ACTION_WEEK), validate(weekValidation.recordWeekViewCount), weekController.recordWeekViewCount)

router
    .route('/')
        .get(auth(scope.READ_WEEKS), weekController.getWeeks)

router
    .route('/:weekId')
        .get(auth(scope.READ_WEEK_DETAILS), validate(weekValidation.getWeekById), weekController.getWeekById)

router
    .route('/tasks/:weekId')
        .get(auth(scope.READ_WEEK_TASKS), validate(weekValidation.getWeekTasks), weekController.getWeekTasks)

router
    .route('/delete/:weekId')
        .delete(auth(scope.DELETE_WEEK), weekController.deleteWeekById)
        
router
    .route('/supervisor-public-opinion/:weekId')
        .post(auth(scope.ACTION_WEEK), weekController.supervisorPublicOpinionForWeek)

router
    .route('/supervisor-private-opinion/:weekId/:internId')
        .post(auth(scope.ACTION_WEEK), weekController.supervisorPrivateOpinionForWeek)

module.exports = router;