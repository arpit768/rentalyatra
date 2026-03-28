require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Tour = require('./models/Tour');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-tours');
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Tour.deleteMany({});

  // Create default users
  const admin = await User.create({
    name: 'Krishna Admin',
    email: 'admin@communitytours.com',
    password: 'admin123',
    role: 'ADMIN',
  });

  const staff = await User.create({
    name: 'Hari Thapa',
    email: 'staff@communitytours.com',
    password: 'staff123',
    role: 'STAFF',
  });

  await User.create({
    name: 'Ram Kumar',
    email: 'customer@communitytours.com',
    password: 'customer123',
    role: 'CUSTOMER',
  });

  console.log('Users created');

  // Create tours
  await Tour.insertMany([
    {
      name: 'Annapurna Base Camp Trek',
      type: 'Adventure Trek',
      pricePerPerson: 25000,
      location: 'Pokhara',
      image: 'https://images.unsplash.com/photo-1606225594862-b57e1c2dc72a?w=800',
      available: true,
      verificationStatus: 'VERIFIED',
      features: ['Professional guide', 'Meals included', 'Tea house accommodation', 'Porter service', 'Permits'],
      description: 'Trek through stunning rhododendron forests and mountain villages to the iconic Annapurna Base Camp at 4,130m.',
      duration: 12,
      maxGroupSize: 12,
      difficulty: 'Challenging',
      createdBy: staff._id,
    },
    {
      name: 'Chitwan Wildlife Safari',
      type: 'Wildlife Safari',
      pricePerPerson: 12000,
      location: 'Chitwan',
      image: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=800',
      available: true,
      verificationStatus: 'VERIFIED',
      features: ['Jungle safari', 'Elephant ride', 'Canoe trip', 'Bird watching', 'Lodge stay'],
      description: 'Explore the UNESCO World Heritage Chitwan National Park and spot rhinos, crocodiles, and exotic birds.',
      duration: 3,
      maxGroupSize: 8,
      difficulty: 'Easy',
      createdBy: staff._id,
    },
    {
      name: 'Kathmandu Cultural Heritage Tour',
      type: 'Cultural Tour',
      pricePerPerson: 8500,
      location: 'Kathmandu',
      image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800',
      available: true,
      verificationStatus: 'VERIFIED',
      features: ['UNESCO sites', 'Local guide', 'Traditional lunch', 'Temple visits', 'Handicraft workshop'],
      description: 'Explore seven UNESCO World Heritage Sites in the Kathmandu Valley including Pashupatinath, Boudhanath, and Swayambhunath.',
      duration: 2,
      maxGroupSize: 15,
      difficulty: 'Easy',
      createdBy: admin._id,
    },
    {
      name: 'Everest Base Camp Expedition',
      type: 'Mountain Expedition',
      pricePerPerson: 85000,
      location: 'Lukla (EBC)',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      available: false,
      verificationStatus: 'VERIFIED',
      features: ['Experienced Sherpa guides', 'All meals', 'Teahouse accommodation', 'Permits & fees', 'Emergency evacuation'],
      description: 'The ultimate Himalayan adventure to the base camp of the world\'s highest mountain at 5,364m.',
      duration: 16,
      maxGroupSize: 8,
      difficulty: 'Extreme',
      createdBy: admin._id,
    },
    {
      name: 'Lumbini Pilgrimage & Peace Tour',
      type: 'Pilgrimage',
      pricePerPerson: 9500,
      location: 'Lumbini',
      image: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800',
      available: true,
      verificationStatus: 'PENDING',
      features: ['Sacred garden visit', 'Monastery tours', 'Meditation session', 'Vegetarian meals', 'Local guide'],
      description: 'Visit the birthplace of Lord Buddha and explore the sacred gardens, monasteries, and meditation centres.',
      duration: 3,
      maxGroupSize: 20,
      difficulty: 'Easy',
      createdBy: staff._id,
    },
  ]);

  console.log('Tours created');
  console.log('\nSeed complete!');
  console.log('Default accounts:');
  console.log('  Admin:    admin@communitytours.com / admin123');
  console.log('  Staff:    staff@communitytours.com / staff123');
  console.log('  Customer: customer@communitytours.com / customer123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
