const httpStatus = require('http-status');
const fse = require('fs-extra');
const path = require('path');
const { Task, TicketRoom, InternTaskAction, InternWeekAction, QuizResponseRoom } = require('../models');
const ApiError = require('../utils/ApiError');
const { data } = require('../config/logger');


/**
 * Create a user
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody, week) => {
    try {
        const task = await Task.create({
            title: taskBody.title,
            course: taskBody.course,
            content: taskBody.content,
            duration: taskBody.duration,
            order: taskBody.order,
            done: false,
            weekId: week._id,
            termId: week.termId
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
        }}, { "new": true, "upsert": true });  
        
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
            "pdfs": { "$each": pdfModel }
        }}, { "new": true, "upsert": true },
        function(err) {
            if(!err) {console.log('Update');}
            if(err) { throw new ApiError(httpStatus.NO_CONTENT, err)}
        });  
        
        return updatedTask;
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
            "quizes": { "$each": questionModel }
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

const getQuizRoomById = async(roomId) => {
    const quizRoom = await QuizResponseRoom.findOne({ _id: roomId });
    if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizRoomNotFound')};
    return quizRoom;
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

const getTicketRoomById = async(roomId) => {
    const ticketRoom = await TicketRoom.findOne({ _id: roomId });
    if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound')};
    return ticketRoom;
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

        const internWeekActions = await InternWeekAction.findOne({ weekId: task.weekId, internId: action.internId });
        if(!internWeekActions) { const internWeekActions = await InternWeekAction.create({ weekId: task.weekId, internId: action.internId })};
        await InternWeekAction.updateOne({ weekId: task.weekId, internId: action.internId }, { "$inc": {
            doneTaskDuration: task.duration
        }});

        return { message: 'Done Success'}
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

        return { message: 'UnDone Success'}
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

const updateTaskById = async(taskId, taskBody) => {
    const updateTask = await Task.updateOne({ _id: taskId }, { "$set":  taskBody }, { "new": true, "upsert": true });
    return updateTask;
};

const removeTaskImagesByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$pull": {
        "images": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/images/${file}`)    
    });

    return result;
};

const updateTaskImagesById = async(imageId, imageBody) => {
    const result = await Task.updateOne({ "images._id": imageId }, { "$set": {
        "images.$.title": imageBody.title,
        "images.$.description": imageBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

const removeTaskVideosByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$pull": {
        "videos": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/videos/${file}`)    
    });

    return result;
};

const updateTaskVideosById = async(videoId, videoBody) => {
    const result = await Task.updateOne({ "videos._id": videoId }, { "$set": {
        "videos.$.title": videoBody.title,
        "videos.$.description": videoBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

const removeTaskAudiosByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$pull": {
        "audios": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/audios/${file}`)    
    });

    return result;
};

const updateTaskAudiosById = async(audioId, audioBody) => {
    const audioFile = await Task.findOne({ "audios._id": audioId });
    if(!audioFile) { throw new ApiError(httpStatus.NOT_FOUND, "AudioFileNotFound") };
    const result = await Task.updateOne({ "audios._id": audioId }, { "$set": {
        "audios.$.title": audioBody.title,
        "audios.$.description": audioBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

const removeTaskPdfsByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$pull": {
        "pdfs": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/pdfs/${file}`)    
    });

    return result;
};

const updateTaskPdfsById = async(pdfId, pdfBody) => {
    const pdfFile = await Task.findOne({ "pdfs._id": pdfId });
    if(!pdfFile) { throw new ApiError(httpStatus.NOT_FOUND, "PdfFileNotFound") };
    const result = await Task.updateOne({ "pdfs._id": pdfId }, { "$set": {
        "pdfs.$.title": pdfBody.title,
        "pdfs.$.description": pdfBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};


const removeTaskQuizesById = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$pull": {
        "quizes": { _id: removeList },
    }}, { "new": true, "upsert": true });

    return result;
};

const updateTaskQuizesById = async(quizId, quizBody) => {
    const pdfFile = await Task.findOne({ "quizes._id": quizId });
    if(!pdfFile) { throw new ApiError(httpStatus.NOT_FOUND, "QuizNotFound") };
    const result = await Task.updateOne({ "quizes._id": quizId }, { "$set": {
        "quizes.$.description": quizBody.description,
        "quizes.$.alternatives": quizBody.alternatives
    }}, { "new": true, "upsert": true });

    return result;
};

const getPdfFile = async(filename) => {
    const filePath = path.join('public', 'pdf', filename);
    const file = await fse.readFile(filePath, data) 
    return file;
};

const getVideofile = async(filename, req, res) => {
    const range = req.headers.range;
    // if (!range) {
    //     return res.status(400).send("Requires Range header");
    // }
    const videoPath = path.join('public', 'video', filename);
    const videoSize = fse.statSync(videoPath).size;
    console.log('rang: ', range);

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range ? range.replace(/\D/g, "") : 0);
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);


    // create video read stream for this particular chunk
    const videoStream = fse.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
};



const getAudiofile = async(filename, req, res) => {
    // const filePath = path.join('public', 'audio', filename);
    // const file = await fse.createReadStream(filePath);
    // file.pipe(res)

    const range = req.headers.range;
    // if (!range) {
    //     res.status(400).send("Requires Range header");
    // }
    const videoPath = path.join('public', 'audio', filename);
    const videoSize = fse.statSync(videoPath).size;


    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range ? range.replace(/\D/g, "") : 0);
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mp3",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);


    // create video read stream for this particular chunk
    const videoStream = fse.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
};

function setFilePath(dirPath) {
    const filePath = fse.ensureDirSync(dirPath);
    if(!filePath) { return dirPath; }
    else { return filePath };
};

const deleteTaskById = async(taskId) => {
    try {


        
        const task = await getTaskById(taskId);
        task.audios.forEach((file) => {
            fse.unlinkSync(`./public/audios/${file}`)    
        });
        
        task.videos.forEach((file) => {
            fse.unlinkSync(`./public/videos/${file}`)    
        });
    
        task.images.forEach((file) => {
            fse.unlinkSync(`./public/images/${file}`)    
        });
    
        task.pdfs.forEach((file) => {
            fse.unlinkSync(`./public/pdfs/${file}`)    
        });
    
        const result = await Task.deleteOne({ _id: taskId });
    
        return "task";
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    createTask,
    uploadImageForTask,
    uploadVideoForTask,
    uploadAudioForTask,
    uploadPdfFileForTask,
    createQuizForTask,
    getQuizRoomById,
    sendTextResToQuizByIntern,
    sendAudioResToQuizByIntern, 
    sendTextResToQuizByMentor,
    sendAudioResToQuizByMentor,
    getTicketRoomById,
    addTextTicketForTaskByIntern,
    addAudioTicketForTaskByIntern,
    addTextTicketForTaskByMentor,
    addAudioTicketForTaskByMentor,
    getInternTaskAction,
    doneTaskAction,
    getTaskById,
    updateTaskById,
    removeTaskImagesByName,
    updateTaskImagesById,
    removeTaskVideosByName,
    updateTaskVideosById,
    removeTaskAudiosByName,
    updateTaskAudiosById,
    removeTaskPdfsByName,
    updateTaskPdfsById,
    removeTaskQuizesById,
    updateTaskQuizesById,
    getPdfFile,
    getVideofile,
    getAudiofile,
    deleteTaskById,
};