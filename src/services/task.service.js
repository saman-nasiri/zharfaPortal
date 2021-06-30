const httpStatus = require('http-status');
const fse = require('fs-extra');
const path = require('path');
const { Task, TicketRoom, InternTaskAction, InternWeekAction, QuizRoom, Intern, Mentor } = require('../models');
const ApiError = require('../utils/ApiError');
const { data } = require('../config/logger');


/**
 * Create a user
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody, week, course) => {
    try {
        const task = await Task.create({
            title: taskBody.title,
            course: course.category,
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
        }}, { "new": true, "upsert": true });  
        
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
        }}, { "new": true, "upsert": true });  
        
        return updatedTask;
};

const addTestQuizToTask = async(taskId, question) => {

    questionModel = {
        description: question.description,
        alternatives: question.alternatives
    };

    const addQuiz = await Task.updateOne({ _id: taskId }, { "$set": {
        "testQuiz": true,
        "quiz": questionModel
    }}, { "new": true, "upsert": true })

    return { status: 200, message: 'Success'};
};

const responseTestQuiz = async(taskId, internId, responseBody) => {
    let quizRoom = await QuizRoom.findOne({ taskId: taskId, internId: internId });
    if(!quizRoom) { quizRoom = await QuizRoom.create({ taskId: taskId, internId: internId }); };
    const intern = await Intern.findById(internId);
    console.log(responseBody);
    const responsed = await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
        "testAnswer": responseBody,
        "internResponse": true,
        "mentorResponse": false,
    }}, { "new": true, "upsert": true });


    return { status: 200, message: 'Success'};
};

const addDiscriptiveQuizToTask = async(taskId, question) => {

    questionModel = {
        description: question.description,
    };

    const addQuiz = await Task.updateOne({ _id: taskId }, { "$set": {
        "discriptiveQuiz": true,
        "quiz": questionModel
    }}, { "new": true, "upsert": true });

    return { status: 200, message: 'Success'};
};

const responseDiscriptiveQuiz = async(taskId, internId, responseBody) => {
    let quizRoom = await QuizRoom.findOne({ taskId: taskId, internId: internId });
    if(!quizRoom) { quizRoom = await QuizRoom.create({ taskId: taskId, internId: internId }); };
    const intern = await Intern.findById(internId);

    const responsed = await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
        "discriptiveAnswer": responseBody,
        "internResponse": true,
        "mentorResponse": false,
    }}, { "new": true, "upsert": true });


    return { status: 200, message: 'Success'};
};

const sendTextMessageInQuizRoom = async(quizRoomId, sender, text) => {
    let quizRoom = await QuizRoom.findOne({ _id: quizRoomId });
    await getQuizRoomByRoomId(quizRoomId);

    const chatMessage = {
        senderRole: sender.role,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: sender.id,
        replayTo: quizRoomId,
        text: text,
        date: new Date().toString()
    };

    const sendMessage = await QuizRoom.updateOne({_id: quizRoom._id}, {"$addToSet": {
        "chatContent": chatMessage,
    }}, { "new": true, "upsert": true }); 

    if(user.role === 'intern')
    {
        await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
            "internResponse": true,
            "mentorResponse": false,
        }}, { "new": true, "upsert": true });        
    }
    else if(user.role === 'mentor')
    {
        await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
            "internResponse": false,
            "mentorResponse": true,
        }}, { "new": true, "upsert": true });
    }


    return { status: 200, message: 'Success'};

};


const getQuizRoomByRoomId = async(roomId) => {
    const quizRoom = await QuizRoom.findOne({ _id: roomId });
    if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizRoomNotFound')};
    return quizRoom;
};

const mentorCheckOutQuizResponse = async(quizRoom, sender, text) => {

    mentorAnswer = {
        mentorId: sender.id,
        mentorName: sender.firstName + ' ' + sender.lastName,
        text: text
    };

    const sendMessage = await QuizRoom.updateOne({_id: quizRoom}, {"$set": {
        "mentorAnswer": mentorAnswer,
    }}, { "new": true, "upsert": true }); 

    return { status: 200, message: 'Success'};

};

const createTicketRoom = async(taskId, sender, text) => {
    let ticketRoom = await TicketRoom.findOne({ taskId: taskId, internId: sender.id });
    if(!ticketRoom) { ticketRoom = await TicketRoom.create({ taskId: taskId, internId: sender.id })};

    sendTextMessageInTicketRoom(ticketRoom.id, sender, text);

    return { status: 200, message: 'Success'};
};

const sendTextMessageInTicketRoom = async(ticketRoomId, sender, text) => {
    const chatMessage = {
        senderRole: sender.role,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: sender.id,
        replayTo: ticketRoomId,
        text: text,
        date: new Date().toString()
    };

    const sendMessage = await TicketRoom.updateOne({ _id: ticketRoomId }, {"$addToSet": {
        "ticketContent": chatMessage,
    }}, { "new": true, "upsert": true }); 

    if(sender.role === 'intern') 
    {
        await TicketRoom.updateOne({ _id: ticketRoomId }, {"$set": {
            "internResponse": true,
            "mentorResponse": false,
        }}, { "new": true, "upsert": true });
    }
    else if(sender.role === 'mentor')
    {
        await TicketRoom.updateOne({ _id: ticketRoomId }, {"$set": {
            "internResponse": false,
            "mentorResponse": true,
        }}, { "new": true, "upsert": true });
    }
    
    return { status: 200, message: 'Success'};
};

const getTicketRoomById = async(roomId) => {
    const ticketRoom = await TicketRoom.findOne({ _id: roomId });
    if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound')};
    return ticketRoom;
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

    if(task.testQuiz === true) {
        const quizRoom = await QuizRoom.findOne({ taskId: task._id, internId: internId });
        if(quizRoom) { 
            task["quizAnswer"] = quizRoom.testAnswer,
            task["mentorAnswer"] = quizRoom.mentorAnswer
        }; 
    }
    if(task.discriptiveQuiz === true) {
        const quizRoom = await QuizRoom.findOne({ taskId: task._id, internId: internId });
        if(quizRoom) { 
            task["quizAnswer"] = quizRoom.discriptiveAnswer,
            task["mentorAnswer"] = quizRoom.mentorAnswer
        }; 
    }
    
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
    const filePath = path.join('public', 'pdfs', filename);
    const file = await fse.readFile(filePath, data) 
    return file;
};

const getVideofile = async(filename, req, res) => {
    const range = req.headers.range;
    // if (!range) {
    //     return res.status(400).send("Requires Range header");
    // }
    const videoPath = path.join('public', 'videos', filename);
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
    const videoPath = path.join('public', 'audios', filename);
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


const deleteTaskById = async(taskId) => {
    await getTaskById(taskId);
    try {

        const task = await getTaskById(taskId);
        task.audios.forEach((file) => {
            fse.ensureDir(`./public/audios/${file}`)
            .then(() => {  fse.unlinkSync(`./public/audios/${file}`); })
        });
        
        task.videos.forEach((file) => {
            fse.ensureDir(`./public/videos/${file}`)
            .then(() => { fse.unlinkSync(`./public/videos/${file}`); });
        });
    
        task.images.forEach((file) => {
            fse.ensureDir(`./public/images/${file}`)
            .then(() => { fse.unlinkSync(`./public/images/${file}`); });
        });
    
        task.pdfs.forEach((file) => {
            ifse.ensureDir(`./public/pdfs/${file}`)
            .then(() => { fse.unlinkSync(`./public/pdfs/${file}`); });
        });
    
        const result = await Task.deleteOne({ _id: taskId });
    
        return result;
    } catch (error) {
        console.log(error);
    }
};


const getTaskVideos = async(taskId) => {

    await getTaskById(taskId);

    const tasks = await Task.findOne({ _id: taskId }).lean()
    .select("title videos")

    return tasks;
};

const getTaskImages = async(taskId) => {

    await getTaskById(taskId);

    const images = await Task.findOne({ _id:  taskId }).lean()
    .select("title images")


    return images;
};

const getTaskAudios = async(taskId) => {

    await getTaskById(taskId);
    const tasks = await Task.findOne({ _id:  taskId }).lean()
    .select("title audios")

    return tasks;
};

const getTaskPdfs = async(taskId) => {

    await getTaskById(taskId);
    const tasks = await Task.findOne({ _id:  taskId }).lean()
    .select("title pdfs")

    return tasks;
};

const getQuizRoomByTaskId = async(internId, taskId) => {
    const task = await Task.findOne({ _id: taskId });
    const quizRoom = await QuizRoom.findOne({ internId: internId, taskId: taskId })
    .select('-taskId -internId')
    if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, "QuizRoomNotFound") };

    if(task.testQuiz === true) {
        quizDetails = {
            title: task.title,
            question: task.quiz,
            answer: quizRoom.testAnswer,
            chatRoom: quizRoom
        }

        return quizDetails;
    }
    else if(task.discriptiveQuiz) {
        quizDetails = {
            title: task.title,
            question: task.quiz,
            answer: quizRoom.discriptiveAnswer,
            chatRoom: quizRoom
        }

        return quizDetails;
    }
};

module.exports = {
    createTask,
    uploadImageForTask,
    uploadVideoForTask,
    uploadAudioForTask,
    uploadPdfFileForTask,
    getQuizRoomByRoomId,
    getTicketRoomById,
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
    getTaskVideos,
    getTaskAudios,
    getTaskImages,
    getTaskPdfs,
    getQuizRoomByTaskId,
    addTestQuizToTask,
    responseTestQuiz,
    addDiscriptiveQuizToTask,
    responseDiscriptiveQuiz,
    sendTextMessageInQuizRoom,
    mentorCheckOutQuizResponse,
    createTicketRoom,
    sendTextMessageInTicketRoom
};





    // createQuizForTask,
    // sendTextResToQuizByIntern,
    // sendAudioResToQuizByIntern, 
    // sendTextResToQuizByMentor,
    // sendAudioResToQuizByMentor,



// const createQuizForTask = async(taskId, questions) => {
//     try {

//         const questionModel = questions.map((question) => {

//             questionObj = {
//                 description: question.description,
//                 alternatives: question.alternatives
//             };

//             return questionObj;
//         });

        
//         const updatedTask = await Task.updateOne({_id: taskId}, {"$addToSet": {
//             "quizes": { "$each": questionModel }
//         }}, { "new": true, "upsert": true });  
//         await Task.updateOne({_id: taskId}, {"$set": {
//             "needAnswer": true
//         }}, { "new": true, "upsert": true });

//     return updatedTask;
//     }
//     catch(err) {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         // return next(error);
//         console.log(err);
//       };
// };



// const sendTextResToQuizByIntern = async(taskId, internId, text) => {

//     let quizRoom = await QuizRoom.findOne({ taskId: taskId, internId: internId });
//     if(!quizRoom) { quizRoom = await QuizRoom.create({ taskId: taskId, internId: internId }); };
//     const intern = await Intern.findById(internId);

//     const response = {
//         senderName: intern.firstName + ' ' + intern.lastName,
//         senderId: internId,
//         replayTo: taskId,
//         text: text,
//         date: new Date().toString()
//     };
//     const addResponse = await QuizRoom.updateOne({_id: quizRoom._id}, {"$addToSet": {
//         "responses": response,
//     }}, { "new": true, "upsert": true }); 

//     //internResponse is property for that menor know intrn send him a new response to quiz
//     //mentorResponse is property for intern that know mentor send a new response
//     await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
//         "internResponse": true,
//         "mentorResponse": false,
//     }}, { "new": true, "upsert": true });

//     return addResponse;

// };

// const sendAudioResToQuizByIntern = async(taskId, internId, audioDetails) => {

//     let quizRoom = await QuizRoom.findOne({ taskId: taskId, internId: internId });
//     if(!quizRoom) { quizRoom = await QuizRoom.create({ taskId: taskId, internId: internId }); }
//     const intern = await Intern.findById(internId);

//     const audioFile = {
//         filename: audioDetails.filename,
//         mimetype: audioDetails.mimetype,
//         size: audioDetails.size
//     };
//     const response = {
//         senderName: intern.firstName + ' ' + intern.lastName,
//         senderId: internId,
//         replayTo: taskId,
//         audio: audioFile,
//         date: new Date().toString()
//     };

//     const addResponse = await QuizRoom.updateOne({_id: quizRoom._id}, {"$addToSet": {
//         "responses": response,
//     }}, { "new": true, "upsert": true });
    
//     //internResponse is property for that menor know intrn send him a new response to quiz
//     //mentorResponse is property for intern that know mentor send a new response
//     await QuizRoom.updateOne({_id: quizRoom._id}, {"$set": {
//         "internResponse": true,
//         "mentorResponse": false,
//     }}, { "new": true, "upsert": true });

//     return addResponse;
// };

// const sendTextResToQuizByMentor = async(quizRoomId, mentorId, text) => {

//     const quizRoom = await QuizRoom.findOne({ _id: quizRoomId });
//     if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizNotFound'); };
//     const mentor = await Mentor.findById(mentorId);

//     const response = {
//         senderName: mentor.firstName + ' ' + mentor.lastName,
//         senderId: mentorId,
//         replayTo: quizRoomId,
//         text: text,
//         date: new Date().toString()
//     };
//     const addResponse = await QuizRoom.updateOne({ _id: quizRoomId }, {"$addToSet": {
//         "responses": response,
//     }}, { "new": true, "upsert": true }); 

//     await QuizRoom.updateOne({ _id: quizRoomId }, {"$set": {
//         "internResponse": false,
//         "mentorResponse": true,
//     }}, { "new": true, "upsert": true });

//     return addResponse;
// };

// const sendAudioResToQuizByMentor = async(quizRoomId, mentorId, audioDetails) => {

//     let quizRoom = await QuizRoom.findOne({ _id: quizRoomId });
//     if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'QuizNotFound'); };
//     const mentor = await Mentor.findById(mentorId);
    
//     const audioFile = {
//         filename: audioDetails.filename,
//         mimetype: audioDetails.mimetype,
//         size: audioDetails.size
//     };
//     const response = {
//         senderName: mentor.firstName + ' ' + mentor.lastName,
//         senderId: mentorId,
//         replayTo: quizRoomId,
//         audio: audioFile,/home/saman/Downloads/NodeJsرزومه تکمیلی.docx
//         date: new Date().toString()
//     };

//     const addResponse = await QuizRoom.updateOne({ _id: quizRoomId }, {"$addToSet": {
//         "responses": response,
//     }}, { "new": true, "upsert": true });  

//     await QuizRoom.updateOne({ _id: quizRoomId }, {"$set": {
//         "internResponse": false,
//         "mentorResponse": true,
//     }}, { "new": true, "upsert": true });

//     return addResponse;
// };





// addTextTicketForTaskByIntern,
// addAudioTicketForTaskByIntern,
// addTextTicketForTaskByMentor,
// addAudioTicketForTaskByMentor,

// const addTextTicketForTaskByIntern = async(taskId, internId, ticketBody) => {

//     let ticketRoom = await TicketRoom.findOne({taskId: taskId, internId: internId});
//     if(!ticketRoom) { ticketRoom = await TicketRoom.create({taskId: taskId, internId: internId})};
//     const intern = await Intern.findById(internId);

//     const ticket = {
//         senderName: intern.firstName + ' ' + intern.lastName,
//         senderId: internId,
//         replayTo: taskId,
//         text: ticketBody.text,
//         date: new Date().toString()
//     };

//     const addTicket = await TicketRoom.updateOne({taskId: taskId, internId: internId}, {"$addToSet": {
//         "tickets": ticket,
//     }}, { "new": true, "upsert": true }); 

//     await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$set": {
//         "internResponse": true,
//         "mentorResponse": false,
//     }}, { "new": true, "upsert": true }); 

//     return addTicket;
// };


// const addAudioTicketForTaskByIntern = async(taskId, internId, audioDetails) => {

//     let ticketRoom = await TicketRoom.findOne({taskId: taskId, internId: internId});
//     if(!ticketRoom) { ticketRoom = await TicketRoom.create({taskId: taskId, internId: internId})};
//     const intern = await Intern.findById(internId);
    
//     const audioFile = {
//         senderName: intern.firstName + ' ' + intern.lastName,
//         filename: audioDetails.filename,
//         mimetype: audioDetails.mimetype,
//         size: audioDetails.size
//     };

//     const ticket = {
//         senderId: internId,
//         replayTo: taskId,
//         audio: audioFile,
//         date: new Date().toString()
//     };
    
//     const addTicket = await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$addToSet": {
//         "tickets": ticket,
//     }}, { "new": true, "upsert": true }); 
    
//     await TicketRoom.updateOne({ _id: ticketRoom._id }, {"$set": {
//         "internResponse": true,
//         "mentorResponse": false,
//     }}, { "new": true, "upsert": true });

//     return addTicket;
// };

// const addTextTicketForTaskByMentor = async(ticketRoomId, mentorId, ticketBody) => {
//     let ticketRoom = await TicketRoom.findOne({ _id: ticketRoomId });
//     if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound'); };
//     const mentor = await Mentor.findById(mentorId);

//     const ticket = {
//         senderName: mentor.firstName + ' ' + mentor.lastName,
//         senderId: mentorId,
//         replayTo: ticketRoomId,
//         text: ticketBody.text,
//         date: new Date().toString()
//     };

//     const addTicket = await TicketRoom.updateOne({_id: ticketRoomId}, {"$addToSet": {
//         "tickets": ticket,
//     }}, { "new": true, "upsert": true });  

//     await TicketRoom.updateOne({_id: ticketRoomId}, {"$set": {
//         "internResponse": false,
//         "mentorResponse": true,
//     }}, { "new": true, "upsert": true });

//     return addTicket;
// };


// const addAudioTicketForTaskByMentor = async(ticketRoomId, mentorId, audioDetails) => {
//     let ticketRoom = await TicketRoom.findOne({ _id: ticketRoomId });
//     if(!ticketRoom) { throw new ApiError(httpStatus.NOT_FOUND, 'TicketRoomNotFound'); };
//     const mentor = await Mentor.findById(mentorId);
    
//     const audioFile = {
//         senderName: mentor.firstName + ' ' + mentor.lastName,
//         filename: audioDetails.filename,
//         mimetype: audioDetails.mimetype,
//         size: audioDetails.size
//     };

//     const ticket = {
//         senderId: mentorId,
//         replayTo: ticketRoomId,
//         audio: audioFile,
//         date: new Date().toString()
//     };

//     const addTicket = await TicketRoom.updateOne({_id: ticketRoomId}, {"$addToSet": {
//         "tickets": ticket,
//     }}, { "new": true, "upsert": true });

//     await TicketRoom.updateOne({_id: ticketRoomId}, {"$set": {
//         "internResponse": false,
//         "mentorResponse": true,
//     }}, { "new": true, "upsert": true });

//     return addTicket;
// };

