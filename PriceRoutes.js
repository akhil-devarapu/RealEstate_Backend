// routes/priceRoutes.js

const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get("/price-trends", priceController.getPriceTrends);
router.get('/calculator/home-loan', priceController.calculateHomeLoan);
module.exports = router;

