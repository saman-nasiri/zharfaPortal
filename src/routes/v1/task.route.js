const express = require('express');
const auth = require('../../middlewares/auth');
const { scope } = require('../../config/roles');
const validate = require('../../middlewares/validate');
const taskValidation = require('../../validations/task.validation');
const taskController = require('../../controllers/task.controller');

const router = express.Router();


router
    .route('/creat-task/:weekId')
        .post(auth(scope.CREATE_TERM), taskController.creatTask);

router
    .route('/:taskId')
        .get(auth(scope.READ_TASK_BY_ID), validate(taskValidation.getTaskById), taskController.getTaskById)
        .delete(taskController.deleteTaskById)

router
    .route('/done/:taskId')
        .post(auth(scope.DONE_TASK), validate(taskValidation.doneTaskAction), taskController.doneTaskAction)

router
    .route('/upload/images/:taskId')
        .post(auth(scope.UPLOAD_TASK_IMAGE), validate(taskValidation.uploadImageForTasks), taskController.uploadImageForTask)

router
    .route('/upload/videos/:taskId')
        .post(auth(scope.UPLOAD_TASK_VIDEO), validate(taskValidation.uploadVideoForTask), taskController.uploadVideoForTask)

router
    .route('/upload/audios/:taskId')
        .post(auth(scope.UPLOAD_TASK_AUDIO), validate(taskValidation.uploadAudioForTask), taskController.uploadAudioForTask)

router
    .route('/upload/pdfs/:taskId')
        .post(auth(scope.UPLOAD_TASK_PDF), validate(taskValidation.uploadPdfForTask), taskController.uploadPdfFileForTask)

router
    .route('/quiz-room/:taskId')
        .get(auth(scope.READ_QUIZ_ROOM), taskController.getQuizRoomByTaskId);

router
    .route('/quiz-room/:roomId')
        .get(auth(scope.READ_QUIZ_ROOM), validate(taskValidation.getQuizRoomById), taskController.getQuizRoomByRoomId);

router
    .route('/add-quiz/test/:taskId')
        .post(taskController.addTestQuizToTask);

router
    .route('/res-quiz/test/:taskId')
        .post(auth(scope.RES_QUIZ), taskController.responseTestQuiz);

router
    .route('/add-quiz/discriptive/:taskId')
        .post(taskController.addDiscriptiveQuizToTask);

router
    .route('/res-quiz/discriptive/:taskId')
        .post(auth(scope.RES_QUIZ), taskController.responseDiscriptiveQuiz)

router
    .route('/quiz-room/send-message/:quizRoomId')
        .post(auth(scope.SEND_MESSAGE), taskController.sendTextMessageInQuizRoom)

router
    .route('/quiz/create/:taskId')
        .post(auth(scope.CREATE_QUIZ), validate(taskValidation.createQuizForTask), taskController.createQuizForTask);

router
    .route('/quiz/text-res/intern/:taskId')
        .post(auth(scope.RES_QUIZ), validate(taskValidation.sendResToQuizByIntern), taskController.sendTextResToQuizByIntern);

router
    .route('/quiz/audio-res/intern/:taskId')
        .post(auth(scope.RES_QUIZ), validate(taskValidation.sendResToQuizByIntern),  taskController.sendAudioResToQuizByIntern);

router
    .route('/quiz/text-res/mentor/:quizResponseRoomId')
        .post(auth(scope.RES_QUIZ), validate(taskValidation.sendResToQuizByMentor),  taskController.sendTextResToQuizByMentor);

router
    .route('/quiz/audio-res/mentor/:quizResponseRoomId')
        .post(auth(scope.RES_QUIZ), validate(taskValidation.sendResToQuizByMentor),  taskController.sendAudioResToQuizByMentor);

router
    .route('/ticket/room/:roomId')
        .get(auth(scope.READ_TICKET_ROOM), validate(taskValidation.getTaskById), taskController.getTicketRoomById);

router
    .route('/ticket/text/intern/:taskId')
        .post(auth(scope.SEND_TICKET_TEXT), validate(taskValidation.sendTicketByIntern), taskController.addTextTicketForTaskByIntern);

