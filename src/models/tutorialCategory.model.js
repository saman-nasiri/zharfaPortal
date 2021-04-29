const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const tutorialCategorySchema = mongoose.Schema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    category: {
        type: String,
        trim: true
    },
    parent: {
        type: String
    },
    icon: {
        type: String,
    },
    cover: {
        type: String
    }
});

// add plugin that converts mongoose to json
tutorialCategorySchema.plugin(toJSON);
tutorialCategorySchema.plugin(paginate);

tutorialCategorySchema.statics.isCategorySlugTaken = async function (slug) {
    const category = await this.findOne({ slug });
    return !!category;
};


const TutorialCategory = mongoose.model('TutorialCategory', tutorialCategorySchema);

module.exports = TutorialCategory;