const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      developer: req.user.id
    });

    // Notify all testers
    const User = require('../models/User');
    const Notification = require('../models/Notification');
    const testers = await User.find({ role: 'Tester' }).select('_id');
    
    if (testers.length > 0) {
      const notifications = testers.map(t => ({
        user: t._id,
        message: `New bounty available! Project "${title}" was just posted.`,
        link: `/projects/${project._id}`
      }));
      await Notification.insertMany(notifications);
      
      // Emit to all testers if using sockets (assuming 'testers' room or broadcast to all)
      if (req.io) {
        req.io.emit('newProject', project);
      }
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('developer', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('developer', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check if user is the developer of this project or admin
    if (project.developer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.developer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
