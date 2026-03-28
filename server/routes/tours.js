const express = require('express');
const Tour = require('../models/Tour');
const Notification = require('../models/Notification');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/tours — public, supports ?location=&type=&available=&status=
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.location) filter.location = req.query.location;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.available !== undefined) filter.available = req.query.available === 'true';
    if (req.query.status) filter.verificationStatus = req.query.status;

    const tours = await Tour.find(filter).sort({ createdAt: -1 });
    res.json({ tours });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tours/:id
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ tour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/tours — STAFF or ADMIN
router.post('/', authenticateToken, requireRole('STAFF', 'ADMIN'), async (req, res) => {
  try {
    const {
      name, type, pricePerPerson, location, image, available,
      features, description, duration, maxGroupSize, difficulty,
      verificationStatus,
    } = req.body;

    const tour = await Tour.create({
      name, type, pricePerPerson, location, image,
      available: available !== undefined ? available : true,
      features: features || [],
      description: description || '',
      duration, maxGroupSize,
      difficulty: difficulty || 'Moderate',
      verificationStatus: verificationStatus || 'PENDING',
      createdBy: req.user._id,
    });

    // Notify ADMIN when staff adds a tour
    if (req.user.role === 'STAFF') {
      await Notification.create({
        message: `${req.user.name} (Staff) added a new tour package: "${name}"`,
        actorName: req.user.name,
        actorRole: 'STAFF',
        forRole: 'ADMIN',
      });
    }

    res.status(201).json({ tour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/tours/:id — STAFF or ADMIN
router.patch('/:id', authenticateToken, requireRole('STAFF', 'ADMIN'), async (req, res) => {
  try {
    const prevTour = await Tour.findById(req.params.id);
    if (!prevTour) return res.status(404).json({ message: 'Tour not found' });

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify ADMIN when staff verifies/rejects a tour
    if (
      req.user.role === 'STAFF' &&
      req.body.verificationStatus &&
      req.body.verificationStatus !== prevTour.verificationStatus
    ) {
      const action = req.body.verificationStatus === 'VERIFIED' ? 'verified' : 'rejected';
      await Notification.create({
        message: `${req.user.name} (Staff) ${action} tour: "${prevTour.name}"`,
        actorName: req.user.name,
        actorRole: 'STAFF',
        forRole: 'ADMIN',
      });
    }

    res.json({ tour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/tours/:id — ADMIN only
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
