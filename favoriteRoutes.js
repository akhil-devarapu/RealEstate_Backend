const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const middleware=require('../middleware/auth')
router.post('/favorites/:propertyId',middleware, favoritesController.addFavorite);
router.get('/favorites',middleware, favoritesController.getFavorites);
router.post('/comparisons',favoritesController.compareProperties);

module.exports = router;