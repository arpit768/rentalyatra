const express = require('express');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Tour = require('../models/Tour');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings — customers see their own; staff/admin see all
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'CUSTOMER') {
      filter.customerId = req.user._id;
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user.role === 'CUSTOMER' && booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/bookings — CUSTOMER creates a booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tourId, startDate, endDate, numPeople, totalPrice, destination, insurance } = req.body;

    if (!tourId || !startDate || !endDate || !numPeople || !totalPrice || !destination) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const booking = await Booking.create({
      tourId,
      customerId: req.user._id,
      startDate,
      endDate,
      numPeople,
      totalPrice,
      destination,
      insurance: insurance || undefined,
      status: 'PENDING',
    });

    // Notify STAFF and ADMIN about new booking
    await Notification.create({
      message: `${req.user.name} booked "${tour.name}" for ${numPeople} person(s)`,
      actorName: req.user.name,
      actorRole: 'CUSTOMER',
      forRole: 'STAFF',
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/bookings/:id/status — STAFF or ADMIN
router.patch('/:id/status', authenticateToken, requireRole('STAFF', 'ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Notify the customer about their booking status change
    await Notification.create({
      message: `Your booking has been ${status.toLowerCase()}`,
      actorName: req.user.name,
      actorRole: req.user.role,
      forRole: 'CUSTOMER',
    });

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
