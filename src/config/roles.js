// const roles = ['user', 'admin'];

// const roleRights = new Map();
// roleRights.set(roles[0], []);
// roleRights.set(roles[1], ['getUsers', 'manageUsers']);

// module.exports = {
//   roles,
//   roleRights,
// };


const roles = ['admin', 'mentor', 'intern', 'supervisor'];

const scope = {
  // Admin Route Auth Level
  CREATE_ADMIN:               "create:admin",
  UPDATE_ADMIN:               "update:admin",
  DELETE_ADMIN:               "delete:admin",
  UPLOAD_ADMIN_AVATAR:        "upload:admin-avatar",
  CHANGE_PASSWORD_ADMIN:      "change-password:admin",
  READ_ADMINS:                "read:admins",
  READ_ADMIN_DETAILS:         "read:admin-details",
  WRITE_ADMIN_PROFILE:        "write:admin-profile",

  // Supervisor Route Auth Level
  CREATE_SUPERVISOR:          "create:supervisor",
  UPDATE_SUPERVISOR:          "update:supervisor",
  DELETE_SUPERVISOR:          "delete:supervisor",
  UPLOAD_SUPERVISOR_AVATAR:   "upload:supervisor-avatar",
  CHANGE_PASSWORD_SUPERVISOR: "change-password:supervisor",
  

  // Mentor Route Auth Level
  CREATE_MENTOR:              "create:mentor",
  UPDATE_MENTOR:              "update:mentor",
  DELETE_MENTOR:              "delete:mentor",
  UPLOAD_MENTOR_AVATAR:       "upload:mentor-avatar",
  CHANGE_PASSWORD_MENTOR:     "change-password:mentor",
  READ_MENTOR_PROFILE:        "read:mentor-profile",
  WRITE_MENTOR_PROFILE:       "write:mentor-profile",

  // Intern Route Auth Level
  CREATE_INTERN:              "create:intern",
  UPDATE_INTERN:              "update:intern",
  DELETE_INTERN:              "delete:intern",
  UPLOAD_INTERN_AVATAR:       "upload:intern-avatar",
  CHANGE_PASSWORD_INTERN:     "change-password:intern",
  READ_INTERNS:               "read:interns",
  READ_INTERN_PROFILE:        "read:intern-profile",
  WRITE_INTERN_PROFILE:       "write:intern-profile",


  // Tutorial Route Auth Level
  CREATE_TUTORIAL_CATEGORY:   "create:tutorial",
  CREATE_SUB_TUTORIAL:        "create:sub-tutorial",
  READ_TUTORIALS:              "read:tutorial",
  READ_TUTORIAL_DETAILS:      "read:tutorial-details",
  DELETE_TUTORIAL:            "delete:tutorial",

  // Course Route Auth Level
  CREATE_COURSE:             "create:course",
  UPDATE_COURSE:             "update:course",
  DELETE_COURSE:             "delete:course",
  READ_COURSES:              "read:course",
  READ_COURSE_DETAILS:       "read:course-details",
  WRITE_COURSE_DETAILS:      "write:course-details",

  // Term Route Auth Level
  CREATE_TERM:                "create:term",
  UPDATE_TERM:                "update:term",
  DELETE_TERM:                "delete:term",
  ADD_TERM_INTERN:            "add:term-intern",
  REMOVE_TERM_INTERN:         "remove:term-intern",
  ADD_TERM_MENTOR:            "add:term-mentor",
  REMOVE_TERM_MENTOR:         "remove:term-mnetor",
  READ_TERMS:                 "read:terms",
  READ_TERM_WEEKS:            "read:term-weeks",
  REMOVE_TERM_WEEK:           "remove:term-week",
  READ_TERM_DETAILS:          "read:term-details",
  WIRTE_TERM_DETAILS:         "write:term-details",

  // Week Route Auth Level
  CREATE_WEEK:                "create:week",
  UPDATE_WEEK:                "update:week",
  READ_WEEK_PROGRESSBAR:      "read:week-progreesbar",
  ACTION_WEEK:                "action:week",
  READ_WEEKS:                 "read:week",
  READ_WEEK_DETAILS:          "read:week-details",
  READ_WEEK_TASKS:            "read:week-tasks",
  DELETE_TASK:                "delete:task",

  // Task Route Auth Level
  CREATE_TASK:                "create:task",
  READ_TASK_BY_ID:            "read:taskby-id", 
  DONE_TASK:                  "done:task",
  UPLOAD_TASK_IMAGE:          "upload:task-image",
  UPDATE_PROPERTY_IMAGE:      "update:image-property",
  DELETE_TASK_IMAGE:          "delete:task-image",
  UPLOAD_TASK_VIDEO:          "upload:task-video",
  UPDATE_PROPERTY_VIDEO:      "update:property-video",
  DELETE_TASK_VIDEO:          "delete:task-video",
  UPLOAD_TASK_AUDIO:          "upload:task-audio",
  UPDATE_PROPERTY_AUDIO:      "update:property-audio",
  DELETE_TASK_AUDIO:          "delete:task-audio",
  UPLOAD_TASK_PDF:            "upload:task-pdf",
  UPDATE_PROPERTY_PDF:        "update:property-pdf",
  DELETE_TASK_PDF:            "delete:task-pdf",
  UPDATE_TASK:                "update:task-video",
  DELETE_TASK:                "delete:task",
  READ_TASK_DETAILS:          "read:task-details",
  WIRTE_TASK_DETAILS:         "write:task-details",

  // Ticket Route Auth Level
  READ_TICKET_ROOM:           "read:ticket-room",
  SEND_TICKET_TEXT:           "send:ticket-text",
  SEND_TICKET_AUDIO:          "send:ticket-audio",
  READ_TICKET_DETAILS:        "read:ticket-details",
  WRITE_TICKET_DETAILS:       "write:ticket-details",

  // Quiz Route Auth Level
  CREATE_QUIZ:               "create:quiz",
  UPDATE_QUIZ:               "update:quiz",
  DELETE_QUIZ:               "delete:quiz",
  READ_QUIZES:               "read:quies",
  READ_QUIZ_DETAILS:         "read:quiz-details",
  WRITE_QUIZ_DETAILS:        "write:quiz-details",
  RES_QUIZ:                  "response-quiz",

  // Upload & download & play
  DOWNLOAD_FILE:             "download:file",
  PLAY_VIDEO:                "paly:video",
  PLAY_AUDIO:                "paly:audio",
};


