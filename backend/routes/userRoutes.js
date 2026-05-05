const express = require('express');
const router = express.Router();
const { getLeaderboard, getNotifications, markNotificationRead, markAllNotificationsRead, getDashboardStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
