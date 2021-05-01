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
    await taskService.getTask(taskId)

    

    await upload.uploadVideo(req, res);
    const videoDetails = req.files;
    const videoBody = req.body;
    
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
    await taskService.getTask(taskId)

    

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
    const responseId = req.params.responseId;
    const text = req.body.text;
    const result = await taskService.sendTextResToQuizByMentor(responseId, mentorId, text)
    res.status(httpStatus.OK).send(result);
});

const sendAudioResToQuizByMentor = catchAsync(async(req, res) => {
    const mentorId = "6087b8ac104caa2307e68567";
    const responseId = req.params.responseId;
    await upload.uploadSingleAudio(req, res);
    const audioDetails = req.file;
    const result = await taskService.sendAudioResToQuizByMentor(responseId, mentorId, audioDetails)
    res.status(httpStatus.OK).send(result);
});

const addTextTicketForTaskByIntern = catchAsync(async(req, res) => {
    try {
        const taskId = req.params.taskId;
        await taskService.getTaskById(taskId)
        const ticketBody = req.body;
        const result = await taskService.addTextTicketForTaskByIntern(taskId, ticketBody);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

const addAudioTicketForTaskByIntern = catchAsync(async(req, res) => {
    try {
        const taskId = req.params.taskId;
        await taskService.getTaskById(taskId)
        await upload.uploadSingleAudio(req, res);
        const audioDetails = req.file;
        const result = await taskService.addAudioTicketForTaskByIntern(taskId, audioDetails);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

const addTextTicketForTaskByMentor = catchAsync(async(req, res) => {
    try {
        const mentorId = "6087b8ac104caa2307e68567";
        const ticketId = req.params.ticketId;
        const ticketBody = req.body;
        const result = await taskService.addTextTicketForTaskByMentor(ticketId, mentorId, ticketBody);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

const addAudioTicketForTaskByMentor = catchAsync(async(req, res) => {
    try {
        const mentorId = "6087b8ac104caa2307e68567";
        const ticketId = req.params.ticketId;
        await upload.uploadSingleAudio(req, res);
        const audioDetails = req.file;
        const result = await taskService.addAudioTicketForTaskByMentor(ticketId, mentorId, audioDetails);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});


const doneTaskAction = catchAsync(async(req, res) => {
    const taskId = req.params.taskId;
    const internId = "6087b87b104caa2307e68566"; // req.user._id
    const task = await taskService.getTaskById(taskId);
    console.log(task);
    const action = await taskService.getInternTaskAction(taskId, internId);
    const doneTaskAction = await taskService.doneTaskAction(action, task);
    res.status(httpStatus.OK).send('success');
});

const getTask = catchAsync(async(req, res) => {
    const task = await taskService.getTaskById(req.params.taskId)
    res.status(httpStatus.OK).send(task);
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
    getTask,
};