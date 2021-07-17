const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const internSchema = mongoose.Schema({

    firstName: String,
    lastName: String,
    avatar: String,
    birthday: Date,
    skills: String,
    major: String,
    businessStory: String,
    inspirationalCharacters: String,
    inspirationalSentences: String,
    lastBooks: String,
    favoriteMovies: String,
    tutorialCategory: Array,
    termCode: Array,
    termsList : [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' } ],

    sex: {
        type: String,
        enum: ['male', 'female']
    },
    
    maritalStatus: {
        type: String,
        enum: ['single', 'married']
    },

    password: {
        type: String,
        trim:true,
        private: true,// used by the toJSON plugin
    },

    phoneNumber: {
        type: String,
        unique: true,
        trim: true,
        validate: /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },

    role: {
        type: String,
        // enum: roles,
        default: 'intern'
    },
    
    bloodType: {
        type: String,
        enum: ['A', 'B', 'AB', 'O']
    },

    jobStatus: {
        type: String,
        enum: ['student', 'employed']
    },

    degree: {
        type: String,
        enum: ['diploma', 'associateDiploma', 'bachelor', 'masters','Ph.D']
    },
    
    province: String,
    city: String,
    webSite: String,
    virgool: String,
    twitter: String,
    linkedin: String,
    instagram: String
    
},
{
    timestamps: true
});

// add plugin that converts mongoose to json
internSchema.plugin(toJSON);
internSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
internSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };

/**
 * Check if email is taken
 * @param {string} phoneNumber - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
internSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
  };

  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
internSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

internSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const Intern = mongoose.model('Intern', internSchema);


module.exports = Intern;