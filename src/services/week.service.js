const httpStatus = require('http-status');
const { Week, InternWeekAction, Task, InternTaskAction } = require('../models');
const ApiError = require('../utils/ApiError');
const { slsp, arrayShow } = require('../utils/defaultArrayType');


const createWeek = async(weekBody, term) => {
    const week = await Week.create({
        title: weekBody.title,
        description: weekBody.description,
        order: weekBody.order,
        termId: term._id
    });
    
    return week;
};

const updateWeekById = async(weekId, updateBody) => {
    await getWeekById(weekId);
    const result = await Week.updateOne({ _id: weekId }, { "$set": updateBody }, { "new": true, "upsert": true });
    return result;
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

    const internWeekAction = await InternWeekAction.findOne({ weekId: week._id, internId: internId });
    if(!internWeekAction) {
        const result = { progressbar : 0 };

        return result;
    }
    else {
        const progressbar = Math.ceil(parseInt(internWeekAction.doneTaskDuration) / parseInt(week.duration) * 100)
        const result = { progressbar : progressbar };

        return result;
    }
};

const deleteWeekProgressbar = async(weekId, internId) => {
  await InternWeekAction.deleteOne({ weekId: weekId, internId: internId });
  return { status: 200, message: "ActionIsDelete" };  
};

const getWeeks = async(filter, options) => {
    
    const weeks = await Week.paginate(filter, options);
    return weeks;
};


const getWeekById = async(weekId) => {
    const week = await Week.findById(weekId);
    if(!week) { throw new ApiError(httpStatus.NOT_FOUND, 'WeekNotFound') };
    return week;
};

const getWeekTasks = async(weekId, internId, options) => {
    const {sort, limit, skip, page} = slsp(options);

    const tasks = await Task.find({ weekId: { "$in": weekId } }).lean()
    .select(' title order duration done')

    const taskModel = await Promise.all(
        tasks.map(async(task) => {
            const done = await InternTaskAction.findOne({ taskId: task._id, internId: internId })
            if(done) { task["done"] = done.done; }
            return task;
        })
    )

    const result = arrayShow(taskModel, limit, page);
    return result;
    // return { results: taskModel, totalResults: taskModel.length };
};


const deleteWeekById = async(weekId) => {

    await Task.deleteMany({ weekId: { "$in": weekId } });
    const result = await Week.deleteOne({ _id: weekId });
    return result;
};

const supervisorPublicOpinionForWeek = async(weekId, superviserId, audioDetails) => {
    const oponinModel = {
        supervisorId: superviserId,
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
    };

    const updateWeek = await Week.updateOne({ _id: weekId }, { "$set": { 
        "supervisorPublicOpinion": oponinModel
    }}, { "new": true, "upsert": true } );

    return updateWeek;
}

const supervisorPrivateOpinionForWeek = async(weekId, superviserId, internId, audioDetails) => {
    const oponinModel = {
        supervisorId: superviserId,
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
    };

    const updateWeek = await InternWeekAction.updateOne({ weekId: weekId, internId: internId }, { "$set": { 
        "supervisorPrivateOpinion": oponinModel
    }}, { "new": true, "upsert": true } );

    return updateWeek;
}


const editWeekById = async(weekId, newBody) => {
    const newWeek = await Week.updateOne({ _id: weekId }, { "$set": newBody }, { "new": true, "upsert": true });
    const week = await Week.findOne({ _id: weekId });
    return week;
}

module.exports = {
    createWeek,
    updateWeekById,
    getInternWeekAction,
    recordWeekScore,
    recordWeekViewCount,
    updateWeekDuration,
    weekProgressbar,
    deleteWeekProgressbar,
    getWeeks,
    getWeekById,
    getWeekTasks,
    deleteWeekById,
    supervisorPublicOpinionForWeek,
    supervisorPrivateOpinionForWeek,
    editWeekById
};