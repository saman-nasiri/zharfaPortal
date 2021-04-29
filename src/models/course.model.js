const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const courseSchema = mongoose.Schema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    tutorialCategory: {
        type: String,
        trim: true
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
courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

courseSchema.statics.isCategorySlugTaken = async function (slug) {
    const category = await this.findOne({ slug });
    return !!category;
};


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;