const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService, weekService, courseService } = require('../services');
const upload = require('../middlewares/uploadFile');


const creatTask = catchAsync(async(req, res) => {
    const taskBody = req.body;
    const weekId = req.params.weekId;
    const course = await courseService.getCourseBySlug(req.body.course)
    const week = await weekService.getWeekById(weekId);
    const task = await taskService.createTask(taskBody, week, course);
    res.status(httpStatus.CREATED).send(task);
});

const uploadImageForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);

    await upload.uploadSingleImage(req, res);
    const imageDetails = req.file;
    console.log(imageDetails);
    const imageBody = req.body;
    
    const result = await taskService.uploadImageForTask(taskId, imageBody, imageDetails);

    res.send(result)
});


const uploadVideoForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    await upload.uploadSingleVideo(req, res);
    const videoDetails = req.file;
    const videoBody = req.body;
    console.log('videoDetails:', videoDetails);
    
    const result = await taskService.uploadVideoForTask(taskId, videoBody, videoDetails);

    res.status(httpStatus.OK).send(result)
});

const uploadAudioForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    await upload.uploadSingleAudio(req, res);
    const audioDetails = req.file;
    const audioBody = req.body;
    
    const result = await taskService.uploadAudioForTask(taskId, audioBody, audioDetails);

    res.send(result)
});


const uploadPdfFileForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)
    await upload.uploadSinglePdf(req, res);
    const pdfDetail = req.file;
    const pdfBody = req.body;
    const result = await taskService.uploadPdfFileForTask(taskId, pdfBody, pdfDetail);

    res.send(result)
});

const addTestQuizToTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);
    const quiz = req.body;

    const result = await taskService.addTestQuizToTask(taskId, quiz);
    res.status(httpStatus.OK).send(result);
    
});

const responseTestQuiz = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);
    const responseBody = req.body.answer;

    const result = await taskService.responseTestQuiz(taskId, internId, responseBody);
    res.status(httpStatus.OK).send(result);
});

const addDiscriptiveQuizToTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);
    const quiz = req.body;

    const result = await taskService.addDiscriptiveQuizToTask(taskId, quiz);
    res.status(httpStatus.OK).send(result);
    
});

const responseDiscriptiveQuiz = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);
    const responseBody = req.body.answer;

    const result = await taskService.responseDiscriptiveQuiz(taskId, internId, responseBody);
    res.status(httpStatus.OK).send(result);
});

const sendTextMessageInQuizRoom = catchAsync(async(req, res) => {
    const user = req.user;
    const quizRoomId = req.params.quizRoomId;
    const text = req.body.text;
    const result = await taskService.sendTextMessageInQuizRoom(quizRoomId, user, text);
    res.status(httpStatus.OK).send(result);
});

const mentorCheckOutQuizResponse = catchAsync(async(req, res) => {
    const quizRoomId = req. params.quizRoomId;
    const sender = req.user;
    const text = req.body.text;
    const result = await taskService.mentorCheckOutQuizResponse(quizRoomId, sender, text);
    res.status(httpStatus.OK).send(result);
});


const getQuizRoomByRoomId = catchAsync(async(req, res) => {
    const roomId = req.params.roomId;
    const quizRoom = await taskService.getQuizRoomByRoomId(roomId);
    res.status(httpStatus.OK).send(quizRoom);
});

const createTicketRoom = catchAsync(async(req, res) => {
    const user = req.user;
    const taskId = req.params.taskId;
    const text = req.body.text;
    const result = await taskService.createTicketRoom(taskId, user, text);
    res.status(httpStatus.OK).send(result);
});

const getTicketRoomById = catchAsync(async(req, res) => {
    const ticketRoomId = req.params.roomId;
    const ticketRoom = await taskService.getTicketRoomById(ticketRoomId);
    res.status(httpStatus.OK).send(ticketRoom);
});

const getInternTicketRoomList = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await taskService.getInternTicketRoomList(internId, options);
    res.status(httpStatus.OK).send(result);
});

const sendTextMessageInTicketRoom = catchAsync(async(req, res) => {
    const user = req.user;
    const ticketRoomId = req.params.roomId;
    const text = req.body.text;

    const result = await taskService.sendTextMessageInTicketRoom(ticketRoomId, user, text);
    res.status(httpStatus.OK).send(result);
});