router
    .route('/ticket/audio/intern/:taskId')
        .post(auth(scope.SEND_TICKET_AUDIO), validate(taskValidation.sendTicketByIntern),  taskController.addAudioTicketForTaskByIntern);

router
    .route('/ticket/text/mentor/:ticketRoomId')
        .post(auth(scope.SEND_TICKET_TEXT), validate(taskValidation.sendTicketByMentor),  taskController.addTextTicketForTaskByMentor);

router
    .route('/ticket/audio/mentor/:ticketRoomId')
        .post(auth(scope.SEND_TICKET_AUDIO), validate(taskValidation.sendTicketByMentor),  taskController.addAudioTicketForTaskByMentor);

router
    .route('/update/:taskId')
        .put(auth(scope.UPDATE_TASK), validate(taskValidation.updateTaskById), taskController.updateTaskById)

router
    .route('/remove-image/:taskId')
        .delete(auth(scope.DELETE_TASK_IMAGE), validate(taskValidation.removeTaskImagesByName), taskController.removeTaskImagesByName)

router
    .route('/update-image/:imageId')
        .put(auth(scope.UPDATE_TASK_IMAGE_PROPERTY), validate(taskValidation.updateTaskImagesById),  taskController.updateTaskImagesById)

router
    .route('/remove-video/:taskId')
        .delete(auth(scope.REMOVE_TASK_VIDEO), validate(taskValidation.removeTaskVideosByName),  taskController.removeTaskVideosByName)

router
    .route('/update-video/:videoId')
        .put(auth(scope.UPDATE_TASK_VIDEO_PROPERTY), validate(taskValidation.updateTaskVideosById),  taskController.updateTaskVideosById)

router
    .route('/remove-audio/:taskId')
        .delete(auth(scope.REMOVE_TASK_AUDIO), validate(taskValidation.removeTaskAudiosByName), taskController.removeTaskAudiosByName)

router
    .route('/update-audio/:audioId')
        .put(auth(scope.UPDATE_TASK_AUDIO_PROPERTY), validate(taskValidation.updateTaskAudiosById), taskController.updateTaskAudiosById)

router
    .route('/remove-pdf/:taskId')
        .delete(auth(scope.REMOVE_TASK_PDF), validate(taskValidation.removeTaskPdfsByName), taskController.removeTaskPdfsByName)

router
    .route('/update-pdf/:pdfId')
        .put(auth(scope.UPDATE_TASK_PDF_PROPERTY), validate(taskValidation.updateTaskPdfsById), taskController.updateTaskPdfsById)

router
    .route('/remove-quiz/:taskId')
        .delete(auth(scope.DELETE_QUIZ), validate(taskValidation.removeTaskQuizesById), taskController.removeTaskQuizesById)

router
    .route('/update-quiz/:quizId')
        .put(auth(scope.UPDATE_QUIZ), validate(taskValidation.updateTaskQuizesById), taskController.updateTaskQuizesById)

router
    .route('/download-pdf/:filename')
        .get(auth(scope.DOWNLOAD_FILE), validate(taskValidation.downloadFile),  taskController.getPdfFile);

router
    .route('/play-video/:filename')
        .get(auth(scope.PLAY_VIDEO), validate(taskValidation.playFile), taskController.getVideofile);

router
    .route('/play-audio/:filename')
        .get(auth(scope.PLAY_AUDIO), validate(taskValidation.playFile), taskController.getAudiofile);

        

// Term File Route
router
    .route('/videos/:taskId')
        .get(auth(scope.READ_FILE), validate(taskValidation.getTermFile), taskController.getTaskVideos)
router
    .route('/images/:taskId')
        .get(auth(scope.READ_FILE), validate(taskValidation.getTermFile), taskController.getTaskImages)
router
    .route('/audios/:taskId')
        .get(auth(scope.READ_FILE), validate(taskValidation.getTermFile), taskController.getTaskAudios)
router
    .route('/pdfs/:taskId')
        .get(auth(scope.READ_FILE), validate(taskValidation.getTermFile), taskController.getTaskPdfs)


module.exports = router;



