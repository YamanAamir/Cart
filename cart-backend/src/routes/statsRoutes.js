const { getStatsCards,
    createStatsCard,
    updateStatsCard,
    deleteStatsCard,
    bulkDeleteStatsCards,
    getStatsCardById
} = require('../controllers/statsController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/multer');

router.get('/stats-cards/list', authenticateToken, getStatsCards);
router.get('/website/stats-cards', getStatsCards);
router.post('/stats-cards/create', authenticateToken, upload.statsCardImage, createStatsCard);
router.put('/stats-cards/:id/update', authenticateToken, upload.statsCardImage, updateStatsCard);
router.delete('/stats-cards/:id/delete', authenticateToken, deleteStatsCard);
router.get('/stats-cards/:id/show', authenticateToken, getStatsCardById);
router.post('/stats-cards/bulk-delete', authenticateToken, bulkDeleteStatsCards);

module.exports = router;