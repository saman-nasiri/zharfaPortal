const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const supervisorController = require('../../controllers/supervisor.controller');

const router = express.Router();

router
    .route('/create')
        .post(supervisorController.createSupervisor)

router
    .route('/update/:supervisorId')
        .put(supervisorController.updateSupervisor)

router
    .route('/delete/:supervisorId')
        .delete(supervisorController.deleteSupervisor)

router
    .route('/upload-avatar/:supervisorId')
        .put(supervisorController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_SUPERVISOR), supervisorController.changePassword)

module.exports = router;