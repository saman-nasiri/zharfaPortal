const httpStatus = require('http-status');
const { Week, InternWeekAction, Task} = require('../models');
const ApiError = require('../utils/ApiError');

const createWeek = async(weekBody, term) => {
    const week = await Week.create({
        title: weekBody.title,
        description: weekBody.description,
        order: weekBody.order
    });
    
    return week;
};


const getInternWeekAction = async(weekId, internId) => {
    const action = await InternWeekAction.findOne({ weekId: weekId, internId: internId });

    if(!action) {
        const action = await InternWeekAction.create({ 
            internId: internId,
            weekId: weekId
        });

        return action;
    }
    
    return action;
};

//recode the score of intern that submit for one week
const recordWeekScore = async(action) => {
    if(action.score === false) {
        await InternWeekAction.updateOne({ _id: action._id }, { "$set": { 
            "score": true
        }}, { "new": true, "upsert": true });
        
        await Week.updateOne({_id: action.weekId }, { "$inc": { 
            "score": 1
        }}, { "new": true, "upsert": true });
    }
    else {
        await InternWeekAction.updateOne({ _id: action._id }, { "$set": { 
            "score": false
        }}, { "new": true, "upsert": true });

        await Week.updateOne({_id: action.weekId }, { "$inc": { 
            "score": -1
        }}, { "new": true, "upsert": true });
    }
};


//recored the view by intern of the week
const recordWeekViewCount = async(action) => {
    if(action.viewCount === false) {
        await InternWeekAction.updateOne({ _id: action._id }, { "$set": { 
            "viewCount": true
        }}, { "new": true, "upsert": true });
        
        await Week.updateOne({_id: action.weekId }, { "$inc": { 
            "viewCount": 1
        }}, { "new": true, "upsert": true });
    }
    else {
        await InternWeekAction.updateOne({ _id: action._id }, { "$set": { 
            "viewCount": false
        }}, { "new": true, "upsert": true });

        await Week.updateOne({_id: action.weekId }, { "$inc": { 
            "viewCount": -1
        }}, { "new": true, "upsert": true });
    }
};

const updateWeekDuration = async(weekId, task) => {
    const week = await Week.updateOne({ _id: weekId }, { "$inc": {
        duration: task.duration
    }}, { "new": true, "upsert": true })

    return week
};

const weekProgressbar = async(week, internId) => {

    const weekAction = await InternWeekAction.findOne({ weekId: week._id, internId: internId });
    if(!weekAction) {
        const result = { progressbar : 0 };

        return result;
    }
    else {
        const progressbar = Math.ceil(parseInt(weekAction.doneTaskDuration) / parseInt(week.duration) * 100)
        const result = { progressbar : progressbar };

        return result;
    }
};


const getWeeks = async() => {
    const weeks = await Week.find();
    return weeks;
};

const getWeekById = async(weekId) => {
    const week = await Week.findById(weekId);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotFound') };
    return week;
};

const deleteWeekById = async(weekId) => {
    await Task.deleteMany({ weekId: weekId });
    const result = await Week.deleteOne({ _id: weekId });
    return result;
};

module.exports = {
    createWeek,
    getInternWeekAction,
    recordWeekScore,
    recordWeekViewCount,
    updateWeekDuration,
    weekProgressbar,
    getWeeks,
    getWeekById,
    deleteWeekById
};