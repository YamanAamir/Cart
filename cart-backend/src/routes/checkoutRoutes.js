const express = require('express');
const { authorizePayment, authorizeNetWebhook } = require('../controllers/checkoutController');
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Model routes
router.post('/payments/authorize',authenticateToken, authorizePayment);



module.exports = router;
