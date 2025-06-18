const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middleware/auth');

router.get('/listings',authMiddleware, sellerController.getSellerListings);
router.get('/leads', authMiddleware, sellerController.getSellerLeads);
router.put('/leads/:leadId/status', authMiddleware, sellerController.updateLeadStatus);

module.exports = router;
