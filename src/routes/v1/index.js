const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const termRoute = require('./term.route');
const taskRoute = require('./task.route');
const weekRoute = require('./week.route');
const adminRoute = require('./admin.route');
const internRoute = require('./intern.route');
const mentorRoute = require('./mentor.route');
const courseRoute = require('./course.route');
const supervisor = require('./supervisor.route');
const tutorialCategoryRoute = require('./tutorialCategory.route');
const videosRoute = require('./videos.route');
const imagesRoute = require('./images.route');
const pdfsRoute = require('./pdfs.route');


const router = express.Router();

router.use('/auth', authRoute);
router.use('/docs', docsRoute);
router.use('/term', termRoute);
router.use('/task', taskRoute);
router.use('/week', weekRoute);
router.use('/users', userRoute);
router.use('/admin', adminRoute);
router.use('/intern', internRoute);
router.use('/mentor', mentorRoute);
router.use('/course', courseRoute);
router.use('/supervisor', supervisor);
router.use('/tutorial', tutorialCategoryRoute)
router.use('/videos', videosRoute);
router.use('/images', imagesRoute);
router.use('/pdfs', pdfsRoute);



module.exports = router;
