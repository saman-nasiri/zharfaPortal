const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const supervisorController = require('../../controllers/supervisor.controller');
const supervisorValidation = require('../../validations/index');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_SUPERVISOR), validate(supervisorValidation.createSupervisor), supervisorController.createSupervisor)

router
    .route('/update/:supervisorId')
        .put(auth(scope.UPDATE_SUPERVISOR), validate(supervisorValidation.updateSupervisor), supervisorController.updateSupervisor)

router
    .route('/delete/:supervisorId')
        .delete(auth(scope.DELETE_SUPERVISOR), validate(supervisorValidation.deleteSupervisor), supervisorController.deleteSupervisor)

router
    .route('/upload-avatar/:supervisorId')
        .put(auth(scope.UPLOAD_SUPERVISOR_AVATAR), validate(supervisorValidation.UPLOAD_SUPERVISOR_AVATAR), supervisorController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_SUPERVISOR), validate(supervisorValidation.changePassword), supervisorController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_SUPERVISORS), supervisorController.getSupervisor)

router
    .route('/:supervisorId')
        .get(auth(scope.READ_SUPERVISOR_DETAILS), validate(supervisorValidation.getSupervisorById), supervisorController.getSupervisorById)

module.exports = router;