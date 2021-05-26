const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const internController = require('../../controllers/intern.controller');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_INTERN), internController.createIntern)


// router
//     .route('/:internId')
//         .get(auth(scope.READ_INTERN_DETAILS), internController.getInternById);

router
    .route('/:termId')
        .get(internController.getTermInterns)


router
    .route('/update/:internId')
        .post(auth(scope.UPDATE_INTERN), internController.updateIntern)

router
    .route('/delete/:internId')
        .delete(auth(scope.DELETE_INTERN), internController.deleteIntern)

router
    .route('/upload-avatar/:internId')
        .put(auth(scope.UPLOAD_INTERN_AVATAR), internController.uploadAvatar)

router
    .route('/change-password')
        .put(auth(scope.CHANGE_PASSWORD_INTERN), internController.changePassword)

router
    .route('/')
        .get(auth(scope.READ_INTERNS), internController.getInterns)




module.exports = router;