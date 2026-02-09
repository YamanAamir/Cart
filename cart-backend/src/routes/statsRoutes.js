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

router.get('/stats-cards/list', authenticateToken, getStatsCards);
router.get('/website/stats-cards', getStatsCards);
router.post('/stats-cards/create', authenticateToken, createStatsCard);
router.put('/stats-cards/:id/update', authenticateToken, updateStatsCard);
router.delete('/stats-cards/:id/delete', authenticateToken, deleteStatsCard);
router.get('/stats-cards/:id/show', authenticateToken, getStatsCardById);
router.post('/stats-cards/bulk-delete', authenticateToken, bulkDeleteStatsCards);

module.exports = router;