const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const termController = require('../../controllers/term.controller');
const termValidation = require('../../validations/term.validation');

const router = express.Router();

router
    .route('/create')
        .post(auth(scope.CREATE_TERM), validate(termValidation.createTerm), termController.createTerm)

router
    .route('/update/:termId')
        .put(auth(scope.UPDATE_TERM), validate(termValidation.updateTerm), termController.updateTerm)
        
router
    .route('/add-interns/:termId')
        .post(auth(scope.ADD_TERM_INTERN), validate(termValidation.addInternsToTheTerm), termController.addInternsToTheTerm)

router
    .route('/remove-interns/:termId')
        .post(auth(scope.REMOVE_TERM_INTERN), validate(termValidation.removeInternsFromTheTerm), termController.removeInternsFromTheTerm)

router
    .route('/add-mentors/:termId')
        .post(auth(scope.ADD_TERM_MENTOR), validate(termValidation.addMentorsToTheTerm), termController.addMentorsToTheTerm)

router
    .route('/remove-mentors/:termId')
        .post(auth(scope.REMOVE_TERM_MENTOR), validate(termValidation.removeMentorsFromTheTerm), termController.removeMentorsFromTheTerm)

router
    .route('/')
        .get(auth(scope.READ_TERMS), termController.getTerms)

router
    .route('/:termId')
        .get(auth(scope.READ_TERM_DETAILS), validate(termValidation.getTermById), termController.getTermById)

router
    .route('/remove-week/:termId/:weekId')
        .post(auth(scope.REMOVE_TERM_WEEK), validate(termValidation.removeWeekFromTerm), termController.removeWeekFromTerm)

router
    .route('/delete/:termId')
        .get(auth(scope.DELETE_TERM), validate(termValidation.deleteTermById), termController.deleteTermById)

router
    .route('/weeks/:termId')
        .get(auth(scope.READ_TERM_WEEKS), validate(termValidation.getTermWeeks), termController.getTermWeeks)

router
    .route('/interns/:termId')
        .get(auth(scope.READ_TERM_INTERNS), validate(termValidation.getTermInterns), termController.getTermInterns)



module.exports = router;