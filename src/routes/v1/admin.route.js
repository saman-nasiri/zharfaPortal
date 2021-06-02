const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const { route } = require('./task.route');
const adminValidation = require('../../validations/admin.validation');

const router = express.Router();

router
    .route('/create-owner')
        .post(adminController.createOwner)

router
    .route('/create-admin')
        .post(auth(scope.CREATE_ADMIN), validate(adminValidation.createAdmin), adminController.createAdmin)

router
    .route('/update/:adminId')
        .put(auth(scope.UPDATE_ADMIN), validate(adminValidation.updateAdminById), adminController.updateAdmin)

router
    .route('/delete/:adminId')
        .delete(auth(scope.DELETE_ADMIN), validate(adminValidation.deleteAdmin), adminController.deleteAdmin)

router
    .route('/upload-avatar/:adminId')
        .put(auth(scope.UPLOAD_ADMIN_AVATAR), validate(adminValidation.uploadAvatar), adminController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_ADMIN), validate(adminValidation.changePassword), adminController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_ADMINS), adminController.getAdmins)

router
    .route('/:adminId')
        .get(auth(scope.READ_ADMIN_DETAILS), validate(adminValidation.getAdminById), adminController.getAdminById);

module.exports = router;