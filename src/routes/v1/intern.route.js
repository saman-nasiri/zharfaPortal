const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const internController = require('../../controllers/intern.controller');
const internValidation = require('../../validations/intern.validation');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_INTERN), validate(internValidation.createIntern), internController.createIntern)

router
    .route('/profile/:internId')
        .get(auth(scope.READ_INTERN_DETAILS), validate(internValidation.getInternById), internController.getInternById);
        
router
    .route('/update/:internId')
        .post(auth(scope.UPDATE_INTERN), validate(internValidation.updateInternById), internController.updateIntern)

router
    .route('/delete/:internId')
        .delete(auth(scope.DELETE_INTERN), validate(internValidation.deleteIntern), internController.deleteIntern)

router
    .route('/upload-avatar/:internId')
        .put(auth(scope.UPLOAD_INTERN_AVATAR), validate(internValidation.uploadAvatar), internController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_INTERN), validate(internValidation.changePassword), internController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_INTERNS), internController.getInterns)

router
    .route('/terms/:internId')
        .get(internController.getInternTerms)


module.exports = router;