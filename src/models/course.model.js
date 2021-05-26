const httpStatus = require('http-status');
const mongoose = require('mongoose');
const validator = require('validator');
const ApiError = require('../utils/ApiError');
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


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;