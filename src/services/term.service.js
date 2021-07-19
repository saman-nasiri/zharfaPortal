const httpStatus = require('http-status');
const { Term, Intern, SuperUser, Week, Task, Course, TutorialCategory } = require('../models');
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
    const mentors = await SuperUser.updateMany({ _id: mentorsList }, { "$addToSet": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true });
    
    const updateTerm = await Term.findById(term._id);
    return {
        statusCode: 200,
        message: 'Success'
    };
};

const removeMentorsFromTheTerm = async(term, mentorsList) => {
    const mentors = await SuperUser.updateMany({ _id: mentorsList }, { "$pull": {
        tutorialCategory: term.tutorialCategory,
        termCode: term.termCode,
        termsList: term._id
    }}, { "new": true, "upsert": true });
    
    return  { 
        statusCode: 200,
        message: 'Success'};
};

const addWeekToTheTerm = async(term, weeksList) => {
    
    const updateTerm = await Term.updateOne({ _id: term._id }, {"$addToSet": {
        "weeksList": weeksList,
    }}, { "new": true, "upsert": true }); 
    
    const weeks = await Week.updateOne({ _id: weeksList }, { "$set": {
        "tutorialCategory": term.tutorialCategory,
    }}, { "new": true, "upsert": true });

    return {
        statusCode: 200,
        message: 'Success'
    };
};

const updateTerm = async(term, updateBody) => {
    const result  = await Term.updateOne({ _id: term._id }, { "$set": updateBody }, { "new": true, "upsert": true }); ;
    
    return result;
};

const getTerms = async(filter, options) => {

    const terms = await Term.paginate(filter, options)
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

const getTermWeeksForIntern = async(termId, internId, options) => {
    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const weeks = await Week.find({ termId: { "$in": termId } }).lean()

    const weeksModel = await Promise.all(
        weeks.map(async(week) => {
            const progressbar = await weekProgressbar(week, internId);
            week["progressbar"] = progressbar.progressbar;
            return week;
        })
    )
    
    const result = arrayShow(weeksModel, limit, page);
    return result;
}; 

const getTermWeeks = async(termId, internId, options) => {
    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const weeks = await Week.find({ termId: { "$in": termId } }).lean()
    .sort(sort).skip(skip).limit(limit).exec()
    
    const result = arrayShow(weeks, limit, page);
    return result;
}; 


const getTermInterns = async(termId, options) => {

    const {sort, limit, skip, page} = slsp(options);

    const interns = await Intern.find({ termsList: {  "$in": termId } }).lean()
    .select('_id firstName lastName email phoneNumber avatar')
    .sort(sort).skip(skip).limit(limit).exec()

    const weeks = await Week.find({ termId: { "$in": termId } }).lean()
    .sort(sort).skip(skip).limit(limit).exec()


    const internsmodel = await Promise.all(
        interns.map(async(intern) => {
        const termProgressBar = await Promise.all(
            weeks.map(async(week) => {
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

const getTermMentors = async(termId, options) => {

    const {sort, limit, skip, page} = slsp(options);

    const mentors = await SuperUser.find({ termsList: {  "$in": termId } }).lean()
    .select('_id firstName lastName email phoneNumber avatar')
    .sort(sort).skip(skip).limit(limit).exec()


    const result = arrayShow(mentors, limit, page);

    return result;
};

const getTermVideos = async(termId, options) => {

    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ termId: { "$in": termId }}).lean()
    .select("title videos course")
    .sort(sort).skip(skip).limit(limit).exec()

    const taskModel = [];

    tasks.forEach(async(task) => {
        // const course = await Course.findOne({ category: task.course });
        if(task.videos.length > 0) {
            // task.course = ["course.title"]
            taskModel.push(task)
        }
    })

    const result = arrayShow(taskModel, limit, page);
    return result;
};

const getTermImages = async(termId, options) => {

    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ termId: { "$in": termId }}).lean()
    .select("title images course")
    .sort(sort).skip(skip).limit(limit).exec()

    const taskModel = [];

    tasks.forEach(async(task) => {
        // const course = await Course.findOne({ category: task.course });
        if(task.images.length > 0) {
            // task.course = ["course.title"]
            taskModel.push(task)
        }
    })

    const result = arrayShow(taskModel, limit, page);
    return result;
};

const getTermAudios = async(termId, options) => {

    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ termId: { "$in": termId }}).lean()
    .select("title audios course")
    .sort(sort).skip(skip).limit(limit).exec()

    const taskModel = [];

    tasks.forEach(async(task) => {
        // const course = await Course.findOne({ category: task.course });
        if(task.audios.length > 0) {
            // task.course = ["course.title"]
            taskModel.push(task)
        }
    })

    const result = arrayShow(taskModel, limit, page);
    return result;
};

const getTermPdfs = async(termId, options) => {

    await getTermById(termId);
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ termId: { "$in": termId }}).lean()
    .select("title pdfs course")
    .sort(sort).skip(skip).limit(limit).exec()

    const taskModel = [];

    tasks.forEach(async(task) => {
        // const course = await Course.findOne({ category: task.course });
        if(task.pdfs.length > 0) {
            // task.course = ["course.title"]
            taskModel.push(task)
        }
    })

    const result = arrayShow(taskModel, limit, page);
    return result;
};

const removeWeekFromTerm = async(termId, weekId) => {
    const updateTerm = await Week.updateOne({ _id: weekId }, { "$pull": {
        "termId": termId
    }}, { "new": true, "upsert": true })

    await Task.updateOne({ weekId: { "$in":  weekId } }, { "$pull": {
        "termId": termId
    }}, { "new": true, "upsert": true })

    return updateTerm;
};

const addWeekToTerm = async(termId, weekId) => {
    const updateTerm = await Week.updateOne({ _id: weekId }, { "$set": {
        "termId": termId
    }}, { "new": true, "upsert": true })

    await Task.updateOne({ weekId: { "$in":  weekId } }, { "$set": {
        "termId": termId
    }}, { "new": true, "upsert": true })

    return updateTerm;
};

const getTermCourses = async(termId, options) => {
    const {sort, limit, skip, page} = slsp(options);

    const term = await getTermById(termId);
    const courses = await Course.find({ tutorialCategory: term.tutorialCategory })
    .sort(sort).skip(skip).limit(limit).exec()
    
    const result = arrayShow(courses, limit, page);
    return result;
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
    getTermWeeksForIntern,
    getTermWeeks,
    getTermInterns,
    getTermMentors,
    getTermVideos,
    getTermImages,
    getTermAudios,
    getTermPdfs,
    removeWeekFromTerm,
    addWeekToTerm,
    getTermCourses
};