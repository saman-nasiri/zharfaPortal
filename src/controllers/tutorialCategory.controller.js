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
    const mainTutorial = await tutorialCategoryService.getTutorialBySlug(mainTutorialSlug);
    if(!mainTutorial) { throw new ApiError(httpStatus.NOT_FOUND, 'TutorialNotFound'); };
    const result = await tutorialService.createTutorialSubCategory(tutorialBody, mainTutorial);
    res.status(httpStatus.CREATED).send(result);
});

const getMainTutorial = catchAsync(async(req,res) => {
    const mainsTutorial = await tutorialService.getMainTutorial();
    res.status(httpStatus.OK).send(mainsTutorial);
});

const getSubMainTutorial = catchAsync(async(req,res) => {
    const mainSlug = req.params.mainSlug;
    const subTutorial = await tutorialService.getSubMainTutorial(mainSlug);
    res.status(httpStatus.OK).send(subTutorial);
});

const getTutorialBySlug = catchAsync(async(req,res) => {
    const slug = req.params.slug;
    const tutorial = await tutorialService.getTutorialBySlug(slug);
    res.status(httpStatus.OK).send(tutorial);
});

const deleteTutorialBySlug = catchAsync(async(req, res) => {
    const slug = req.params.slug;
    const deleteTutorial = await tutorialService.deleteTutorialBySlug(slug);
    res.status(httpStatus.OK).send(deleteTutorial);
});


module.exports = {
    createTutorialMainCategory,
    createTutorialSubCategory,
    getMainTutorial,
    getSubMainTutorial,
    getTutorialBySlug,
    deleteTutorialBySlug
};