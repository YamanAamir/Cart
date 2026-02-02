const express = require('express');
const router = express.Router();
const { signup, verify, resend, login, forgot, reset } = require('../controllers/authCustomerController');
const { authenticateCustomerToken } = require('../middlewares/authCustomerMiddleware');

router.post('/customer/signup', signup);
router.post('/customer/verify', verify);
router.post('/customer/resend', resend);
router.post('/customer/login', login);
router.post('/customer/forgot', forgot);
router.post('/customer/reset', reset);




module.exports = router;