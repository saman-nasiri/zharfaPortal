const httpStatus = require('http-status');
const { Task, TicketRoom, InternTaskAction, InternWeekAction, QuizResponseRoom } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Create a user
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody, weekId) => {
    try {
        const task = await Task.create({
            title: taskBody.title,
            course: taskBody.course,
            content: taskBody.content,
            duration: taskBody.duration,
            weekId: weekId,
            order: taskBody.order,
            done: false,
        });
    
        return task;
    } catch (error) {
        console.log(error);
    }
};

const uploadImageForTask = async(taskId, imageBody, imageDetails) => {
    try {

        const imageModel = imageDetails.map((imageDetail) => {

            const image = {
                title: imageBody.title,
                description: imageBody.description,
                filename: imageDetail.filename,
                mimetype: imageDetail.mimetype,
                size: imageDetail.size
            };

            return image;
        });
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "images": { "$each": imageModel }
        }}, { "new": true, "upsert": true },
        function(err) {
            if(!err) {console.log('Update');}
            if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
        });  
        
    return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
};

const uploadVideoForTask = async(taskId, videoBody, videoDetails) => {
    try {
        const videoModel = videoDetails.map((videoDetail) => {
            const video = {
                title: videoBody.title,
                description: videoBody.description,
                filename: videoDetail.filename,
                mimetype: videoDetail.mimetype,
                size: videoDetail.size
            };

            return video;
        });
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "videos": { "$each": videoModel }
        }}, { "new": true, "upsert": true });  
        
        return updatedTask;
    }
    catch(err) {
        console.log(err);
    };
};


const uploadAudioForTask = async(taskId, audioBody, audioDetails) => {
    try {

        const audioModel = audioDetails.map((audioDetail) => {

            const audio = {
                title: audioBody.title,
                description: audioBody.description,
                filename: audioDetail.filename,
                mimetype: audioDetail.mimetype,
                size: audioDetail.size
            };

            return audio;
        });        
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "audios": { "$each": audioModel }
        }}, { "new": true, "upsert": true },
        function(err) {
            if(!err) {console.log('Update');}
            if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
        });  
        
    return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
};


const uploadPdfFileForTask = async(taskId, pdfBody, pdfDetails) => {
    try {
        const pdfModel = pdfDetails.map((pdfDetail) => {

            const pdf = {
                title: pdfBody.title,
                description: pdfBody.description,
                filename: pdfDetail.filename,
                mimetype: pdfDetail.mimetype,
                size: pdfDetail.size
            }; 

            return pdf;
        });


        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "pdf": { "$each": pdfModel }
        }}, { "new": true, "upsert": true },
        function(err) {
            if(!err) {console.log('Update');}
            if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
        });  
        
        return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
};


const createQuizForTask = async(taskId, questions) => {
    try {

        const questionModel = questions.map((question) => {

            questionObj = {
                description: question.description,
                alternatives: question.alternatives
            };

            return questionObj;
        });

        
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "quiz": { "$each": questionModel }
        }}, { "new": true, "upsert": true },
        function(err) {
            if(!err) {console.log('Update');}
            if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
        });  
        
    return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        // return next(error);
        console.log(err);
      };
};

const sendTextResToQuizByIntern = async(taskId, internId, text) => {

    let quizResponseRoom = await QuizResponseRoom.findOne({ taskId: taskId, internId: internId });
    if(!quizResponseRoom) { quizResponseRoom = await QuizResponseRoom.create({ taskId: taskId, internId: internId }); }
    const response = {
        senderId: internId,
        replayTo: taskId,
        text: text,
        date: new Date().toString()
    };
    const addResponse = await QuizResponseRoom.updateOne({_id: quizResponseRoom._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true }); 

    //internResponse is property for that menor know intrn send him a new response to quiz
    //mentorResponse is property for intern that know mentor send a new response
    await QuizResponseRoom.updateOne({_id: quizResponseRoom._id}, {"$set": {
        "internResponse": true,
        "mentorResponse": false,
    }}, { "new": true, "upsert": true });

    return addResponse;

};

