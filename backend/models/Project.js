const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
