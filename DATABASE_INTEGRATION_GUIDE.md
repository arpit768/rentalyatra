# 🗄️ Database Integration Guide

Complete guide to integrate database with Yatra Rentals Nepal.

---

## 📋 Overview

Two database options available:
1. **PostgreSQL with Prisma** (Recommended)
2. **MongoDB with Mongoose** (Alternative)

---

## 🐘 Option 1: PostgreSQL + Prisma (Recommended)

### Why PostgreSQL?
- ✅ Relational data structure
- ✅ Strong data integrity
- ✅ ACID compliance
- ✅ Perfect for bookings & payments
- ✅ Great query performance

### Step 1: Install Dependencies

```bash
cd server
npm install @prisma/client bcryptjs dotenv
npm install -D prisma
```

### Step 2: Setup Environment

Create `server/.env`:
```env
# PostgreSQL Connection
DATABASE_URL="postgresql://user:password@localhost:5432/yatra_rentals?schema=public"

# Or use hosted database
DATABASE_URL="postgresql://user:password@dpg-xxxx.oregon-postgres.render.com/yatra_db"
```

### Step 3: Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### Step 4: Verify Schema

The schema is already created at `/prisma/schema.prisma` with:
- **Users** - Authentication & profiles
- **Vehicles** - Fleet management
- **Bookings** - Rental bookings
- **Payments** - Payment records
- **Reviews** - Customer ratings
- **DamageReports** - Vehicle inspection
- **Notifications** - Email/SMS logs

### Step 5: Use in Backend

```typescript
import prisma from './config/database';

// Example: Get all vehicles
const vehicles = await prisma.vehicle.findMany({
  where: { available: true },
  include: { owner: true, images: true }
});

// Example: Create booking
const booking = await prisma.booking.create({
  data: {
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-05'),
    destination: 'Pokhara',
    totalPrice: 20000,
    customerId: user.id,
    vehicleId: vehicle.id
  }
});

// Example: Get user with bookings
const user = await prisma.user.findUnique({
  where: { email: 'ram@example.com' },
  include: {
    bookings: {
      include: { vehicle: true }
    }
  }
});
```

---

## 🍃 Option 2: MongoDB + Mongoose (Alternative)

### Why MongoDB?
- ✅ Flexible schema
- ✅ JSON-like documents
- ✅ Easy to scale horizontally
- ✅ Great for rapid development

### Step 1: Install Dependencies

```bash
cd server
npm install mongoose
```

### Step 2: Setup Environment

Create `server/.env`:
```env
# MongoDB Connection
MONGODB_URL="mongodb://localhost:27017/yatra-rentals"

# Or use MongoDB Atlas (hosted)
MONGODB_URL="mongodb+srv://user:password@cluster.mongodb.net/yatra-rentals?retryWrites=true&w=majority"
```

### Step 3: Use Models

The Mongoose schemas are in `server/models/mongoose-schemas.ts`:

```typescript
import { connectMongoDB, User, Vehicle, Booking } from './models/mongoose-schemas';

// Connect
await connectMongoDB();

// Example: Create user
const user = await User.create({
  email: 'ram@example.com',
  password: hashedPassword,
  name: 'Ram Kumar',
  role: 'CUSTOMER'
});

// Example: Find vehicles
const vehicles = await Vehicle.find({
  available: true,
  location: 'Kathmandu'
}).populate('ownerId');

// Example: Create booking
const booking = await Booking.create({
  startDate: new Date('2026-03-01'),
  endDate: new Date('2026-03-05'),
  destination: 'Pokhara',
  totalPrice: 20000,
  customerId: user._id,
  vehicleId: vehicle._id
});
```

---

## 🚀 Quick Start

### Using PostgreSQL (Recommended)

```bash
# 1. Install dependencies
cd server
npm install

# 2. Setup .env
echo 'DATABASE_URL="postgresql://localhost:5432/yatra_rentals"' > .env

# 3. Run migrations
npx prisma migrate dev

# 4. Seed database (optional)
npx prisma db seed

# 5. Start server
npm run dev
```

### Using MongoDB

```bash
# 1. Install dependencies
cd server
npm install

# 2. Setup .env
echo 'MONGODB_URL="mongodb://localhost:27017/yatra-rentals"' > .env

# 3. Start MongoDB locally
mongod

# 4. Start server (creates collections automatically)
npm run dev
```

---

## 🌐 Hosted Database Options

### PostgreSQL Hosting

1. **Supabase** (Free tier: 500 MB)
   ```
   DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
   ```

2. **Railway** (Free tier: Shared)
   ```
   DATABASE_URL="postgresql://postgres:[password]@containers-us-west-xx.railway.app:xxxx/railway"
   ```

3. **Render** (Free tier: 90 days)
   ```
   DATABASE_URL="postgresql://user:pass@dpg-xxxx.oregon-postgres.render.com/dbname"
   ```

4. **Neon** (Free tier: 3 GB)
   ```
   DATABASE_URL="postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/dbname"
   ```

### MongoDB Hosting

1. **MongoDB Atlas** (Free tier: 512 MB)
   ```
   MONGODB_URL="mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/yatra"
   ```

2. **Railway** (Free tier available)
   ```
   MONGODB_URL="mongodb://mongo:pass@containers-us-west-xx.railway.app:xxxx"
   ```

---

## 🔄 Migration from Mock Data

### Step 1: Export Mock Data

Create `server/scripts/export-mock.js`:
```javascript
const fs = require('fs');
const { mockVehicles, mockBookings } = require('../constants');

fs.writeFileSync('mock-data.json', JSON.stringify({
  vehicles: mockVehicles,
  bookings: mockBookings
}, null, 2));

console.log('Mock data exported!');
```

