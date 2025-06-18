// routes/brokerRoutes.js

const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');

router.post('/broker/register', brokerController.registerBroker);
router.get('/brokers', brokerController.findBrokers);
module.exports = router;
