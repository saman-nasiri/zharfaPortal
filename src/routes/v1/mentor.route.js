const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const mentorController = require('../../controllers/mentor.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_MENTOR), mentorController.createMentor)

router
    .route('/update/:mentorId')
        .put(auth(scope.UPDATE_MENTOR), mentorController.updateMentor)

router
    .route('/remove/:mentorId')
        .delete(auth(scope.DELETE_MENTOR), mentorController.deleteMentor)

router
    .route('/upload-avatar/:mentorId')
        .put(auth(scope.UPLOAD_MENTOR_AVATAR), mentorController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_MENTOR), mentorController.changePassword)

module.exports = router;