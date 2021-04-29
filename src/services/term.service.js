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
    
    // const updateTerm = await Term.updateOne({ _id: term._id }, {"$addToSet": {
    //     "internsList": internsList,
    // }}, { "new": true, "upsert": true },
    // function(err) {
    //     if(!err) {console.log('Update');}
    //     if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    // }); 
    
    const interns = await Intern.updateMany({ _id: internsList }, { "$addToSet": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
    }}, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });

    const updateTerm = await Term.findById(term._id);
    return updateTerm;
};

const addMentorToTheTerm = async(term, mentorsList) => {
    
    // const updateTerm = await Term.updateOne({ _id: term._id }, {"$addToSet": {
    //     "mentorsList": mentorsList,
    // }}, { "new": true, "upsert": true },
    // function(err) {
    //     if(!err) {console.log('Update');}
    //     if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    // }); 
    
    const mentors = await Mentor.updateMany({ _id: mentorsList }, { "$set": {
        tutorialCategory: term.tutorialCategory,
    }}, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });
    
    const updateTerm = await Term.findById(term._id);
    return updateTerm;
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
    }}, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    });

    return updateTerm;
};


const getTerm = async(termId) => {
    const term = await Term.findById(termId);
    return term;
};

const updateTerm = async(term, updateBody) => {
    const result  = await Term.updateOne({ _id: term._id }, { "$set": updateBody }, { "new": true, "upsert": true },
    function(err) {
        if(!err) {console.log('Update');}
        if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
    }); ;
    
    return result;
};

module.exports = {
    createTerm,
    addInternsToTheTerm,
    addMentorToTheTerm,
    addWeekToTheTerm,
    getTerm,
    updateTerm
};