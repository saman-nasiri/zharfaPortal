const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const taskValidation = require('../../validations/task.validation');
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
    .route('/quiz/room/:roomId')
        .get(taskController.getQuizRoomById);

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
    .route('/ticket/room/:roomId')
        .get(taskController.getTicketRoomById);

router
    .route('/ticket/text/intern/:taskId')
        .post(taskController.addTextTicketForTaskByIntern);

router
    .route('/ticket/audio/intern/:taskId')
        .post(taskController.addAudioTicketForTaskByIntern);

router
    .route('/ticket/text/mentor/:ticketRoomId')
        .post(taskController.addTextTicketForTaskByMentor);

router
    .route('/ticket/audio/mentor/:ticketRoomId')
        .post(taskController.addAudioTicketForTaskByMentor);

router
    .route('/update/:taskId')
        .put(validate(taskValidation.updateTaskById), taskController.updateTaskById)

router
    .route('/remove-image/:taskId')
        .delete(taskController.removeTaskImagesByName)

router
    .route('/update-image/:imageId')
        .put(taskController.updateTaskImagesById)

router
    .route('/remove-video/:taskId')
        .delete(taskController.removeTaskVideosByName)

router
    .route('/update-video/:videoId')
        .put(taskController.updateTaskVideosById)

router
    .route('/remove-audio/:taskId')
        .delete(taskController.removeTaskAudiosByName)

router
    .route('/update-audio/:audioId')
        .put(taskController.updateTaskAudiosById)

router
    .route('/remove-pdf/:taskId')
        .delete(taskController.removeTaskPdfsByName)

router
    .route('/update-pdf/:pdfId')
        .put(taskController.updateTaskPdfsById)

router
    .route('/remove-quiz/:taskId')
        .delete(taskController.removeTaskQuizesById)

router
    .route('/update-quiz/:quizId')
        .put(taskController.updateTaskQuizesById)

router
    .route('/download-pdf/:filename')
        .get(taskController.getPdfFile);

router
    .route('/play-video/:filename')
        .get(taskController.getVideofile);

router
    .route('/play-audio/:filename')
        .get(taskController.getAudiofile);


        
module.exports = router;



