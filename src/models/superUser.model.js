const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const superUserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    biography: String,
    avatar: String,
    tutorialCategory: Array,
    termsList:   [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' } ],


    password: {
        type: String,
        trim:true,
        minlength: 3,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true,// used by the toJSON plugin
    },

    phoneNumber: {
        type: String,
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
        enum: ['owner', 'admin', 'mentor', 'supervisor']
    },
});


// add plugin that converts mongoose to json
superUserSchema.plugin(toJSON);
superUserSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
superUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };

/**
 * Check if email is taken
 * @param {string} phoneNumber - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
superUserSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
};

  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
superUserSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

superUserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const superUser = mongoose.model('superUser', superUserSchema);

module.exports = superUser;