const roleRights = new Map();
roleRights.set(roles[0], [scope.CREATE_ADMIN, scope.UPDATE_ADMIN, scope.DELETE_ADMIN, scope.UPLOAD_ADMIN_AVATAR, scope.CHANGE_PASSWORD_ADMIN, scope.READ_ADMINS, scope.READ_ADMIN_DETAILS, scope.WRITE_ADMIN_PROFILE]);
roleRights.set(roles[1], []);
roleRights.set(roles[2], [scope.READ_INTERN_PROFILE, scope.WRITE_INTERN_PROFILE, scope.READ_TERM_DETAILS, scope.READ_WEEK_DETAILS, scope.READ_TASK_DETAILS, scope.READ_TICKET_DETAILS, scope.WRITE_TICKET_DETAILS, scope.READ_TUTORIAL_DETAILS, scope.READ_COURSE_DETAILS, scope.READ_QUIZ_DETAILS, scope.RES_QUIZ]);
roleRights.set(roles[3], [scope.CHANGE_PASSWORD_ADMIN]);

const admin  = [scope.CREATE_ADMIN, scope.UPDATE_ADMIN, scope.DELETE_ADMIN, scope.UPLOAD_ADMIN_AVATAR, scope.CHANGE_PASSWORD_ADMIN, scope.READ_ADMINS, scope.READ_ADMIN_DETAILS, scope.WRITE_ADMIN_PROFILE, scope.CREATE_MENTOR, scope.DELETE_MENTOR, scope.CREATE_INTERN, scope.DELETE_INTERN];
const mentor = [scope.UPDATE_MENTOR, scope.UPLOAD_MENTOR_AVATAR, scope.CHANGE_PASSWORD_MENTOR, scope.READ_MENTOR_PROFILE, scope.WRITE_MENTOR_PROFILE, scope.READ_INTERNS, scope.READ_INTERN_PROFILE, scope.READ_TUTORIALS, scope.READ_COURSES, scope.READ_TERMS, scope.READ_TERM_DETAILS, scope.CREATE_WEEK, scope.READ_WEEK_PROGRESSBAR, scope.READ_WEEKS, scope.READ_WEEK_DETAILS, scope.READ_WEEK_TASKS, scope.CREATE_TASK, scope.UPDATE_TASK, scope.READ_TASK_BY_ID, scope.UPLOAD_TASK_IMAGE, scope.UPDATE_PROPERTY_IMAGE, scope.DELETE_TASK_IMAGE, scope.UPLOAD_TASK_VIDEO, scope.UPDATE_PROPERTY_VIDEO, scope.DELETE_TASK_VIDEO, scope.UPLOAD_TASK_AUDIO, scope.UPDATE_PROPERTY_AUDIO, scope.DELETE_TASK_AUDIO, scope.UPLOAD_TASK_PDF, scope.UPDATE_PROPERTY_PDF, scope.DELETE_TASK_PDF, scope.READ_TASK_DETAILS, scope.WIRTE_TASK_DETAILS, scope.SEND_TICKET_TEXT, scope.SEND_TICKET_AUDIO, scope.READ_TICKET_DETAILS, scope.CREATE_QUIZ, scope.UPDATE_QUIZ, scope.DELETE_QUIZ, scope.READ_QUIZES, scope.READ_QUIZ_DETAILS, scope.RES_QUIZ, scope.PLAY_VIDEO, scope.PLAY_AUDIO];
const intern = [scope.UPDATE_INTERN, scope.UPLOAD_INTERN_AVATAR, scope.CHANGE_PASSWORD_INTERN, scope.READ_INTERNS, scope.READ_INTERN_PROFILE, scope.READ_COURSES, scope.READ_COURSE_DETAILS, scope.READ_TERMS, scope.READ_TERM_DETAILS, scope.READ_WEEKS, scope.READ_WEEK_DETAILS, scope.READ_WEEK_PROGRESSBAR, scope.READ_WEEK_TASKS, scope.READ_TASK_BY_ID, scope.DONE_TASK, scope.SEND_TICKET_TEXT, scope.SEND_TICKET_AUDIO, scope.READ_TICKET_DETAILS, scope.READ_TICKET_ROOM, scope.READ_QUIZ_DETAILS, scope.READ_QUIZ_DETAILS, scope.RES_QUIZ, scope.DOWNLOAD_FILE, scope.PLAY_AUDIO, scope.PLAY_VIDEO ];
const supervisor = [scope.CHANGE_PASSWORD_SUPERVISOR];
const tutorialCategory = [];
const course = [];
const term = [];
const week = [];
const task = [];
const quiz = [];
const ticket = [];
const upload = [];
const download = [];

roleRight = (role) => {
  console.log(role);
  switch(role) {
    case 'admin':
      return admin.concat(intern, mentor);
    
    case 'mentor':
      return mentor;

    case 'intern':
      return intern;

    case 'supervisor':
      return supervisor;
      
  }
};

module.exports = {
  scope,
  roles,
  roleRights,
  roleRight
};
