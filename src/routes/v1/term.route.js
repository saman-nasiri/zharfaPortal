const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const termController = require('../../controllers/term.controller');
const { route } = require('./task.route');

const router = express.Router();

router
    .route('/create')
        .post(termController.createTerm)

router
    .route('/update/:termId')
        .put(termController.updateTerm)
        
router
    .route('/add-interns/:termId')
        .post(termController.addInternsToTheTerm)

router
    .route('/remove-interns/:termId')
        .post(termController.removeInternsFromTheTerm)

router
    .route('/add-mentors/:termId')
        .post(termController.addMentorsToTheTerm)

router
    .route('/remove-mentors/:termId')
        .post(termController.removeMentorsFromTheTerm)

router
    .route('/')
        .get(termController.getTerms)

router
    .route('/:termId')
        .get(termController.getTermById)

router
    .route('/delete/:termId')
        .get(termController.deleteTermById)

module.exports = router;