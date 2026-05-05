const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'accepted', 'fixed', 'closed'], 
    default: 'submitted' 
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  screenshot: { type: String }, // Path to the uploaded file
  pointsAwarded: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BugReport', BugReportSchema);
