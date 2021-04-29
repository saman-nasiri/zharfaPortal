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

const getTutorialCategoryBySlug = async(tutorialSlug) => {
    const tutorial = await TutorialCategory.findOne({ slug: tutorialSlug });
    return tutorial;
};

module.exports = {
    createTutorialMainCategory,
    createTutorialSubCategory,
    getTutorialCategoryBySlug

};