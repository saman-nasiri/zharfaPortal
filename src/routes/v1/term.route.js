const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const termController = require('../../controllers/term.controller');
const termValidation = require('../../validations/term.validation');

const router = express.Router();


// Term Route
router
    .route('/create')
        .post(auth(scope.CREATE_TERM), validate(termValidation.createTerm), termController.createTerm)
router
    .route('/update/:termId')
        .put(auth(scope.UPDATE_TERM), validate(termValidation.updateTerm), termController.updateTerm)
router
    .route('/:termId')
        .get(auth(scope.READ_TERM_DETAILS), validate(termValidation.getTermById), termController.getTermById)
router
    .route('/')
        .get(auth(scope.READ_TERMS), termController.getTerms)

        

// Term Intern Route
router
    .route('/add-interns/:termId')
        .post(auth(scope.ADD_TERM_INTERN), validate(termValidation.addInternsToTheTerm), termController.addInternsToTheTerm)
router
    .route('/remove-interns/:termId')
        .post(auth(scope.REMOVE_TERM_INTERN), validate(termValidation.removeInternsFromTheTerm), termController.removeInternsFromTheTerm)
router
    .route('/interns/:termId')
        .get(auth(scope.READ_TERM_INTERNS), validate(termValidation.getTermInterns), termController.getTermInterns)



// Term Mentor Route
router
    .route('/add-mentors/:termId')
        .post(auth(scope.ADD_TERM_MENTOR), validate(termValidation.addMentorsToTheTerm), termController.addMentorsToTheTerm)
router
    .route('/remove-mentors/:termId')
        .post(auth(scope.REMOVE_TERM_MENTOR), validate(termValidation.removeMentorsFromTheTerm), termController.removeMentorsFromTheTerm)



// Term Week Route
router
    .route('/add-week/:termId/:weekId')
        .put(auth(scope.ADD_TERM_WEEK), validate(termValidation.addWeekToTerm), termController.addWeekToTerm)
router
    .route('/remove-week/:termId/:weekId')
        .put(auth(scope.REMOVE_TERM_WEEK), validate(termValidation.removeWeekFromTerm), termController.removeWeekFromTerm)
router
    .route('/weeks/:termId')
        .get(auth(scope.READ_TERM_WEEKS), validate(termValidation.getTermWeeks), termController.getTermWeeks)



// Term File Route
router
    .route('/videos/:termId')
        .get(termController.getTermVideos)


        
module.exports = router;