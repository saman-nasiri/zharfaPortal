const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const supervisorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    biography: String,
    avatar: String,
    tutorialCategory: Array,
    termCode: Array,
    termsId:   [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' } ],


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
        enum: roles,
        default: 'supervisor'
    },
});


// add plugin that converts mongoose to json
supervisorSchema.plugin(toJSON);
supervisorSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} phoneNumber - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
supervisorSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
  };

  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
supervisorSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

supervisorSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const Supervisor = mongoose.model('supervisor', supervisorSchema);

module.exports = Supervisor;