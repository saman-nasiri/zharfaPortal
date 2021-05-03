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
        .get(taskController.getTaskById)

router
    .route('/done/:taskId')
        .post(taskController.doneTaskAction)

router
    .route('/upload/images/:taskId')
        .post(taskController.uploadImageForTask)

router
    .route('/upload/videos/:taskId')
        .post(taskController.uploadVideoForTask)

router
    .route('/upload/audios/:taskId')
        .post(taskController.uploadAudioForTask)

router
    .route('/upload/pdfs/:taskId')
        .post(taskController.uploadPdfFileForTask)

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
    .route('/quiz/text-res/mentor/:quizResponseRoomId')
        .post(taskController.sendTextResToQuizByMentor);

router
    .route('/quiz/audio-res/mentor/:quizResponseRoomId')
        .post(taskController.sendAudioResToQuizByMentor);

router
    .route('/ticket/text/intern/:taskId')
        .post(taskController.addTextTicketForTaskByIntern);

router
    .route('/ticket/audio/intern/:taskId')
        .post(taskController.addAudioTicketForTaskByIntern);

router
    .route('/ticket/text/mentor/:ticketId')
        .post(taskController.addTextTicketForTaskByMentor);

router
    .route('/ticket/audio/mentor/:ticketId')
        .post(taskController.addAudioTicketForTaskByMentor);

module.exports = router;



