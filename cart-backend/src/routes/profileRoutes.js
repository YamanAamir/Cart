const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const { getProfile, changePassword, updateProfile } = require('../controllers/profileController');


router.put('/profile',authenticateToken, updateProfile);
router.get('/profile',authenticateToken, getProfile);
router.put('/profile-password',authenticateToken, changePassword);


module.exports = router;
