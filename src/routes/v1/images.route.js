const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const weekController = require('../../controllers/week.controller');
const weekValidation = require('../../validations/week.validation');

const router = express.Router();

router
    .route('/create/:termId')
        .post(auth(scope.CREATE_WEEK), validate(weekValidation.createWeek), weekController.createWeek)

        
module.exports = router;