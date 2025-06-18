// routes/inquiryRoutes.js

const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const middleware=require('../middleware/auth')

router.post('/inquiries',middleware, inquiryController.sendInquiry);
 router.post('/properties/:id/schedule-visit', inquiryController.scheduleVisit);
 router.get('/inquiries', middleware,inquiryController.getMyInquiries);
module.exports = router;

