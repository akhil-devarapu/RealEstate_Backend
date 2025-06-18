// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/buyer/:userId', dashboardController.getBuyerDashboard);
router.get('/seller/:userId', dashboardController.getSellerDashboard);
router.get('/broker/:userId', dashboardController.getBrokerDashboard);

module.exports = router;

