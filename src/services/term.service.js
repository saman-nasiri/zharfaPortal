const httpStatus = require('http-status');
const { Term, Intern, Mentor, Week } = require('../models');
const { weekProgressbar } = require('../services/week.service');
const ApiError = require('../utils/ApiError');
const { slsp, arrayShow } = require('../utils/defaultArrayType');


const createTerm = async(termBody, tutorialCategory) => {
    
    const term = await Term.create({
        title: termBody.title,
        tutorialCategory: tutorialCategory.category,
        termCode: termBody.termCode,
        description: termBody.description,
        startAt: new Date().toISOString()
    });

    return term;
};


const addInternsToTheTerm = async(term, internsList) => {
    const interns = await Intern.updateMany({ _id: internsList }, { "$addToSet": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true });

    return "updateIntern";
};

const removeInternsFromTheTerm = async(term, internsList) => {
    const interns = await Intern.updateMany({ _id: internsList }, { "$pull": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true })
};

const addMentorToTheTerm = async(term, mentorsList) => {
    const mentors = await Mentor.updateMany({ _id: mentorsList }, { "$addToSet": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true });
    
    const updateTerm = await Term.findById(term._id);
    return updateTerm;
};

const removeMentorsFromTheTerm = async(term, mentorsList) => {
    const mentors = await Mentor.updateMany({ _id: mentorsList }, { "$pull": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true });
    
    return "updateMentor";
};

const addWeekToTheTerm = async(term, weeksList) => {
    
    const updateTerm = await Term.updateOne({ _id: term._id }, {"$addToSet": {
        "weeksList": weeksList,
    }}, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    }); 
    
    const weeks = await Week.updateOne({ _id: weeksList }, { "$set": {
        "tutorialCategory": term.tutorialCategory,
    }}, { "new": true, "upsert": true });

    return updateTerm;
};

const updateTerm = async(term, updateBody) => {
    const result  = await Term.updateOne({ _id: term._id }, { "$set": updateBody }, { "new": true, "upsert": true }); ;
    
    return result;
};

const getTerms = async(filter, options) => {
    const terms = await Term.paginate(filter, options);
    if(!terms) { throw new ApiError(httpStatus.NOT_FOUND, 'TermsIsNotFound')};
    return terms;
};

const getTermById = async(termId) => {
    const term = await Term.findOne({ _id: termId });
    if(!term) { throw new ApiError(httpStatus.NOT_FOUND, 'TermsIsNotFound')};
    return term;
};

const deleteTermById = async(termId) => {
    const result = await Term.deleteOne({ _id: termId})
    return result;
};

const getTermWeeks = async(termId, internId, options) => {
    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const weeks = await Term.findOne({ _id: termId }).lean()

    .populate('weeksList')
    .select('weekList -_id')
    .sort(sort).skip(skip).limit(limit).exec()


    let weeksList = weeks.weeksList;

    const weeksModel = await Promise.all(
        weeksList.map(async(week) => {
            const progressbar = await weekProgressbar(week, internId);
            week["progressbar"] = progressbar.progressbar;
            return week;
        })
    )
    
    const result = arrayShow(weeksModel, limit, page);
    return weeks;
}; 


const getTermInterns = async(termId, options) => {

    const {sort, limit, skip, page} = slsp(options);

    const interns = await Intern.find({ termsList: {  $in: termId } }).lean()
    .select('_id firstName lastName email phoneNumber avatar')
    .sort(sort).skip(skip).limit(limit).exec()

    const terms = await Term.findOne({ _id: termId }).lean()
    .populate('weeksList')
    .select('weekList -_id')
    .sort(sort).skip(skip).limit(limit).exec()

    let weeksList = terms.weeksList;

    const internsmodel = await Promise.all(
        interns.map(async(intern) => {
        const termProgressBar = await Promise.all(
            weeksList.map(async(week) => {
                const progressbar = await weekProgressbar(week, intern._id);
                termProgressBarTotal =+ progressbar.progressbar;
                return termProgressBarTotal;
            })
        )
        const totalTermProgressBar = termProgressBar.reduce((total, value) => { return total + value })
        intern["termProgresbar"] = totalTermProgressBar;
        return intern;
      })
    );

    const result = arrayShow(internsmodel, limit, page);

    return result;
};

const removeWeekFromTerm = async(termId, weekId) => {
    const updateTerm = await Term.updateOne({ _id: termId }, { "$pull": {
        "weeksList": weekId
    }}, { "new": true, "upsert": true })

    return updateTerm;
};


module.exports = {
    createTerm,
    addInternsToTheTerm,
    removeInternsFromTheTerm,
    addMentorToTheTerm,
    removeMentorsFromTheTerm,
    addWeekToTheTerm,
    updateTerm,
    getTerms,
    getTermById,
    deleteTermById,
    getTermWeeks,
    getTermInterns,
    removeWeekFromTerm,
};