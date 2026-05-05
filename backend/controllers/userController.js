const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const testers = await User.find({ role: 'Tester' })
      .sort({ points: -1 })
      .select('-password');
    
    res.json(testers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const BugReport = require('../models/BugReport');
    const User = require('../models/User');

    let stats = {};

    if (req.user.role === 'Developer') {
      const totalProjects = await Project.countDocuments({ developer: req.user.id });
      // Find bugs on their projects
      const myProjects = await Project.find({ developer: req.user.id }).select('_id');
      const myProjectIds = myProjects.map(p => p._id);
      const totalBugsReported = await BugReport.countDocuments({ project: { $in: myProjectIds } });
      const bugsWaitingReview = await BugReport.countDocuments({ project: { $in: myProjectIds }, status: 'submitted' });

      stats = { totalProjects, totalBugsReported, bugsWaitingReview };
    } else if (req.user.role === 'Tester') {
      const totalBugsSubmitted = await BugReport.countDocuments({ tester: req.user.id });
      const acceptedBugsCount = await BugReport.countDocuments({ tester: req.user.id, status: 'accepted' });
      // total points earned is just user.points
      const user = await User.findById(req.user.id);
      stats = { totalBugsSubmitted, acceptedBugsCount, totalPointsEarned: user.points };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
