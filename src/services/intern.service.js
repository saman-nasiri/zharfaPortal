const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Intern } = require('../models');
const ApiError = require('../utils/ApiError');
const { toJSON, paginate } = require('../models/plugins/index');
const { slsp, arrayShow } = require('../utils/defaultArrayType');
const geoData = require('@nimahkh/iran_beauty');
const { v4: uuidv4 } = require('uuid');


const createIntern = async(internBody) => {
    if (await Intern.isEmailTaken(internBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'EmailAlreadyTaken');
    };
    const intern = await Intern.create({
        firstName: internBody.firstName,
        lastName: internBody.lastName,
        email: internBody.email,
        password: internBody.password,
        phoneNumber: internBody.phoneNumber,
    });

    return intern;
};


const updateIntern = async(internId, updateBody) => {
    if(updateBody.password) { delete updateBody["password"] };
    await Intern.updateOne({ _id: internId }, {"$set": updateBody }, { "new": true, "upsert": true });  
    const result = await getInternById(internId);
    return result;
};

const deleteIntern = async(internId) => {
    const result = await Intern.deleteOne({_id: internId});
    return result;
};

const getInternById = async(internId) => {
    const intern = await Intern.findById(internId);
    if(!intern) { throw new ApiError(httpStatus.NOT_FOUND, 'InternNotFound')};
    return intern;
};


const uploadAvatar = async(internId, imageDetails) => {
    const result = await Intern.updateOne({ _id: internId }, { "$set": {
        avatar: imageDetails.filename
    }}, { "new": true, "upsert": true });

    return result;
};


const getInternByEmail = async(email) => {
    const intern = await Intern.findOne({ email: email });
    return intern;
};


const getInternByPhoneNumber = async(phoneNumber) => {
    const intern = await Intern.findOne({ phoneNumber: phoneNumber });
    return intern;
};


const changePassword = async(internId, passwordBody) => {
    const intern = await Intern.findOne({ _id: internId });
    const newPassword = await bcrypt.hash(passwordBody.newPassword, 8);

    if (!(await intern.isPasswordMatch(passwordBody.currentPassword))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'IncorrectPassword');
    };

    const updatePassword = await Intern.updateOne({ _id: internId }, { "$set": {
        password: newPassword
    }}, { "new": true, "upsert": true });

    return updatePassword;
};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInterns = async (filter, options) => {
    const interns = await Intern.paginate(filter, options);
    return interns;
};


const getInternTerms = async(internId, options) => {
    await getInternById(internId);
    const {sort, limit, skip, page} = slsp(options);

    const terms = await Intern.findOne({ _id: internId }).lean()
    .populate('termsList')
    .select('termsList -_id')
    .sort(sort).skip(skip).limit(limit).exec()

    const result = arrayShow(terms.termsList, limit, page);
    return result;
};

const getProvince = async() => {
    const province = await geoData.getProvinces();
    return province;
};

const getCities = async(provinceId) => {
    const cities = await geoData.getCities(provinceId);
    return cities;
};

const createGuestModel = async() => {
    const randomName = uuidv4();
    console.log(randomName);
    const guestModel = {
        firstName: 'Guest',
        lastName: randomName,
        email: `${randomName}@gmail.com`,
        password: 'guest123',
        phoneNumber: '+989121112233',
    }

    return guestModel;
}

module.exports = {
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,
    uploadAvatar,
    getInternByEmail,
    getInternByPhoneNumber,
    changePassword,
    queryInterns,
    getInternTerms,
    getProvince,
    getCities,
    createGuestModel
};