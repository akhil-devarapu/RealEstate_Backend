const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const authMiddleware = require('../middleware/adminauth')
// Admin routes
router.post('/admin/register', adminController.registerAdmin);
router.post('/admin/login', adminController.loginAdmin);
router.put('/admin/properties/:id/verify',authMiddleware, adminController.verifyProperty);
router.get('/admin/reports/listings', authMiddleware,adminController.getListingReports);

module.exports = router;