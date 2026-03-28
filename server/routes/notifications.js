const express = require('express');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications — get notifications for current user's role
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      forRole: { $in: [req.user.role, 'ALL'] },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const withReadStatus = notifications.map((n) => {
      const obj = n.toJSON();
      obj.read = n.readBy.some((id) => id.toString() === req.user._id.toString());
      return obj;
    });

    res.json({ notifications: withReadStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/notifications/read — mark all unread notifications as read for current user
router.post('/read', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        forRole: { $in: [req.user.role, 'ALL'] },
        readBy: { $ne: req.user._id },
      },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
