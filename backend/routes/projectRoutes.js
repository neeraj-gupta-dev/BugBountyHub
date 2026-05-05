const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Developer', 'Admin'), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize('Developer', 'Admin'), updateProject)
  .delete(protect, authorize('Developer', 'Admin'), deleteProject);

module.exports = router;
