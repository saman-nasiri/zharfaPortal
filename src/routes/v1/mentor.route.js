const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const mentorController = require('../../controllers/mentor.controller');
const mentorValidation = require('../../validations/index');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_MENTOR), validate(mentorValidation.createMentor), mentorController.createMentor)

router
    .route('/update/:mentorId')
        .put(auth(scope.UPDATE_MENTOR), validate(mentorValidation.updateMentor), mentorController.updateMentor)

router
    .route('/delete/:mentorId')
        .delete(auth(scope.DELETE_MENTOR), validate(mentorValidation.deleteMentor), mentorController.deleteMentor)

router
    .route('/upload-avatar/:mentorId')
        .put(auth(scope.UPLOAD_MENTOR_AVATAR), validate(mentorValidation.uploadAvatar), mentorController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_MENTOR), validate(mentorValidation.changePassword), mentorController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_MENTORS), mentorController.getMentors)

router
    .route('/profile/:mentorId')
        .get(auth(scope.READ_MENTOR_DETAILS), validate(mentorValidation.getMentorById), mentorController.getMentorById)

module.exports = router;