### Step 2: Import to Database

Create `server/prisma/seed.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const mockData = require('./mock-data.json');

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ram@example.com',
        password: 'hashed_password',
        name: 'Ram Kumar',
        role: 'CUSTOMER'
      }
    }),
    // ... more users
  ]);

  // Create vehicles
  for (const vehicle of mockData.vehicles) {
    await prisma.vehicle.create({
      data: {
        name: vehicle.name,
        type: vehicle.type,
        plateNumber: vehicle.plateNumber,
        location: vehicle.location,
        pricePerDay: vehicle.pricePerDay,
        features: vehicle.features,
        ownerId: users[1].id, // Owner
        images: {
          create: vehicle.images.map(img => ({
            url: img,
            angle: 'front',
            isPrimary: true
          }))
        }
      }
    });
  }

  console.log('✅ Database seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:
```bash
node prisma/seed.js
```

---

## 🔌 Update Backend API

### Before (Mock Data)
```javascript
// server.js
let vehicles = mockVehicles;

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});
```

### After (Database)
```javascript
// server.js
import prisma from './config/database';

app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { available: true },
      include: { images: true, owner: true }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});
```

---

## 🔍 Common Database Queries

### Get Available Vehicles
```typescript
const vehicles = await prisma.vehicle.findMany({
  where: {
    available: true,
    verificationStatus: 'VERIFIED',
    location: 'Kathmandu'
  },
  include: {
    images: true,
    reviews: true
  },
  orderBy: { createdAt: 'desc' }
});
```

### Create Booking
```typescript
const booking = await prisma.booking.create({
  data: {
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-05'),
    destination: 'Pokhara',
    insurance: true,
    totalPrice: 25000,
    status: 'CONFIRMED',
    customerId: userId,
    vehicleId: vehicleId
  },
  include: {
    vehicle: true,
    customer: true
  }
});
```

### Get User Bookings
```typescript
const bookings = await prisma.booking.findMany({
  where: { customerId: userId },
  include: {
    vehicle: {
      include: { images: true }
    },
    payment: true
  },
  orderBy: { createdAt: 'desc' }
});
```

### Add Review
```typescript
const review = await prisma.review.create({
  data: {
    rating: 5,
    comment: 'Great vehicle!',
    userId: userId,
    vehicleId: vehicleId
  }
});

// Update vehicle average rating
const avgRating = await prisma.review.aggregate({
  where: { vehicleId: vehicleId },
  _avg: { rating: true }
});
```

### Process Payment
```typescript
const payment = await prisma.payment.create({
  data: {
    amount: 25000,
    method: 'ESEWA',
    status: 'COMPLETED',
    transactionId: 'PAY_ESEWA_12345',
    bookingId: bookingId
  }
});

// Update booking status
await prisma.booking.update({
  where: { id: bookingId },
  data: { status: 'CONFIRMED' }
});
```

---

## 📊 Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at http://localhost:5555

Features:
- View all tables
- Edit records
- Filter & search
- Add new records
- Delete records

---

## 🛡️ Database Best Practices

### 1. Use Transactions
```typescript
await prisma.$transaction(async (tx) => {
  const payment = await tx.payment.create({ data: {...} });
  await tx.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' }
  });
});
```

### 2. Connection Pooling
```typescript
// In production
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  connection_limit: 10
});
```

### 3. Error Handling
```typescript
try {
  const result = await prisma.vehicle.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    throw new Error('Plate number already exists');
  }
  throw error;
}
```

### 4. Indexing
Already added in schema:
```prisma
@@index([location, type, available])
```

---

## 🧪 Testing Database

### Test Connection
```typescript
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    const count = await prisma.user.count();
    console.log(`Users in database: ${count}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}
```

---

## 📝 Environment Variables

Complete `.env` for server:
```env
# Server
NODE_ENV=production
PORT=3001

# Database (Choose one)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
# MONGODB_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# Payment Gateways
ESEWA_MERCHANT_ID=your_merchant_id
ESEWA_SECRET_KEY=your_secret
KHALTI_PUBLIC_KEY=your_public_key
KHALTI_SECRET_KEY=your_secret

# Email
SENDGRID_API_KEY=your_key
FROM_EMAIL=noreply@yatrarentals.com

# SMS
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=+977xxxxxxxxxx
```

---

## 🚀 Deployment

### Railway (PostgreSQL)
```bash
# Deploy with Railway
railway login
railway init
railway add
railway link

# Add PostgreSQL
railway add postgres

# Get DATABASE_URL (auto-added)
railway variables

# Deploy
railway up
```

### Vercel (with Supabase)
```bash
# Use Supabase for database
# Vercel for API (serverless functions)

vercel env add DATABASE_URL
vercel deploy --prod
```

---

## 📞 Troubleshooting

### Connection Issues
```bash
# Test PostgreSQL connection
psql $DATABASE_URL

# Test MongoDB connection
mongosh $MONGODB_URL
```

### Migration Errors
```bash
# Reset database
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

---

## ✅ Checklist

- [ ] Choose database (PostgreSQL or MongoDB)
- [ ] Create hosted database instance
- [ ] Add DATABASE_URL to .env
- [ ] Run migrations (Prisma) or connect (Mongoose)
- [ ] Seed initial data
- [ ] Test database connection
- [ ] Update API endpoints to use database
- [ ] Test all CRUD operations
- [ ] Deploy to production
- [ ] Verify production database

---

**Database Integration Status:** Ready to implement!
**Time to integrate:** 30-60 minutes
**Difficulty:** Intermediate

🗄️ **Your data layer is ready for production!**
