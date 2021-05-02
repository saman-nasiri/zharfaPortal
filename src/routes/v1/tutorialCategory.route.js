const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tutorialCategoryController = require('../../controllers/tutorialCategory.controller');
const { route } = require('./task.route');


const router = express.Router();

router
    .route('/create-main')
        .post(tutorialCategoryController.createTutorialMainCategory)

router
    .route('/create-sub/:mainTutorial')
        .post(tutorialCategoryController.createTutorialSubCategory)

router
    .route('/showMain')
        .get(tutorialCategoryController.getMainTutorial)

router
    .route('/showSub/:mainSlug')
        .get(tutorialCategoryController.getSubMainTutorial)

router
    .route('/showOne/:slug')
        .get(tutorialCategoryController.getTutorialBySlug)

router
    .route('/delete/:slug')
        .delete(tutorialCategoryController.deleteTutorialBySlug)



module.exports = router;