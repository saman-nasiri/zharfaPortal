const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const tutorialCategoryController = require('../../controllers/tutorialCategory.controller');
const { route } = require('./task.route');


const router = express.Router();

router
    .route('/create-main')
        .post(auth(scope.CREATE_TUTORIAL_CATEGORY), tutorialCategoryController.createTutorialMainCategory)

router
    .route('/create-sub/:mainTutorial')
        .post(auth(scope.CREATE_TUTORIAL_CATEGORY), tutorialCategoryController.createTutorialSubCategory)

router
    .route('/showMain')
        .get(auth(scope.READ_TUTORIALS), tutorialCategoryController.getMainTutorial)

router
    .route('/showSub/:mainSlug')
        .get(auth(scope.READ_TUTORIALS), tutorialCategoryController.getSubMainTutorial)

router
    .route('/:slug')
        .get(auth(scope.READ_TUTORIALS), tutorialCategoryController.getTutorialBySlug)

router
    .route('/delete/:slug')
        .delete(auth(scope.DELETE_TUTORIAL), tutorialCategoryController.deleteTutorialBySlug)



module.exports = router;