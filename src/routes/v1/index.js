const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const termRoute = require('./term.route');
const taskRoute = require('./task.route');
const weekRoute = require('./week.route');
const internRoute = require('./intern.route');
const courseRoute = require('./course.route');
const tutorialCategoryRoute = require('./tutorialCategory.route');
const videosRoute = require('./videos.route');
const imagesRoute = require('./images.route');
const pdfsRoute = require('./pdfs.route');
const public = require('./public.route');
const superUserRoute = require('./superUser.route');


const router = express.Router();

router.use('/auth', authRoute);
router.use('/docs', docsRoute);
router.use('/term', termRoute);
router.use('/task', taskRoute);
router.use('/week', weekRoute);
router.use('/intern', internRoute);
router.use('/course', courseRoute);
router.use('/tutorial', tutorialCategoryRoute)
router.use('/videos', videosRoute);
router.use('/images', imagesRoute);
router.use('/pdfs', pdfsRoute);
router.use('/public', public);
router.use('/superuser', superUserRoute);


module.exports = router;