const doneTaskAction = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const internId = req.user.id;
    console.log(taskId, internId);
    const task = await taskService.getTaskById(taskId);
    const action = await taskService.getInternTaskAction(taskId, internId);
    const doneTaskAction = await taskService.doneTaskAction(action, task);
    res.status(httpStatus.OK).send(doneTaskAction);
});

const getTaskById = catchAsync(async(req, res) => {
    const internId = req.user.id;
    const task = await taskService.getTaskById(req.params.taskId, internId)
    res.status(httpStatus.OK).send(task);
});

const updateTaskById = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const taskBody = req.body;
    console.log(taskBody);
    const updateTask = await taskService.updateTaskById(taskId, taskBody);
    res.status(httpStatus.OK).send(updateTask);
});

const removeTaskImagesByName = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    filename = req.body.filename;
    const result = await taskService.removeTaskImagesByName(taskId, filename);
    res.status(httpStatus.OK).send(result);
});

const updateTaskImagesByTaskId = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const imageBody = req.body;
    const result = await taskService.updateTaskImagesByTaskId(taskId, imageBody);
    res.status(httpStatus.OK).send(result);
});

const removeTaskVideosByName = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    filename = req.body.filename;
    const result = await taskService.removeTaskVideosByName(taskId, filename);
    res.status(httpStatus.OK).send(result);
});

const updateTaskVideosById = catchAsync(async(req, res) => {
    const videoId = req.params.videoId;
    const videoBody = req.body;
    const result = await taskService.updateTaskVideosById(videoId, videoBody);
    res.status(httpStatus.OK).send(result);
});

const removeTaskAudiosByName = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    removeList = req.body.removeList;
    const result = await taskService.removeTaskAudiosByName(taskId, removeList);
    res.status(httpStatus.OK).send(result);
});

const updateTaskAudiosById = catchAsync(async(req, res) => {
    const videoId = req.params.audioId;
    const audioBody = req.body;
    const result = await taskService.updateTaskAudiosById(videoId, audioBody);
    res.status(httpStatus.OK).send(result);
});

const removeTaskPdfsByName = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    removeList = req.body.removeList;
    const result = await taskService.removeTaskPdfsByName(taskId, removeList);
    res.status(httpStatus.OK).send(result);
});

const updateTaskPdfsById = catchAsync(async(req, res) => {
    const pdfId = req.params.pdfId;
    const pdfBody = req.body;
    const result = await taskService.updateTaskPdfsById(pdfId, pdfBody);
    res.status(httpStatus.OK).send(result);
});

const removeTaskQuizesById = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    removeList = req.body.removeList;
    const result = await taskService.removeTaskQuizesById(taskId, removeList);
    res.status(httpStatus.OK).send(result);
});

const updateTaskQuizesById = catchAsync(async(req, res) => {
    const quizId = req.params.quizId;
    const quizBody = req.body;
    const result = await taskService.updateTaskQuizesById(quizId, quizBody);
    res.status(httpStatus.OK).send(result);
});

const getPdfFile = catchAsync(async(req, res) => {
    const filename = req.params.filename;
    const pdfFile = await taskService.getPdfFile(filename);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(httpStatus.OK).send(pdfFile);
});

const getVideofile = catchAsync(async(req, res) => {
    const filename = req.params.filename;
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename=' + filename)
    const videoFile = await taskService.getVideofile(filename, req, res);
});

const getAudiofile = catchAsync(async(req, res) => {
    const filename = req.params.filename;
    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Disposition', 'inline; filename=' + filename)
    const videoFile = await taskService.getAudiofile(filename, req, res);
});

const deleteTaskById = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    const result = await taskService.deleteTaskById(task);
    res.status(httpStatus.OK).send(result); 
});

const getTaskVideos = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const videos = await taskService.getTaskVideos(taskId);
    res.status(httpStatus.OK).send(videos);
});

const getTaskImages = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const images = await taskService.getTaskImages(taskId);
    res.status(httpStatus.OK).send(images);
});

const getTaskAudios = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const videos = await taskService.getTaskAudios(taskId);
    res.status(httpStatus.OK).send(videos);
});

const getTaskPdfs = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const pdfs = await taskService.getTaskPdfs(taskId);
    res.status(httpStatus.OK).send(pdfs);
});

