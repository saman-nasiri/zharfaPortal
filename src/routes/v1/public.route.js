const express = require('express');
const { authController, internController } = require('../../controllers/index');

const router = express.Router();

router
    .route('/baseURL')
        .get(authController.baseURL)

router
    .route('/province')
        .get(internController.getProvince)

router
    .route('/cities/:provinceId')
        .get(internController.getCities)

module.exports = router;
