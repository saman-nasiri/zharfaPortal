const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const createTask = {
    params: Joi.object().keys({
        weekId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        course: Joi.string(),
        content: Joi.string(),
        duration: Joi.number(),
        order: Joi.number()
    }),
};

const getTaskById = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const doneTaskActin = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const uploadImageForTask = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
    }),
};

const uploadVideoForTask = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
    }),
};

const uploadAudioForTask = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
    }),
};

const uploadPdfForTask = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
    }),
};

const getQuizRoomById = {
    params: Joi.object().keys({
        roomId: Joi.string().custom(objectId),
    }),
};

const createQuizForTask = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.array().items({
        description: Joi.string(),
        alternatives: Joi.array()
    })
};

const updateTaskById = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
            title: Joi.string(),
            order:Joi.number(), 
            content:Joi.string(),
            duration:Joi.number(),
        }),
};


const sendResToQuizByIntern = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const sendResToQuizByMentor = {
    params: Joi.object().keys({
        quizResponseRoomId: Joi.string().custom(objectId),
    }),
};

const getTicketRoomById = {
    params: Joi.object().keys({
        roomId: Joi.string().custom(objectId),
    }),
};

const sendTicketByIntern = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const sendTicketByMentor = {
    params: Joi.object().keys({
        ticketRoomId: Joi.string().custom(objectId),
    }),
};

const removeTaskImagesByName = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const updateTaskImagesById = {
    params: Joi.object().keys({
        imageId: Joi.string().custom(objectId),
    }),
};

const removeTaskVideosByName= {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const updateTaskVideosById = {
    params: Joi.object().keys({
        videoId: Joi.string().custom(objectId),
    }),
};

const removeTaskAudiosByName = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const updateTaskAudiosById = {
    params: Joi.object().keys({
        audioId: Joi.string().custom(objectId),
    }),
};

const removeTaskPdfsByName = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const updateTaskPdfsById = {
    params: Joi.object().keys({
        pdfId: Joi.string().custom(objectId),
    }),
};

const removeTaskQuizesById = {
    params: Joi.object().keys({
        taskId: Joi.string().custom(objectId),
    }),
};

const updateTaskQuizesById = {
    params: Joi.object().keys({
        quizId: Joi.string().custom(objectId),
    }),
};

const downloadFile = {
    params: Joi.object().keys({
        filename: Joi.string().custom(objectId),
    }),
};

const playFile = {
    params: Joi.object().keys({
        filename: Joi.string().custom(objectId),
    }),
};


module.exports = {
    createTask,
    updateTaskById,
    getTaskById,
    doneTaskActin,
    uploadVideoForTask,
    uploadAudioForTask,
    uploadPdfForTask,
    getQuizRoomById,
    createQuizForTask,
    uploadImageForTask,
    sendResToQuizByIntern,
    sendResToQuizByMentor,
    getTicketRoomById,
    sendTicketByIntern,
    sendTicketByMentor,
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
    downloadFile,
    playFile
};