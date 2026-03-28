const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  forRole: { type: String, required: true }, // ADMIN, STAFF, CUSTOMER, or ALL
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.timestamp = ret.createdAt;
      delete ret._id;
      delete ret.__v;
      delete ret.readBy;
    },
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
