// routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const middleware=require('../middleware/auth');

router.post('/projects',middleware, projectController.addProject);
router.get('/projects/:id', projectController.getProjectById);
router.get('/projects/:id/units', projectController.getUnitsByProjectId);
module.exports = router;
