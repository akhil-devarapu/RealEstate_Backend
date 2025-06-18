const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/locations/suggest', searchController.suggestLocations);
router.post('/properties/map-search', searchController.mapSearchProperties);
module.exports = router;
