const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const superUserController = require('../../controllers/superUser.controller');
const superUserValidation = require('../../validations/superUser.validation');

const router = express.Router();

router
    .route('/create-owner')
        .post(validate(superUserValidation.createOwner), superUserController.createOwner)

router
    .route('/create-superuser')
        .post(auth(scope.CREATE_SUPERUSER), validate(superUserValidation.createSuperUser), superUserController.createSuperUser)

router
    .route('/update/:userId')
        .put(auth(scope.UPDATE_SUPERUSER), validate(superUserValidation.updateSuperUserById), superUserController.updateSuperUser)

router
    .route('/delete/:userId')
        .delete(auth(scope.DELETE_SUPERUSER), validate(superUserValidation.deleteSuperUser), superUserController.deleteSuperUser)

router
    .route('/upload-avatar/:userId')
        .put(auth(scope.UPLOAD_SUPERUSER_AVATAR), validate(superUserValidation.uploadAvatar), superUserController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_SUPERUSER), validate(superUserValidation.changePassword), superUserController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_SUPERUSERS), superUserController.getSuperUsers)

router
    .route('/profile/:userId')
        .get(auth(scope.READ_SUPERUSER_DETAILS), validate(superUserValidation.getSuperUserById), superUserController.getSuperUserById)
        .put(auth(scope.UPDATE_SUPERUSER_PROFILE), validate(superUserValidation.updateSuperUserProfile), superUserController.updateSuperUserProfile)

router
    .route('/role/:role')
        .get(auth(scope.READ_SUPERUSERS), validate(superUserValidation.getSuperUserByRole), superUserController.getSuperUseByRole);

module.exports = router;