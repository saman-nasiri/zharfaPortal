const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const internController = require('../../controllers/intern.controller');
const internValidation = require('../../validations/intern.validation');
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minut window
    max: 2, // start blocking after 2 requests
    message:
      "Too many accounts created from this IP, please try again after an 10 minute"
});


const router = express.Router();

router
    .route('/create')
        .post(validate(internValidation.createIntern), internController.createIntern)

        // auth(scope.CREATE_INTERN),

router
    .route('/profile/:internId?')
        .get(auth(scope.READ_INTERN_DETAILS), validate(internValidation.getInternById), internController.getInternProfile);
        
router
    .route('/update/:internId?')
        .post(auth(scope.UPDATE_INTERN),validate(internValidation.updateInternById), internController.updateIntern) // validate(internValidation.updateInternById),

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

router
    .route('/create-guest')
        .post(createAccountLimiter, internController.createGuestUser)


module.exports = router;