const getQuizRoomByTaskId = catchAsync(async(req, res) => {
    const internId = req.user;
    const taskId = req.params.taskId;
    const quizDeatils = await taskService.getQuizRoomByTaskId(internId, taskId);
    res.status(httpStatus.OK).send(quizDeatils);
});



module.exports = {
    creatTask,
    uploadImageForTask,
    uploadVideoForTask,
    uploadAudioForTask,
    uploadPdfFileForTask,
    getQuizRoomByRoomId,
    getTicketRoomById,
    getInternTicketRoomList,
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
    getTaskImages,
    getTaskAudios,
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



// const createQuizForTask = catchAsync(async(req, res) => {
//     const taskId = req.params.taskId;
//     await taskService.getTaskById(taskId)

//     const quiz = req.body;
//     const result = await taskService.createQuizForTask(taskId, quiz);

//     res.send(result)
// });

// const sendTextResToQuizByIntern = catchAsync(async(req, res) => {
//     const internId = req.user.id;
//     const taskId = req.params.taskId;
//     const text = req.body.text;
//     await taskService.getTaskById(taskId);
//     const result = await taskService.sendTextResToQuizByIntern(taskId, internId, text)
//     res.status(httpStatus.OK).send(result);
// });

// const sendAudioResToQuizByIntern = catchAsync(async(req, res) => {
//     const internId = req.user.id;
//     const taskId = req.params.taskId;
//     const task = await taskService.getTaskById(taskId);
//     if(!task) { throw new ApiError(httpStatus.NOT_FOUND, 'TaskNotFound'); };
//     await upload.uploadSingleAudio(req, res);
//     const audioDetails = req.file;
//     const result = await taskService.sendAudioResToQuizByIntern(taskId, internId, audioDetails)
//     res.status(httpStatus.OK).send(result);
// });

// const sendTextResToQuizByMentor = catchAsync(async(req, res) => {
//     const mentorId = req.user.id;
//     const quizRoomId = req.params.quizRoomId;
//     const text = req.body.text;
//     const result = await taskService.sendTextResToQuizByMentor(quizRoomId, mentorId, text)
//     res.status(httpStatus.OK).send(result);
// });

// const sendAudioResToQuizByMentor = catchAsync(async(req, res) => {
//     const mentorId = req.user.id;
//     const quizRoomId = req.params.quizRoomId;
//     await upload.uploadSingleAudio(req, res);
//     const audioDetails = req.file;
//     const result = await taskService.sendAudioResToQuizByMentor(quizRoomId, mentorId, audioDetails)
//     res.status(httpStatus.OK).send(result);
// });






// addTextTicketForTaskByIntern,
// addAudioTicketForTaskByIntern,
// addTextTicketForTaskByMentor,
// addAudioTicketForTaskByMentor,

// const addTextTicketForTaskByIntern = catchAsync(async(req, res) => {
//     const internId = req.user.id;
//     const taskId = req.params.taskId;
//     await taskService.getTaskById(taskId)
//     const ticketBody = req.body;
//     const result = await taskService.addTextTicketForTaskByIntern(taskId, internId, ticketBody);
//     res.status(httpStatus.OK).send(result);
// });

// const addAudioTicketForTaskByIntern = catchAsync(async(req, res) => {
//     const internId = req.user.id;
//     const taskId = req.params.taskId;
//     await taskService.getTaskById(taskId)
//     await upload.uploadSingleAudio(req, res);
//     const audioDetails = req.file;
//     const result = await taskService.addAudioTicketForTaskByIntern(taskId, internId, audioDetails);
//     res.status(httpStatus.OK).send(result);
// });

// const addTextTicketForTaskByMentor = catchAsync(async(req, res) => {
//     const mentorId = req.user.id;
//     const ticketRoomId = req.params.ticketRoomId;
//     const ticketBody = req.body;
//     const result = await taskService.addTextTicketForTaskByMentor(ticketRoomId, mentorId, ticketBody);
//     res.status(httpStatus.OK).send(result);
// });

// const addAudioTicketForTaskByMentor = catchAsync(async(req, res) => {
//     const mentorId = req.user.id;
//     const ticketRoomId = req.params.ticketRoomId;
//     await upload.uploadSingleAudio(req, res);
//     const audioDetails = req.file;
//     const result = await taskService.addAudioTicketForTaskByMentor(ticketRoomId, mentorId, audioDetails);
//     res.status(httpStatus.OK).send(result);
// });
