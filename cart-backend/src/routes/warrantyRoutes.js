const express = require('express'); // Correct way
const router = express.Router();
const { registerWarranty } = require('../controllers/warrantyController');

router.post('/register-warranty', registerWarranty);

module.exports = router;
