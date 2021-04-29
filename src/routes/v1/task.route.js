const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const taskController = require('../../controllers/task.controller');

const router = express.Router();


router
    .route('/creat-task/:weekId')
        .post(taskController.creatTask);

router
    .route('/:taskId')
        .get(taskController.getTask)
        .post(taskController.uploadImageForTask)

router
    .route('/done/:taskId')
        .post(taskController.doneTaskAction)

router
    .route('/quiz/create/:taskId')
        .post(taskController.createQuizForTask);

router
    .route('/quiz/text-res/intern/:taskId')
        .post(taskController.sendTextResToQuizByIntern);

router
    .route('/quiz/audio-res/intern/:taskId')
        .post(taskController.sendAudioResToQuizByIntern);

router
    .route('/quiz/audio-res/mentor/:responseId')
        .post(taskController.sendAudioResToQuizByMentor);

router
    .route('/quiz/audio-res/mentor/:responseId')
        .post(taskController.sendAudioResToQuizByMentor);

router
    .route('/text-ticket/intern-add/:taskId')
        .post(taskController.addTextTicketForTaskByIntern);

router
    .route('/audio-ticket/intern-add/:taskId')
        .post(taskController.addAudioTicketForTaskByIntern);

router
    .route('/text-ticket/mentor-res/:ticketId')
        .post(taskController.addTextTicketForTaskByMentor);

router
    .route('/audio-ticket/mentor-res/:ticketId')
        .post(taskController.addAudioTicketForTaskByMentor);

router
    .route('/upload/videos/:taskId')
        .post(taskController.uploadVideoForTask)

router
    .route('/upload/audios/:taskId')
        .post(taskController.uploadAudioForTask)

router
    .route('/upload/pdfs/:taskId')
        .post(taskController.uploadPdfFileForTask)

module.exports = router;



