# Yatra Rentals Nepal - Backend API

Simple Express.js backend API for the Yatra Rentals Nepal application.

## Features

- JWT Authentication
- Vehicle Management
- Booking System
- File Upload (Images & Documents)
- Reviews & Ratings
- Analytics Dashboard
- Role-Based Access Control

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Vehicles

- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle (Owner/Admin)
- `PATCH /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `PATCH /api/vehicles/:id/toggle-availability` - Toggle availability
- `PATCH /api/vehicles/:id/verify` - Verify vehicle (Staff/Admin)

### Bookings

- `GET /api/bookings` - Get bookings (filtered by role)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update booking status

### File Upload

- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

### Reviews

- `GET /api/reviews/vehicle/:vehicleId` - Get reviews for vehicle
- `POST /api/reviews` - Create review

### Analytics (Admin only)

- `GET /api/analytics/stats` - Get platform statistics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token-here>
```

## Query Parameters

### Vehicles
- `location` - Filter by location
- `type` - Filter by vehicle type
- `available` - Filter by availability (true/false)
- `verificationStatus` - Filter by status (PENDING/VERIFIED/REJECTED)

### Bookings
- `customerId` - Filter by customer
- `vehicleId` - Filter by vehicle
- `status` - Filter by status

## File Upload

Supported file types:
- Images: JPEG, JPG, PNG
- Documents: PDF

Max file size: 5MB

## Security Features

- JWT token authentication
- Role-based access control
- Input validation
- File type validation
- File size limits
- CORS enabled

## Data Storage

Currently uses in-memory storage (arrays). For production, integrate with a real database:

- **Recommended:** PostgreSQL, MongoDB, or MySQL
- **Cloud Options:** Firebase, Supabase, PlanetScale

## Error Handling

API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Production Deployment

### Environment Setup

1. Set secure JWT_SECRET
2. Use production database
3. Enable HTTPS
4. Set up file storage (S3, Cloudinary, etc.)
5. Add rate limiting
6. Enable logging
7. Set up monitoring

### Deployment Platforms

- **Heroku** - Easy deployment
- **Railway** - Modern platform
- **Render** - Free tier available
- **AWS/GCP/Azure** - Full control
- **Vercel** - Serverless functions

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] SMS notifications (Twilio)
- [ ] Payment integration (eSewa/Khalti for Nepal)
- [ ] Real-time updates (WebSockets)
- [ ] API rate limiting
- [ ] Request logging
- [ ] Performance monitoring
- [ ] Automated testing

## License

MIT
