const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService, weekService } = require('../services');
const upload = require('../middlewares/uploadFile');


const creatTask = catchAsync(async(req, res) => {
    const taskBody = req.body;
    const weekId = req.params.weekId;
    const task = await taskService.createTask(req.body, weekId);
    await weekService.updateWeekDuration(weekId, task);
    res.status(httpStatus.CREATED).send(task);
});

const uploadImageForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId);

    await upload.uploadImage(req, res);
    const imageDetails = req.files;
    const imageBody = req.body;
    
    const result = await taskService.uploadImageForTask(taskId, imageBody, imageDetails);

    res.send(result)
});


const uploadVideoForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    await upload.uploadVideo(req, res);
    const videoDetails = req.files;
    const videoBody = req.body;
    console.log(videoBody);
    const result = await taskService.uploadVideoForTask(taskId, videoBody, videoDetails);

    res.send(result)
});

const uploadAudioForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    

    await upload.uploadAudio(req, res);
    const audioDetails = req.files;
    const audioBody = req.body;
    
    const result = await taskService.uploadAudioForTask(taskId, audioBody, audioDetails);

    res.send(result)
});


const uploadPdfFileForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    await upload.uploadPdf(req, res);
    const pdfDetails = req.files;
    const pdfBody = req.body;
    
    const result = await taskService.uploadPdfFileForTask(taskId, pdfBody, pdfDetails);

    res.send(result)
});

const createQuizForTask = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    await taskService.getTaskById(taskId)

    const quiz = req.body;
    console.log(quiz);
    const result = await taskService.createQuizForTask(taskId, quiz);

    res.send(result)
});

const sendTextResToQuizByIntern = catchAsync(async(req, res) => {
    const internId = "6087b87b104caa2307e68566";
    const taskId = req.params.taskId;
    const text = req.body.text;
    await taskService.getTaskById(taskId);
    const result = await taskService.sendTextResToQuizByIntern(taskId, internId, text)
    res.status(httpStatus.OK).send(result);
});

const sendAudioResToQuizByIntern = catchAsync(async(req, res) => {
    const internId = "6087b87b104caa2307e68566";
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    if(!task) { throw new ApiError(httpStatus.NOT_FOUND, 'TaskNotFound'); };
    await upload.uploadSingleAudio(req, res);
    const audioDetails = req.file;
    const result = await taskService.sendAudioResToQuizByIntern(taskId, internId, audioDetails)
    res.status(httpStatus.OK).send(result);
});

const sendTextResToQuizByMentor = catchAsync(async(req, res) => {
    const mentorId = "6087b8ac104caa2307e68567";
    const quizResponseRoomId = req.params.quizResponseRoomId;
    const text = req.body.text;
    const result = await taskService.sendTextResToQuizByMentor(quizResponseRoomId, mentorId, text)
    res.status(httpStatus.OK).send(result);
});

const sendAudioResToQuizByMentor = catchAsync(async(req, res) => {
    const mentorId = "6087b8ac104caa2307e68567";
    const quizResponseRoomId = req.params.quizResponseRoomId;
    await upload.uploadSingleAudio(req, res);
    const audioDetails = req.file;
    const result = await taskService.sendAudioResToQuizByMentor(quizResponseRoomId, mentorId, audioDetails)
    res.status(httpStatus.OK).send(result);
});

const addTextTicketForTaskByIntern = catchAsync(async(req, res) => {
        const internId = "6087b87b104caa2307e68566";
        const taskId = req.params.taskId;
        await taskService.getTaskById(taskId)
        const ticketBody = req.body;
        const result = await taskService.addTextTicketForTaskByIntern(taskId, internId, ticketBody);
        res.status(httpStatus.OK).send(result);
});

const addAudioTicketForTaskByIntern = catchAsync(async(req, res) => {
        const internId = "6087b87b104caa2307e68566";
        const taskId = req.params.taskId;
        await taskService.getTaskById(taskId)
        await upload.uploadSingleAudio(req, res);
        const audioDetails = req.file;
        const result = await taskService.addAudioTicketForTaskByIntern(taskId, internId, audioDetails);
        res.status(httpStatus.OK).send(result);
});

const addTextTicketForTaskByMentor = catchAsync(async(req, res) => {
        const mentorId = "6087b8ac104caa2307e68567";
        const ticketRoomId = req.params.ticketRoomId;
        const ticketBody = req.body;
        const result = await taskService.addTextTicketForTaskByMentor(ticketRoomId, mentorId, ticketBody);
        res.status(httpStatus.OK).send(result);
});

const addAudioTicketForTaskByMentor = catchAsync(async(req, res) => {
        const mentorId = "6087b8ac104caa2307e68567";
        const ticketRoomId = req.params.ticketRoomId;
        await upload.uploadSingleAudio(req, res);
        const audioDetails = req.file;
        const result = await taskService.addAudioTicketForTaskByMentor(ticketRoomId, mentorId, audioDetails);
        res.status(httpStatus.OK).send(result);
});


const doneTaskAction = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const internId = "6087b87b104caa2307e68566"; // req.user._id
    const task = await taskService.getTaskById(taskId);
    const action = await taskService.getInternTaskAction(taskId, internId);
    const doneTaskAction = await taskService.doneTaskAction(action, task);
    res.status(httpStatus.OK).send({ message: 'Done Success'});
});

const getTaskById = catchAsync(async(req, res) => {
    const internId = "6087b87b104caa2307e68566"; // req.user._id
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
    removeList = req.body.removeList;
    const result = await taskService.removeTaskImagesByName(taskId, removeList);
    res.status(httpStatus.OK).send(result);
});

const updateTaskImagesById = catchAsync(async(req, res) => {
    const imageId = req.params.imageId;
    const imageBody = req.body;
    const result = await taskService.updateTaskImagesById(imageId, imageBody);
    res.status(httpStatus.OK).send(result);
});

const removeTaskVideosByName = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    removeList = req.body.removeList;
    const result = await taskService.removeTaskVideosByName(taskId, removeList);
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

module.exports = {
    creatTask,
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
    getAudiofile

};