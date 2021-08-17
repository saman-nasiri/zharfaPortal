const httpStatus = require('http-status');
const fse = require('fs-extra');
const path = require('path');
const { Task, Week, TicketRoom, InternTaskAction, InternWeekAction, QuizRoom, Intern } = require('../models');
const ApiError = require('../utils/ApiError');
const { data } = require('../config/logger');
const { slsp, arrayShow } = require('../utils/defaultArrayType');

/**
 * Create a user
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody, week, course) => {

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

        await Week.updateOne({ _id: task.weekId }, { "$inc": {
            duration: task.duration
        }}, { "new": true, "upsert": true });

        return task;

};

const uploadImageForTask = async(taskId, imageBody, imageDetail) => {
    try {
        
        // const imageModel = imageDetails.map((imageDetail) => {

        //     const image = {
        //         title: imageBody.title,
        //         description: imageBody.description,
        //         filename: imageDetail.filename,
        //         mimetype: imageDetail.mimetype,
        //         size: imageDetail.size
        //     };

        //     return image;
        // });

        const imageModel = {
            title: imageBody.title,
            description: imageBody.description,
            filename: imageDetail.filename,
            mimetype: imageDetail.mimetype,
            size: imageDetail.size
        };
        
        const updatedTask = await Task.updateOne({_id: taskId}, {"$set": {
            "image": imageModel
        }}, { "new": true, "upsert": true });  
        
        return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
};

const uploadVideoForTask = async(taskId, videoBody, videoDetail) => {
    const videoModel = {
        title: videoBody.title,
        description: videoBody.description,
        filename: videoDetail.filename,
        mimetype: videoDetail.mimetype,
        size: videoDetail.size
    };
    
    const updatedTask = await Task.updateOne({_id: taskId}, {"$set": {
        "video": videoModel
    }}, { "new": true, "upsert": true });  
    
    return updatedTask;
    
};


const uploadAudioForTask = async(taskId, audioBody, audioDetail) => {
    try {

          
        const audioModel = {
            title: audioBody.title,
            description: audioBody.description,
            filename: audioDetail.filename,
            mimetype: audioDetail.mimetype,
            size: audioDetail.size
        };

        const updatedTask = await Task.updateOne({_id: taskId}, {"$set": {
            "audio": audioModel 
        }}, { "new": true, "upsert": true });  
        
    return updatedTask;
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
};


const uploadPdfFileForTask = async(taskId, pdfBody, pdfDetail) => {
        

        const pdfModel = {
            title: pdfBody.title,
            description: pdfBody.description,
            filename: pdfDetail.filename,
            mimetype: pdfDetail.mimetype,
            size: pdfDetail.size
        }; 


        const updatedTask = await Task.updateOne({_id: taskId}, {"$set": {
            "pdf": pdfModel 
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

    const addQuiz = await Task.findOneAndUpdate({ _id: taskId }, { "$set": {
        "discriptiveQuiz": true,
        "quiz": questionModel
    }}, { "new": true, "upsert": true });

    return { body: addQuiz, status: 200, message: 'Success'};
};

const responseDiscriptiveQuiz = async(taskId, internId, responseBody) => {
    let quizRoom = await QuizRoom.findOne({ taskId: taskId, internId: internId });
    if(!quizRoom) { quizRoom = await QuizRoom.create({ taskId: taskId, internId: internId }); };
    const intern = await Intern.findById(internId);

    const responsed = await QuizRoom.findOneAndUpdate({_id: quizRoom._id}, {"$set": {
        "discriptiveAnswer": responseBody,
        "internResponse": true,
        "mentorResponse": false,
    }}, { "new": true, "upsert": true });

    return { body: responsed, status: 200, message: 'Success'};
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
    const task = await Task.findOne({ _id: taskId });
    if(!task) { throw new ApiError(httpStatus.NOT_FOUND, "TaskNotFound") };
    let ticketRoom = await TicketRoom.findOne({ taskId: taskId, internId: sender.id });
    if(!ticketRoom) { ticketRoom = await TicketRoom.create({ title: task.title, taskId: taskId, internId: sender.id, week: task.weekId })};

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

const getInternTicketRoomList = async(internId, options) => {    
    const {sort, limit, skip, page} = slsp(options);

    const ticketRooms = await TicketRoom.find({ internId: internId })
    .populate({ path: 'week', select: 'title order' })
    .select("-ticketContent")

    const sortArray = await ticketRooms.sort(function(a, b) { return a.week.order - b.week.order })
    const result = arrayShow(sortArray, limit, page);

    return result;
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

        return { 
                statusCode: 200,
                message: 'Done Success'
            }
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

        return { 
            statusCode: 200,
            message: 'UnDone Success'
        }
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
            task["mentorAnswer"] = quizRoom.mentorAnswer.text
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

const removeTaskImagesByName = async(taskId, filename) => {
    const result = await Task.updateOne({ _id: taskId }, { "$unset": {
        "image": { filename: filename },
    }}, { "new": true, "upsert": true });

    fse.unlinkSync(`./public/files/images/${filename}`)    
    

    return result;
};

// const updateTaskImagesById = async(imageId, imageBody) => {
//     const result = await Task.updateOne({ "images._id": imageId }, { "$set": {
//         "images.$.title": imageBody.title,
//         "images.$.description": imageBody.description,
//     }}, { "new": true, "upsert": true });

//     return result;
// };

const updateTaskImagesByTaskId = async(taskId, imageBody) => {
    const result = await Task.updateOne({ _id: taskId }, { "$set": {
        "image.title": imageBody.title,
        "image.description": imageBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

// const removeTaskVideosByName = async(taskId, removeList) => {
//     const result = await Task.updateOne({ _id: taskId }, { "$pull": {
//         "videos": { filename: removeList },
//     }}, { "new": true, "upsert": true });

//     removeList.forEach((file) => {
//         fse.unlinkSync(`./public/files/videos/${file}`)    
//     });

//     return result;
// };

const removeTaskVideosByName = async(taskId, filename) => {
        const result = await Task.updateOne({ _id: taskId }, { "$unset": {
            "video": { filename: filename },
        }}, { "new": true, "upsert": true });
    
        fse.unlinkSync(`./public/files/videos/${file}`)    
    
        return result;
    };

const updateTaskVideosById = async(taskId, videoBody) => {
    const result = await Task.updateOne({ _id: taskId }, { "$set": {
        "video.title": videoBody.title,
        "video.description": videoBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

const removeTaskAudiosByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$unset": {
        "audio": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/files/audios/${file}`)    
    });

    return result;
};

const updateTaskAudiosById = async(taskId, audioBody) => {
    const result = await Task.updateOne({ _id: taskId }, { "$set": {
        "audio.title": audioBody.title,
        "audio.description": audioBody.description,
    }}, { "new": true, "upsert": true });

    return result;
};

const removeTaskPdfsByName = async(taskId, removeList) => {
    const result = await Task.updateOne({ _id: taskId }, { "$unset": {
        "pdf": { filename: removeList },
    }}, { "new": true, "upsert": true });

    removeList.forEach((file) => {
        fse.unlinkSync(`./public/files/pdfs/${file}`)    
    });

    return result;
};

const updateTaskPdfsById = async(taskId, pdfBody) => {
    const result = await Task.updateOne({ _id: taskId }, { "$set": {
        "pdf.title": pdfBody.title,
        "pdf.description": pdfBody.description,
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
    const filePath = path.join('public', 'files', 'pdfs', filename);
    const file = await fse.readFile(filePath, data);
    return file;
};

const getVideofile = async(filename, req, res) => {
    const range = req.headers.range;
    const videoPath = path.join('public', 'files', 'videos', filename);
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
    const range = req.headers.range;
    const videoPath = path.join('public', 'files', 'audios', filename);
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


const deleteTaskById = async(task) => {


        if(task.audio) {
            fse.removeSync(`./public/files/audios/${task.audio.filename}`);
        }

        if(task.video) {
            fse.removeSync(`./public/files/videos/${task.video.filename}`);
        }

        if(task.image) {
            fse.removeSync(`./public/files/images/${task.image.filename}`);
        }

        if(task.pdf) {
            fse.removeSync(`./public/files/pdfs/${task.pdf.filename}`);
        }
        
        await Week.updateOne({ _id: task.weekId }, { "$inc": {
            duration: -task.duration
        }}, { "new": true, "upsert": true })
    
        const result = await Task.deleteOne({ _id: task._id }); 
        return result;
};


const getTaskVideos = async(taskId) => {

    await getTaskById(taskId);

    const tasks = await Task.findOne({ _id: taskId }).lean()
    .select("title video")

    return tasks;
};

const getTaskImages = async(taskId) => {

    await getTaskById(taskId);

    const images = await Task.findOne({ _id:  taskId }).lean()
    .select("title image")


    return images;
};

const getTaskAudios = async(taskId) => {

    await getTaskById(taskId);
    const tasks = await Task.findOne({ _id:  taskId }).lean()
    .select("title audio")

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
    // .select('-taskId -internId')
    if(!quizRoom) { throw new ApiError(httpStatus.NOT_FOUND, "QuizRoomNotFound") };

    if(task.testQuiz === true) {
        quizDetails = {
            title: task.title,
            question: task.quiz,
            answer: quizRoom.testAnswer,
            // chatRoom: quizRoom
        }

        return quizDetails;
    }
    else if(task.discriptiveQuiz) {
        quizDetails = {
            title: task.title,
            question: task.quiz,
            answer: quizRoom.discriptiveAnswer,
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
    getInternTicketRoomList,
    getInternTaskAction,
    doneTaskAction,
    getTaskById,
    updateTaskById,
    removeTaskImagesByName,
    updateTaskImagesByTaskId,
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

