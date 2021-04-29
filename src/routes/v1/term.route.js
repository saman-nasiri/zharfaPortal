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
    .route('/add-mentors/:termId')
        .post(termController.addMentorsToTheTerm)



module.exports = router;