const sendAudioResToQuizByIntern = async(taskId, internId, audioDetails) => {

    let quizResponseRoom = await QuizResponseRoom.findOne({ taskId: taskId, internId: internId });
    if(!quizResponseRoom) { quizResponseRoom = await QuizResponseRoom.create({ taskId: taskId, internId: internId }); }
    const audioFile = {
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
        size: audioDetails.size
    };
    const response = {
        senderId: internId,
        replayTo: taskId,
        audio: audioFile,
        date: new Date().toString()
    };

    const addResponse = await QuizResponseRoom.updateOne({_id: quizResponseRoom._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true });
    
    //internResponse is property for that menor know intrn send him a new response to quiz
    //mentorResponse is property for intern that know mentor send a new response
    await QuizResponseRoom.updateOne({_id: quizResponseRoom._id}, {"$set": {
        "internResponse": true,
        "mentorResponse": false,
    }}, { "new": true, "upsert": true });

    return addResponse;
};

const sendTextResToQuizByMentor = async(quizResponseRoomId, mentorId, text) => {

    const quizResponseRoom = await QuizResponseRoom.findOne({ _id: quizResponseRoomId });
    if(!quizResponseRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizNotFound'); };
    
    const response = {
        senderId: mentorId,
        replayTo: quizResponseRoomId,
        text: text,
        date: new Date().toString()
    };
    const addResponse = await QuizResponseRoom.updateOne({ _id: quizResponseRoomId }, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true }); 

    await QuizResponseRoom.updateOne({ _id: quizResponseRoomId }, {"$set": {
        "internResponse": false,
        "mentorResponse": true,
    }}, { "new": true, "upsert": true });

    return addResponse;
};

const sendAudioResToQuizByMentor = async(quizResponseRoomId, mentorId, audioDetails) => {

    let quizResponseRoom = await QuizResponseRoom.findOne({ _id: quizResponseRoomId });
    if(!quizResponseRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizNotFound'); };
    
    
    const audioFile = {
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
        size: audioDetails.size
    };
    const response = {
        senderId: mentorId,
        replayTo: quizResponseRoomId,
        audio: audioFile,
        date: new Date().toString()
    };

    const addResponse = await QuizResponseRoom.updateOne({ _id: quizResponseRoomId }, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true });  

    await QuizResponseRoom.updateOne({ _id: quizResponseRoomId }, {"$set": {
        "internResponse": false,
        "mentorResponse": true,
    }}, { "new": true, "upsert": true });

    return addResponse;
};

const addTextTicketForTaskByIntern = async(taskId, internId, ticketBody) => {

        let ticketRoom = await TicketRoom.findOne({taskId: taskId, internId: internId});
        if(!ticketRoom) { ticketRoom = await TicketRoom.create({taskId: taskId, internId: internId})};
        const ticket = {
            senderId: internId,
            replayTo: taskId,
            text: ticketBody.text,
            date: new Date().toString()
        };

        const addTicket = await TicketRoom.updateOne({taskId: taskId, internId: internId}, {"$addToSet": {
            "tickets": ticket,
        }}, { "new": true, "upsert": true }); 

        await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$set": {
            "internResponse": true,
            "mentorResponse": false,
        }}, { "new": true, "upsert": true }); 

        return addTicket;
};


const addAudioTicketForTaskByIntern = async(taskId, internId, audioDetails) => {

        let ticketRoom = await TicketRoom.findOne({taskId: taskId, internId: internId});
        if(!ticketRoom) { ticketRoom = await TicketRoom.create({taskId: taskId, internId: internId})};
    
        const audioFile = {
            filename: audioDetails.filename,
            mimetype: audioDetails.mimetype,
            size: audioDetails.size
        };

        const ticket = {
            senderId: internId,
            replayTo: taskId,
            audio: audioFile,
            date: new Date().toString()
        };
        
        const addTicket = await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$addToSet": {
            "tickets": ticket,
        }}, { "new": true, "upsert": true }); 
        
        await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$set": {
            "internResponse": true,
            "mentorResponse": false,
        }}, { "new": true, "upsert": true });

        return addTicket;
};

