const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // Optional link to the related entity
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
