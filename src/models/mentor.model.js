const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const mentorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    biography: String,
    avatar: String,
    tutorialCategory: Array,
    termCode: Array,
    termsId:   [ mongoose.SchemaTypes.ObjectId ],


    password: {
        type: String,
        trim:true,
        private: true,// used by the toJSON plugin
    },

    phoneNumber: {
        type: String,
        trim: true,
        validate: /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
    },

    email: {
        type: String,
        trim: true,
    },

    role: {
        type: String,
        // enum: roles,
        default: 'mentor'
    },
});


// add plugin that converts mongoose to json
mentorSchema.plugin(toJSON);
mentorSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} phoneNumber - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
mentorSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
  };

  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
mentorSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

mentorSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;