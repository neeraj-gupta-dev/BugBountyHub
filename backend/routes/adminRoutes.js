const express = require('express');
const router = express.Router();
const { getAllStats, getAllUsers, toggleBlockUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Admin'));

router.get('/stats', getAllStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-block', toggleBlockUser);

module.exports = router;
