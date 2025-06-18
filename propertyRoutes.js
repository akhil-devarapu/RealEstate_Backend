const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const middleware=require("../middleware/auth")

router.post('/properties', middleware,propertyController.createProperty); 
router.get('/properties', propertyController.getAllProperties);
router.get('/properties/:id', propertyController.getPropertyById);

module.exports = router;


