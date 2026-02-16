const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/multer');
const { getHeroSections, createHeroSection, updateHeroSection, deleteHeroSection, getHeroSectionById, bulkDeleteHeroSections, listHeroSections } = require('../controllers/heroSectionController');

router.get('/hero-section/list', authenticateToken, getHeroSections);
router.get('/all-hero-sections', listHeroSections);
router.get('/website/hero-section', getHeroSections);
router.post('/hero-section/create', authenticateToken, upload.heroImage, createHeroSection);
router.put('/hero-section/:id/update', authenticateToken, upload.heroImage, updateHeroSection);
router.delete('/hero-section/:id/delete', authenticateToken, deleteHeroSection);
router.get('/hero-section/:id/show', authenticateToken, getHeroSectionById);
router.post('/hero-section/bulk-delete', authenticateToken, bulkDeleteHeroSections);

module.exports = router;