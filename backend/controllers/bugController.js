const BugReport = require('../models/BugReport');
const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.submitBug = async (req, res) => {
  try {
    const { title, description, project, severity } = req.body;
    let screenshot = '';
    
    if (req.file) {
      screenshot = `/${req.file.path.replace(/\\/g, '/')}`; // Normalize path for Windows
    }

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    const bug = await BugReport.create({
      title,
      description,
      project,
      tester: req.user.id,
      severity,
      screenshot
    });

    // Notify Developer
    const notification = await Notification.create({
      user: proj.developer,
      message: `New bug reported on ${proj.title}: ${title}`,
      link: `/bugs/${bug._id}`
    });

    // Emit event
    if (req.io) {
      req.io.to(proj.developer.toString()).emit('newNotification', notification);
    }

    res.status(201).json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBugs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.tester) filter.tester = req.query.tester;
    if (req.query.status) filter.status = req.query.status;

    if (req.query.developer) {
      const myProjects = await Project.find({ developer: req.query.developer }).select('_id');
      filter.project = { $in: myProjects.map(p => p._id) };
    }

    const bugs = await BugReport.find(filter)
      .populate('tester', 'name email')
      .populate('project', 'title developer');

    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBugStatus = async (req, res) => {
  try {
    const { status, pointsAwarded } = req.body;
    const bug = await BugReport.findById(req.params.id).populate('project tester');
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    // Ensure only developer or admin can update status
    if (bug.project.developer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bug.status = status;
    
    if (status === 'accepted' && pointsAwarded) {
      bug.pointsAwarded = pointsAwarded;
      // Add points to tester
      const tester = await User.findById(bug.tester._id);
      tester.points += Number(pointsAwarded);
      await tester.save();
    }

    await bug.save();

    // Notify tester
    const notification = await Notification.create({
      user: bug.tester._id,
      message: `Bug "${bug.title}" status updated to ${status}. ${pointsAwarded ? `You earned ${pointsAwarded} points!` : ''}`,
      link: `/bugs/${bug._id}`
    });

    if (req.io) {
      req.io.to(bug.tester._id.toString()).emit('newNotification', notification);
      req.io.emit('bugUpdated', bug); // Broad broadcast or specific room depending on need
    }

    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
