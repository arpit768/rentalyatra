// Simple Express.js Backend for Community Tours and Travels
// This is a mock server for development purposes

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// In-memory database (replace with real database in production)
let users = [];
let tours = [];
let bookings = [];
let reviews = [];

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🚀 Community Tours and Travels API is running', version: '1.0.0' });
});

// ============ AUTH ROUTES ============

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    id: generateId(),
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };

  users.push({ ...user, password }); // In production, hash the password!

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.status(201).json({ user, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ============ TOUR ROUTES ============

app.get('/api/tours', (req, res) => {
  const { location, type, available, verificationStatus } = req.query;

  let filtered = tours;

  if (location) filtered = filtered.filter(t => t.location === location);
  if (type) filtered = filtered.filter(t => t.type === type);
  if (available !== undefined) filtered = filtered.filter(t => t.available === (available === 'true'));
  if (verificationStatus) filtered = filtered.filter(t => t.verificationStatus === verificationStatus);

  res.json(filtered);
});

app.get('/api/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === req.params.id);
  if (!tour) {
    return res.status(404).json({ message: 'Tour package not found' });
  }
  res.json(tour);
});

app.post('/api/tours', authenticateToken, (req, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only tour operators can add packages' });
  }

  const tour = {
    id: generateId(),
    ...req.body,
    ownerId: req.user.id,
    verificationStatus: 'PENDING',
    available: true,
    createdAt: new Date().toISOString()
  };

  tours.push(tour);
  res.status(201).json(tour);
});

app.patch('/api/tours/:id', authenticateToken, (req, res) => {
  const index = tours.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tour package not found' });
  }

  const tour = tours[index];

  // Check permissions
  if (tour.ownerId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  tours[index] = { ...tour, ...req.body, updatedAt: new Date().toISOString() };
  res.json(tours[index]);
});

app.patch('/api/tours/:id/toggle-availability', authenticateToken, (req, res) => {
  const index = tours.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tour package not found' });
  }

  const tour = tours[index];
  if (tour.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  tours[index].available = !tours[index].available;
  res.json(tours[index]);
});

app.patch('/api/tours/:id/verify', authenticateToken, (req, res) => {
  if (req.user.role !== 'STAFF' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only staff can verify tour packages' });
  }

  const index = tours.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tour package not found' });
  }

  tours[index].verificationStatus = req.body.verificationStatus;
  res.json(tours[index]);
});

app.delete('/api/tours/:id', authenticateToken, (req, res) => {
  const index = tours.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tour package not found' });
  }

  const tour = tours[index];
  if (tour.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  tours.splice(index, 1);
  res.json({ message: 'Tour package deleted successfully' });
});

// ============ BOOKINGS ROUTES ============

app.get('/api/bookings', authenticateToken, (req, res) => {
  const { customerId, tourId, status } = req.query;

  let filtered = bookings;

  // Filter based on user role
  if (req.user.role === 'CUSTOMER') {
    filtered = filtered.filter(b => b.customerId === req.user.id);
  } else if (req.user.role === 'OWNER') {
    const myTourIds = tours.filter(t => t.ownerId === req.user.id).map(t => t.id);
    filtered = filtered.filter(b => myTourIds.includes(b.tourId));
  }

  if (customerId) filtered = filtered.filter(b => b.customerId === customerId);
  if (tourId) filtered = filtered.filter(b => b.tourId === tourId);
  if (status) filtered = filtered.filter(b => b.status === status);

  res.json(filtered);
});

app.get('/api/bookings/:id', authenticateToken, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  res.json(booking);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const tour = tours.find(t => t.id === req.body.tourId);
  if (!tour) {
    return res.status(404).json({ message: 'Tour package not found' });
  }

  if (!tour.available) {
    return res.status(400).json({ message: 'Tour package is not available' });
  }

  const booking = {
    id: generateId(),
    ...req.body,
    customerId: req.user.id,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

app.patch('/api/bookings/:id/status', authenticateToken, (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  bookings[index].status = req.body.status;
  bookings[index].updatedAt = new Date().toISOString();
  res.json(bookings[index]);
});

// ============ FILE UPLOAD ROUTES ============

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

app.post('/api/upload/multiple', authenticateToken, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const urls = req.files.map(file =>
    `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
  );

  res.json({ urls });
});

// ============ REVIEWS ROUTES ============

app.get('/api/reviews/tour/:tourId', (req, res) => {
  const tourReviews = reviews.filter(r => r.tourId === req.params.tourId);
  res.json(tourReviews);
});

app.post('/api/reviews', authenticateToken, (req, res) => {
  const review = {
    id: generateId(),
    ...req.body,
    customerId: req.user.id,
    helpful: 0,
    createdAt: new Date().toISOString()
  };

  reviews.push(review);
  res.status(201).json(review);
});

// ============ ANALYTICS ROUTES ============

app.get('/api/analytics/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const stats = {
    totalTours: tours.length,
    totalBookings: bookings.length,
    totalRevenue: bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    activeUsers: users.length
  };

  res.json(stats);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Community Tours and Travels API Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
