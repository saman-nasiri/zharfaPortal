const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tutorialService } = require('../services');
const upload = require('../middlewares/uploadFile');
const tutorialCategoryService = require('../services/tutorialCategory.service');

const createTutorialMainCategory = catchAsync(async(req, res) => {
    const tutorialBody = req.body;
    const result = await tutorialCategoryService.createTutorialMainCategory(tutorialBody);
    res.status(httpStatus.CREATED).send(result);
});

const createTutorialSubCategory = catchAsync(async(req, res) => {
    const mainTutorialSlug = req.params.mainTutorial;
    const tutorialBody = req.body;
    const mainTutorial = await tutorialCategoryService.getTutorialCategoryBySlug(mainTutorialSlug);
    if(!mainTutorial) { throw new ApiError(httpStatus.NOT_FOUND, 'TutorialNotFound'); };
    const result = await tutorialService.createTutorialSubCategory(tutorialBody, mainTutorial);
    res.status(httpStatus.CREATED).send(result);
});


module.exports = {
    createTutorialMainCategory,
    createTutorialSubCategory
};