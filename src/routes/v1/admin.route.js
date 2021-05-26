const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_ADMIN), auth(scope.CREATE_ADMIN), adminController.createAdmin)

router
    .route('/update/:adminId')
        .put(auth(scope.UPDATE_ADMIN), adminController.updateAdmin)

router
    .route('/delete/:adminId')
        .delete(auth(scope.DELETE_ADMIN), adminController.deleteAdmin)

router
    .route('/upload-avatar/:adminId')
        .put(auth(scope.UPLOAD_ADMIN_AVATAR), adminController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_ADMIN), adminController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_ADMINS), adminController.getAdmins)

router
    .route('/:adminId')
        .get(auth(scope.READ_ADMIN_DETAILS), adminController.getAdminById);

module.exports = router;