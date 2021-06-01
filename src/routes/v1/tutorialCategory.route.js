const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const tutorialCategoryController = require('../../controllers/tutorialCategory.controller');
const tutorialValidation = require('../../validations/tutorialCategory.validation');


const router = express.Router();

router
    .route('/create-main')
        .post(auth(scope.CREATE_TUTORIAL_CATEGORY), validate(tutorialValidation.createTutorialMainCategory),  tutorialCategoryController.createTutorialMainCategory)

router
    .route('/create-sub/:mainTutorial')
        .post(auth(scope.CREATE_TUTORIAL_CATEGORY), validate(tutorialValidation.createTutorialSubCategory), tutorialCategoryController.createTutorialSubCategory)

router
    .route('/mainTutorial')
        .get(auth(scope.READ_TUTORIALS), tutorialCategoryController.getMainTutorial)

router
    .route('/subTutorial/:mainSlug')
        .get(auth(scope.READ_TUTORIALS), validate(tutorialValidation.getSubTutorial), tutorialCategoryController.getSubTutorial)

router
    .route('/:slug')
        .get(auth(scope.READ_TUTORIALS), validate(tutorialValidation.getTutorialBySlug), tutorialCategoryController.getTutorialBySlug)

router
    .route('/delete/:slug')
        .delete(auth(scope.DELETE_TUTORIAL), validate(tutorialValidation.deleteTutorialBySlug), tutorialCategoryController.deleteTutorialBySlug)



module.exports = router;