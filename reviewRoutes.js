// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewController');

// POST review for property
router.post('/reviews/property', reviewsController.submitPropertyReview);
router.get('/reviews/property/:propertyId', reviewsController.getPropertyReviews);
module.exports = router;
