const httpStatus = require('http-status');
const { Task, TicketRoom, InternTaskAction, InternWeekAction, QuizResponse } = require('../models');
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

    //    const result =  await Video.insertMany(videoModel);
    //    console.log("result: ", result);

       const videosId = result.map(videoId => videoId._id)
        
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
            "videos": { "$each": videoModel }
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

        console.log(audioModel);
    //    const result =  await Audio.insertMany(audioModel);

    //    const audiosId = result.map(audioId => audioId._id)
        
        
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

    let quizResponse = await QuizResponse.findOne({ taskId: taskId, internId: internId });
    if(!quizResponse) { quizResponse = await QuizResponse.create({ taskId: taskId, internId: internId, score: 35 }); }
    const response = {
        senderId: internId,
        replayTo: taskId,
        text: text,
        date: new Date().toString()
    };
    const addTicket = await QuizResponse.updateOne({_id: quizResponse._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true }); 

};

const sendAudioResToQuizByIntern = async(taskId, internId, audioDetails) => {

    let quizResponse = await QuizResponse.findOne({ taskId: taskId, internId: internId });
    if(!quizResponse) { quizResponse = await QuizResponse.create({ taskId: taskId, internId: internId, score: 35 }); }
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

    const addTicket = await QuizResponse.updateOne({_id: quizResponse._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true });  
};

const sendTextResToQuizByMentor = async(responseId, mentorId, text) => {

    const quizResponse = await QuizResponse.findOne({ "responses._id": responseId });
    
    const response = {
        senderId: mentorId,
        replayTo: responseId,
        text: text,
        date: new Date().toString()
    };
    const sendTextRes = await QuizResponse.updateOne({_id: quizResponse._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true }); 

    return sendTextRes;
};

const sendAudioResToQuizByMentor = async(responseId, mentorId, audioDetails) => {

    let quizResponse = await QuizResponse.findOne({ "responses._id": responseId });
    if(!quizResponse) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizNotFound'); };
    
    
    const audioFile = {
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
        size: audioDetails.size
    };
    const response = {
        senderId: mentorId,
        replayTo: responseId,
        audio: audioFile,
        date: new Date().toString()
    };

    const addTicket = await QuizResponse.updateOne({_id: quizResponse._id}, {"$addToSet": {
        "responses": response,
    }}, { "new": true, "upsert": true });  
};

const addTextTicketForTaskByIntern = async(taskId, ticketBody) => {
    try {
        const internId = "6087b87b104caa2307e68566";
        const taskCreater = "6087b8ac104caa2307e68567" //task creator id

        const ticketRoom = await TicketRoom.findOne({taskId: taskId, internId: internId});

        
        if(!ticketRoom) {
            const ticketModel = {
                taskId: taskId,
                internId: internId,
                tickets: {
                    senderId: internId,
                    replayTo: taskId,
                    text: ticketBody.text,
                    date: new Date().toString()
                }
            };
            const ticketRoom = await TicketRoom.create(ticketModel);
            console.log('ticketRoom: ', ticketRoom);
    
            return ticketRoom;
        }
        else {
            const ticket = {
                senderId: internId,
                replayTo: taskCreater,
                text: ticketBody.text,
                date: new Date().toString()
            };

            console.log("ticket", ticket);
            const addTicket = await TicketRoom.updateOne({taskId: taskId, internId: internId}, {"$addToSet": {
                "tickets": ticket,
            }}, { "new": true, "upsert": true });  

            return addTicket;
        }
        
    } catch (error) {
        console.log(error);
    }
};


const addAudioTicketForTaskByIntern = async(taskId, audioDetails) => {
    try {
        const internId = "6087b87b104caa2307e68566";
        const taskCreater = "6087b8ac104caa2307e68567" //task creator id

        const ticketRoom = await TicketRoom.find({taskId: taskId, internId: internId});

        const audioFile = {
            filename: audioDetails.filename,
            mimetype: audioDetails.mimetype,
            size: audioDetails.size
        };
        
        console.log("audioDetails", audioFile);
        if(!ticketRoom) {
            const ticketModel = {
                taskId: taskId,
                internId: internId,
                tickets: {
                    senderId: internId,
                    replayTo: taskId,
                    audio: audioFile,
                    date: new Date().toString()
                }
            };
            const ticketRoom = await TicketRoom.create(ticketModel);
            console.log('ticketRoom: ', ticketRoom);
    
            return ticketRoom;
        }
        else {
            const ticket = {
                senderId: internId,
                replayTo: taskId,
                audio: audioFile,
                date: new Date().toString()
            };

            console.log("ticket", ticket);
            const addTicket = await TicketRoom.updateOne({taskId: taskId, internId: internId}, {"$addToSet": {
                "tickets": ticket,
            }}, { "new": true, "upsert": true });  

            return addTicket;
        }
        
    } catch (error) {
        console.log(error);
    }
};

const addTextTicketForTaskByMentor = async(ticketId, mentorId, ticketBody) => {
        const ticketRoom = await TicketRoom.findOne({"tickets._id": { $in: ticketId }})
        const ticket = {
            senderId: mentorId,
            replayTo: ticketId,
            text: ticketBody.text,
            date: new Date().toString()
        };

        const addTicket = await TicketRoom.updateOne({_id: ticketRoom._id}, {"$addToSet": {
            "tickets": ticket,
        }}, { "new": true, "upsert": true });  

        return addTicket;
};


const addAudioTicketForTaskByMentor = async(ticketId, mentorId, audioDetails) => {
    const ticketRoom = await TicketRoom.findOne({"tickets._id": { $in: ticketId }})
    const audioFile = {
        filename: audioDetails.filename,
        mimetype: audioDetails.mimetype,
        size: audioDetails.size
    };

    const ticket = {
        senderId: mentorId,
        replayTo: ticketId,
        audio: audioFile,
        date: new Date().toString()
    };

    const addTicket = await TicketRoom.updateOne({_id: ticketRoom._id}, {"$addToSet": {
        "tickets": ticket,
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


const getTaskById = async(taskId) => {
    const task = await Task.findById(taskId);
    if(!task) { throw new ApiError(httpStatus.NOT_FOUND, 'TaskNotFound'); };

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