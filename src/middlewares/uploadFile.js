const multer = require('multer');
const path = require('path');
const util = require('util');
const fse = require('fs-extra');
const { v4: uuidv4 } = require('uuid');


function setFilePath(dirPath) {
  const filePath = fse.ensureDirSync(dirPath);
  if(!filePath) { return dirPath; }
  else { return filePath };
};


const storage = multer.diskStorage({

    destination: function (req, res, cb) {
        cb(null, setFilePath('./public/files/images'));
    },
    filename: function (req, res, cb) {
        cb(null, `saman$${new Date}`)
    }
});

const fileFilter = function (req, file, cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null , true);
      }else {
        cb(null , false)
}};

const upload = multer({ 
    storage: storage , 
    limits: { fileSize: 1024 *1024 * 20 },
    fileFilter: fileFilter
})

const file = upload.single('multi-files');


var storageImages = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, setFilePath(`./public/files/images`));
    },
    filename: (req, file, callback) => {
      const match = ["image/png", "image/jpeg",  "image/jpg"];
  
      if (match.indexOf(file.mimetype) === -1) {
        var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
        return callback(message, null);
      }
    
    // var ext = path.extname(file.originalname);
    // if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    //     return callback(new Error('Only videos are allowed'))
    // }
      const fileExt = path.extname(file.originalname);
      const filename = uuidv4() + fileExt;
      callback(null, filename);
    }
  });

  var uploadImageFiles = multer({ storage: storageImages, limits: { fileSize: 1024 * 1024 * 10 }}).array("multi-files", 10);
  var uploadImage =  util.promisify(uploadImageFiles);

// Upload video files
var storageVideo = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, setFilePath(`./public/files/videos`));
    },
    filename: (req, file, callback) => {
      const match = ["video/mp4", "video/mkv"];
  
      if (match.indexOf(file.mimetype) === -1) {
        var message = `${file.originalname} is invalid. Only accept mkv/mp4.`;
        return callback(message, null);
      }
    
      const fileExt = path.extname(file.originalname);
      const filename = uuidv4() + fileExt;
      callback(null, filename);
    }
  });

  var uploadVideoFiles = multer({ storage: storageVideo, limits: { fileSize: 1024 * 1024 * 1000 }}).array("multi-files", 10);
  var uploadVideo =  util.promisify(uploadVideoFiles);


  // Upload audio files
var storageAudio = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, setFilePath(`./public/files/audios`));
    },
    filename: (req, file, callback) => {
      const match = ["audio/mp3", "audio/mpeg"];
  
      if (match.indexOf(file.mimetype) === -1) {
        var message = `${file.originalname} is invalid. Only accept mp3.`;
        return callback(message, null);
      }
    
      const fileExt = path.extname(file.originalname);
      const filename = uuidv4() + fileExt;
      callback(null, filename);
    }
  });

  var uploadAudioFiles = multer({ storage: storageAudio, limits: { fileSize: 1024 * 1024 * 100 }}).array("multi-files", 10);
  var uploadAudio =  util.promisify(uploadAudioFiles);


    // Upload pdf files
var storagePdf = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, setFilePath(`./public/files/pdfs`));
    },
    filename: (req, file, callback) => {
      const match = ["application/pdf"];
  
      if (match.indexOf(file.mimetype) === -1) {
        var message = `${file.originalname} is invalid. Only accept pdf.`;
        return callback(message, null);
      }
    
      const fileExt = path.extname(file.originalname);
      const filename = uuidv4() + fileExt;
      callback(null, filename);
    }
  });

  var uploadPdfFiles = multer({ storage: storagePdf, limits: { fileSize: 1024 * 1024 * 60 }}).array("multi-files", 10);
  var uploadPdf =  util.promisify(uploadPdfFiles);


    // Upload Single audio files
   // Upload audio files
var storageSingleAudio = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, setFilePath(`./public/files/audios`));
  },
  filename: (req, file, callback) => {
    const match = ["audio/mp3", "audio/mpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept mp3.`;
      return callback(message, null);
    }
  
    const fileExt = path.extname(file.originalname);
    const filename = uuidv4() + fileExt;
    callback(null, filename);
  }
});

var uploadSingleAudioFiles = multer({ storage: storageSingleAudio, limits: { fileSize: 1024 * 1024 * 1000 }}).single("single-file");
var uploadSingleAudio =  util.promisify(uploadSingleAudioFiles);



  // Upload Single image files
  // Upload image files
   var storageSingleImage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, setFilePath(`./public/files/images`));
    },
    filename: (req, file, callback) => {
      const match = ["image/png", "image/jpeg",  "image/jpg"];
  
      if (match.indexOf(file.mimetype) === -1) {
        var message = `${file.originalname} is invalid. Only accept jpg.`;
        return callback(message, null);
      }
    
      const fileExt = path.extname(file.originalname);
      const filename = uuidv4() + fileExt;
      callback(null, filename);
    }
  });
  
  var uploadSingleImageFiles = multer({ storage: storageSingleImage, limits: { fileSize: 1024 * 1024 * 100 }}).single("single-file");
  var uploadSingleImage =  util.promisify(uploadSingleImageFiles);
  
  
module.exports = {
    uploadImage,
    uploadVideo,
    uploadAudio,
    uploadPdf,
    uploadSingleAudio,
    uploadSingleImage,
    file
};