const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(adminController.createAdmin)


module.exports = router;