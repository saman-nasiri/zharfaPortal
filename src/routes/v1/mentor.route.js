const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const mentorController = require('../../controllers/mentor.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(mentorController.createMentor)

module.exports = router;