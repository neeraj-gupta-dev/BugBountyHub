const User = require('../models/User');
const Project = require('../models/Project');
const BugReport = require('../models/BugReport');

exports.getAllStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const projectsCount = await Project.countDocuments();
    const bugsCount = await BugReport.countDocuments();
    const acceptedBugsCount = await BugReport.countDocuments({ status: 'accepted' });
    
    // Calculate total bounty paid
    const bugs = await BugReport.find({ status: 'accepted' });
    const totalBountyPaid = bugs.reduce((acc, bug) => acc + (bug.pointsAwarded || 0), 0);
    
    res.json({ usersCount, projectsCount, bugsCount, acceptedBugsCount, totalBountyPaid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Admin') return res.status(400).json({ message: 'Cannot block admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
