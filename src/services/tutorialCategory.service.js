const httpStatus = require('http-status');
const { TutorialCategory } = require('../models');
const ApiError = require('../utils/ApiError');

const createTutorialMainCategory = async(tutorialBody) => {
    const tutorialCategory = await TutorialCategory.create({
        title: tutorialBody.title,
        slug: tutorialBody.slug,
        category: `/${tutorialBody.slug}`,
        parent: `/`,
    });
    
    return tutorialCategory;
};

const createTutorialSubCategory = async(tutorialBody, mainTutorial) => {
    const toutrial = await TutorialCategory.create({
        title: tutorialBody.title,
        slug: tutorialBody.slug,
        category: `${mainTutorial.category}/${tutorialBody.slug}`,
        parent: `${mainTutorial.category}`,
    });
    
    return toutrial;
};

const getMainTutorial = async() => {
    const mainTutorial = await TutorialCategory.find({ parent: '/' });
    return mainTutorial;
};

const getSubMainTutorial = async(mainSlug) => {
    const tutorial = await TutorialCategory.findOne({ slug: mainSlug });
    const subTutorial = await TutorialCategory.find({ parent: { $in: [new RegExp('^' + tutorial.parent)] } });
    return subTutorial;
};

const getTutorialBySlug = async(tutorialSlug) => {
    const tutorial = await TutorialCategory.findOne({ slug: tutorialSlug });
    if(!tutorial) { throw new ApiError(httpStatus.NOT_FOUND, 'TutorialNotFound') };
    return tutorial;
};

const deleteTutorialBySlug = async(slug) => {
    const tutorial = await TutorialCategory.findOne({ slug: slug });
    if(!tutorial) { throw new ApiError(httpStatus.NOT_FOUND, "TutorialCategoryNotFounded")}
    const deleteTutorial = await TutorialCategory.deleteMany({ category: { $in: [new RegExp('^' + tutorial.category)] } });
    return deleteTutorial;
};  


module.exports = {
    createTutorialMainCategory,
    createTutorialSubCategory,
    getMainTutorial,
    getSubMainTutorial,
    getTutorialBySlug,
    deleteTutorialBySlug,
};