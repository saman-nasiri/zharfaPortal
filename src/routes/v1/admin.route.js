const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(adminController.createAdmin)

router
    .route('/update/:adminId')
        .put(adminController.updateAdmin)

router
    .route('/remove/:adminId')
        .put(adminController.deleteAdmin)

router
    .route('/upload-avatar/:adminId')
        .put(adminController.uploadAvatar)



module.exports = router;