const addTextTicketForTaskByMentor = async(ticketRoomId, mentorId, ticketBody) => {
        let ticketRoom = await TicketRoom.findOne({ _id: ticketRoomId });
        if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound'); };
        const ticket = {
            senderId: mentorId,
            replayTo: ticketRoomId,
            text: ticketBody.text,
            date: new Date().toString()
        };

        const addTicket = await TicketRoom.updateOne({_id: ticketRoomId}, {"$addToSet": {
            "tickets": ticket,
        }}, { "new": true, "upsert": true });  

        await TicketRoom.updateOne({_id: ticketRoomId}, {"$set": {
            "internResponse": false,
            "mentorResponse": true,
        }}, { "new": true, "upsert": true });

        return addTicket;
};


const addAudioTicketForTaskByMentor = async(ticketRoomId, mentorId, audioDetails) => {
        let ticketRoom = await TicketRoom.findOne({ _id: ticketRoomId });
        if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound'); };
        
        const audioFile = {
            filename: audioDetails.filename,
            mimetype: audioDetails.mimetype,
            size: audioDetails.size
        };

        const ticket = {
            senderId: mentorId,
            replayTo: ticketRoomId,
            audio: audioFile,
            date: new Date().toString()
        };

        const addTicket = await TicketRoom.updateOne({_id: ticketRoomId}, {"$addToSet": {
            "tickets": ticket,
        }}, { "new": true, "upsert": true });

        await TicketRoom.updateOne({_id: ticketRoomId}, {"$set": {
            "internResponse": false,
            "mentorResponse": true,
        }}, { "new": true, "upsert": true });

        return addTicket;
};


const getInternTaskAction = async(taskId, internId) => {
    const action = await InternTaskAction.findOne({ taskId: taskId, internId: internId });

    
    if(!action) {
        const action = await InternTaskAction.create({ 
            internId: internId,
            taskId: taskId
        });

        return action;
    }
    
    return action;    
};


const doneTaskAction = async(action, task) => {
    if(action.done === false) {
        await InternTaskAction.updateOne({ _id: action._id }, { "$set": { 
            "done": true
        }}, { "new": true, "upsert": true });
        
        await Task.updateOne({ _id: task._id }, { "$inc": { 
            "doneCount": 1
        }}, { "new": true, "upsert": true });

        await InternWeekAction.updateOne({ weekId: task.weekId, internId: action.internId }, { "$inc": {
            doneTaskDuration: task.duration
        }});
    }
    else {
        await InternTaskAction.updateOne({ _id: action._id }, { "$set": { 
            "done": false
        }}, { "new": true, "upsert": true });

        await Task.updateOne({ _id: task._id }, { "$inc": { 
            "doneCount": -1
        }}, { "new": true, "upsert": true });

        await InternWeekAction.updateOne({ weekId: task.weekId, internId: action.internId }, { "$inc": {
            doneTaskDuration: -task.duration
        }});
    }
};


const getTaskById = async(taskId, internId) => {
    let task = await Task.findById(taskId).lean();
    if(!task) { throw new ApiError(httpStatus.NOT_FOUND, 'TaskNotFound'); };

    const taskAction = await InternTaskAction.findOne({ taskId: task._id, internId: internId })
    if(taskAction) { task["done"] = taskAction.done };


    // const audio = await Audio.find({_id: {"$in": task.audios }});
    // const ticket = await TicketRoom.find({"tickets._id": {$in: "607d1fdac8d8ab1b8c72605c"}})
    // return ticket;

    return task;
};


const getTicketRoom = async(ticketRoomId) => {
    const ticketRoom = await TicketRoom.findById(ticketRoomId);
    if(!task) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound'); };

    return ticketRoom;
};

module.exports = {
    createTask,
    uploadImageForTask,
    uploadVideoForTask,
    uploadAudioForTask,
    uploadPdfFileForTask,
    createQuizForTask,
    sendTextResToQuizByIntern,
    sendAudioResToQuizByIntern,
    sendTextResToQuizByMentor,
    sendAudioResToQuizByMentor,
    addTextTicketForTaskByIntern,
    addAudioTicketForTaskByIntern,
    addTextTicketForTaskByMentor,
    addAudioTicketForTaskByMentor,
    getInternTaskAction,
    doneTaskAction,
    getTaskById,
    getTicketRoom
};