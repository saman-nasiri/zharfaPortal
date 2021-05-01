// const roles = ['user', 'admin'];

// const roleRights = new Map();
// roleRights.set(roles[0], []);
// roleRights.set(roles[1], ['getUsers', 'manageUsers']);

// module.exports = {
//   roles,
//   roleRights,
// };


const roles = ['admin', 'mentor', 'intern'];

const scope = {
  READ_INTERN_PROFILE:   "read:intern-profile",
  WRITE_INTERN_PROFILE:  "write:intern-profile",
  READ_MENTOR_PROFILE:   "read:mentor-profile",
  WRITE_MENTOR_PROFILE:  "write:mentor-profile",
  READ_TERM_DETAILS:     "read:term-details",
  WIRTE_TERM_DETAILS:    "write:term-details",
  READ_WEEK_DETAILS:     "read:week-details",
  WIRTE_WEEK_DETAILS:    "write:week-details",
  READ_TASK_DETAILS:     "read:task-details",
  WIRTE_TASK_DETAILS:    "write:task-details",
  READ_TICKET_DETAILS:    "read:ticket-details",
  WRITE_TICKET_DETAILS:   "write:ticket-details",
  READ_TUTORIAL_DETAILS: "read:tutorial-details",
  WRITE_TUTRIAL_DETAILS: "write:tutorial-details",
  READ_COURSE_DETAILS:   "read:course-details",
  WRITE_COURSE_DETAILS:  "write:course-details",
  READ_QUIZ_DETAILS:     "read:quiz-details",
  WRITE_QUIZ_DETAILS:    "write:quiz-details",
  RES_QUIZ:              "response-quiz",
};


const roleRights = new Map();
roleRights.set(roles[0], [scope]);
roleRights.set(roles[1], [scope.READ_MENTOR_PROFILE, scope.WRITE_MENTOR_PROFILE, scope.READ_WEEK_DETAILS, scope.WIRTE_WEEK_DETAILS, scope.READ_TASK_DETAILS, scope.WIRTE_TASK_DETAILS, scope.READ_QUIZ_DETAILS, scope.WRITE_QUIZ_DETAILS, scope.READ_TICKT_DETAILS, scope.WRITE_TUTRIAL_DETAILS, scope.READ_TUTORIAL_DETAILS, scope.READ_COURSE_DETAILS, scope.RES_QUIZ]);
roleRights.set(roles[2], [scope.READ_INTERN_PROFILE, scope.WRITE_INTERN_PROFILE, scope.READ_TERM_DETAILS, scope.READ_WEEK_DETAILS, scope.READ_TASK_DETAILS, scope.READ_TICKET_DETAILS, scope.WRITE_TICKET_DETAILS, scope.READ_TUTORIAL_DETAILS, scope.READ_COURSE_DETAILS, scope.READ_QUIZ_DETAILS, scope.RES_QUIZ]);

module.exports = {
  roles,
  roleRights,
};
