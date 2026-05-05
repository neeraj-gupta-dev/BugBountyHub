const express = require('express');
const router = express.Router();
const { submitBug, getBugs, updateBugStatus } = require('../controllers/bugController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getBugs)
  .post(protect, authorize('Tester', 'Admin'), upload.single('screenshot'), submitBug);

router.route('/:id/status')
  .put(protect, authorize('Developer', 'Admin'), updateBugStatus);

module.exports = router;
