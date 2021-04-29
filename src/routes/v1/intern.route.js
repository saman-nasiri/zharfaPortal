const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const internController = require('../../controllers/intern.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(internController.createIntern)

router
    .route('/update/:internId')
        .post(internController.updateIntern)

module.exports = router;