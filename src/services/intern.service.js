const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Intern } = require('../models');
const ApiError = require('../utils/ApiError');
const { toJSON, paginate } = require('../models/plugins/index');
const { slsp, arrayShow } = require('../utils/defaultArrayType');

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


const updateIntern = async(intern, updateBody) => {

    if(updateBody.password) { delete updateBody["password"] };
    const result = await Intern.updateOne({ _id: intern._id }, {"$set": updateBody }, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });  

    return result;
};

const deleteIntern = async(internId) => {
    const result = await Intern.deleteOne({_id: internId});
    return result;
};

const getInternById = async(internId) => {
    const intern = await Intern.findById(internId);
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



const getTermInterns = async(termId, options) => {

    const {sort, limit, skip, page} = slsp(options);

    const interns = await Intern.find({ termsList: {  $in: termId } }).lean()
    .select('_id firstName lastName email phoneNumber avatar')
    .sort(sort).skip(skip).limit(limit).exec()

    // let weeksList = weeks.weeksList;

    // const weeksModel = await Promise.all(
    //     weeksList.map(async(week) => {
    //         const progressbar = await weekProgressbar(week, internId);
    //         week["progressbar"] = progressbar.progressbar;
    //         return week;
    //     })
    // )

    const result = arrayShow(interns, limit, page);

    return result;
};


module.exports = {
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,
    uploadAvatar,
    getInternByEmail,
    changePassword,
    queryInterns,
    getTermInterns
};