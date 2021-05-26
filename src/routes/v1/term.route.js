const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const termController = require('../../controllers/term.controller');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_TERM), termController.createTerm)

router
    .route('/update/:termId')
        .put(auth(scope.UPDATE_TERM), termController.updateTerm)
        
router
    .route('/add-interns/:termId')
        .post(auth(scope.ADD_TERM_INTERN), termController.addInternsToTheTerm)

router
    .route('/remove-interns/:termId')
        .post(auth(scope.REMOVE_TERM_INTERN), termController.removeInternsFromTheTerm)

router
    .route('/add-mentors/:termId')
        .post(auth(scope.ADD_TERM_MENTOR), termController.addMentorsToTheTerm)

router
    .route('/remove-mentors/:termId')
        .post(auth(scope.REMOVE_TERM_MENTOR), termController.removeMentorsFromTheTerm)

router
    .route('/')
        .get(auth(scope.READ_TERMS), termController.getTerms)

router
    .route('/:termId')
        .get(auth(scope.READ_TERM_DETAILS), termController.getTermById)

router
    .route('/remove-week/:termId/:weekId')
        .post(auth(scope.REMOVE_TERM_WEEK), termController.removeWeekFromTerm)

router
    .route('/delete/:termId')
        .get(auth(scope.DELETE_TERM), termController.deleteTermById)

router
    .route('/weeks/:termId')
        .get(auth(scope.READ_TERM_WEEKS), termController.getTermWeeksById)


module.exports = router;