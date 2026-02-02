const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {  createDealerRegistration, getAllDealerRegistrationsPagination, toggleDealerRegistration, deleteDealerRegistration, updateDealerRegistration, bulkDeleteDealerRegistrations } = require('../controllers/dealerRegistrationController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const fixUploadPath = require('../middlewares/fixUploadPath');
const { upload } = require("../middlewares/multer");

// router.get('/admin/profile', authenticateToken, getAdminProfile);



router.get('/dealer-registrations',  getAllDealerRegistrationsPagination);
router.get('/dealer-registration/:id',  toggleDealerRegistration);
router.post('/dealer-registration', upload.resaleCertificate, createDealerRegistration);
router.patch('/dealer-registration/:id',  toggleDealerRegistration);
router.put('/dealer-registration/:id',  updateDealerRegistration);
router.post('/bulk-delete-dealer-registrations',  bulkDeleteDealerRegistrations);

module.exports = router;