const express = require('express');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/stats — ADMIN only
router.get('/stats', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const [tours, bookings, users] = await Promise.all([
      Tour.find(),
      Booking.find(),
      User.find(),
    ]);

    const totalTours = tours.length;
    const verifiedTours = tours.filter(t => t.verificationStatus === 'VERIFIED').length;
    const pendingTours = tours.filter(t => t.verificationStatus === 'PENDING').length;
    const rejectedTours = tours.filter(t => t.verificationStatus === 'REJECTED').length;

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const staffCount = users.filter(u => u.role === 'STAFF' || u.role === 'ADMIN').length;
    const customerCount = users.filter(u => u.role === 'CUSTOMER').length;

    // Location breakdown
    const locationStats = tours.reduce((acc, t) => {
      acc[t.location] = (acc[t.location] || 0) + 1;
      return acc;
    }, {});

    // Type breakdown
    const typeStats = tours.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      tours: { total: totalTours, verified: verifiedTours, pending: pendingTours, rejected: rejectedTours },
      bookings: { total: totalBookings, active: activeBookings, completed: completedBookings },
      revenue: totalRevenue,
      users: { staff: staffCount, customers: customerCount },
      locationStats,
      typeStats,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
