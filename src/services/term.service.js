const httpStatus = require('http-status');
const { Term, Intern, Mentor, Week } = require('../models');
const ApiError = require('../utils/ApiError');

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
        termsId: term._id
    }}, { "new": true, "upsert": true });

    return "updateIntern";
};

const removeInternsFromTheTerm = async(term, internsList) => {
    const interns = await Intern.updateMany({ _id: internsList }, { "$pull": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsId: term._id
    }}, { "new": true, "upsert": true })
};

const addMentorToTheTerm = async(term, mentorsList) => {
    const mentors = await Mentor.updateMany({ _id: mentorsList }, { "$addToSet": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsId: term._id
    }}, { "new": true, "upsert": true });
    
    const updateTerm = await Term.findById(term._id);
    return updateTerm;
};

const removeMentorsFromTheTerm = async(term, mentorsList) => {
    const mentors = await Mentor.updateMany({ _id: mentorsList }, { "$pull": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsId: term._id
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
    const result  = await Term.updateOne({ _id: term._id }, { "$set": updateBody }, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    }); ;
    
    return result;
};

const getTerms = async() => {
    const terms = await Term.find();
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

const getWeeksOfTheTermById = async(termId) => {
    const weeks = await Term.findOne({ _id: termId })
    .populate('weeksList')
    .select('weekList -_id')

    return weeks.weeksList;
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
    getWeeksOfTheTermById,
    removeWeekFromTerm
};