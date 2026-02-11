# Yatra Rentals Nepal 🚗🏔️

A comprehensive vehicle rental platform specifically designed for Nepal's terrain and tourist market. Built with React, TypeScript, and powered by Gemini AI.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Role System**: Customer, Owner, Staff, Admin, and Guest views
- **Vehicle Management**: List, verify, and manage rental vehicles
- **Booking System**: Complete rental workflow with calendar integration
- **AI-Powered Assistant**: Gemini AI chatbot for recommendations and support
- **Reviews & Ratings**: Customer feedback and vehicle ratings
- **Real-time Notifications**: Toast notifications for all actions
- **Image Gallery**: Multi-image upload and lightbox viewer
- **Advanced Search**: Filter by location, type, price, and availability

### 🇳🇵 Nepal-Specific Features
- 8 major locations (Kathmandu, Pokhara, Chitwan, Mustang, etc.)
- Terrain-aware vehicle categorization (4x4, offroad)
- Destination-based booking with permits context
- Local vehicle documentation (billbook/bluebook)
- Nepal plate number format support

### 🔐 Security & Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Secure file upload with validation

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### Frontend Setup

1. **Clone and Navigate**
   ```bash
   cd "/path/to/Rental "
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**

   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   App will be available at: **http://localhost:3000**

### Backend Setup

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Install Server Dependencies**
   ```bash
   npm install
   ```

3. **Configure Server Environment**

   Create `server/.env`:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```

   API will be available at: **http://localhost:3001**

### 🎮 Quick Demo

Use the **Quick Demo Login** buttons on the login page to test different roles:
- **Customer** - Browse and book vehicles
- **Owner** - Manage your vehicle fleet
- **Staff** - Verify vehicles and bookings
- **Admin** - Full platform analytics

## 📁 Project Structure

```
Rental/
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Auth.tsx
│   ├── LandingPage.tsx
│   ├── CustomerView.tsx
│   ├── OwnerView.tsx
│   ├── StaffView.tsx
│   ├── AdminView.tsx
│   ├── ProfileView.tsx
│   ├── AIChat.tsx      # Gemini AI chatbot
│   ├── Toast.tsx       # Notification system
│   ├── ImageGallery.tsx
│   ├── LoadingSpinner.tsx
│   └── Reviews.tsx
├── services/
│   └── api.ts          # API client service
├── server/             # Express.js backend
│   ├── server.js       # Main server file
│   ├── uploads/        # File storage
│   └── package.json
├── types.ts            # TypeScript definitions
├── constants.ts        # Mock data & constants
├── App.tsx            # Main app component
├── index.css          # Global styles
└── vite.config.ts     # Vite configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Gemini AI** - AI assistant

### Backend
- **Express.js 4** - Web framework
- **JWT** - Authentication
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## 🎨 Components Overview

### User Interface
- **Navbar** - Role-based navigation with mobile support
- **Auth** - Login/signup with validation + quick demo
- **LandingPage** - Guest homepage with featured vehicles

### Role-Based Views
- **CustomerView** - Browse, filter, book vehicles
- **OwnerView** - Manage vehicles, bookings, earnings
- **StaffView** - Vehicle verification & inspection
- **AdminView** - Platform analytics & management
- **ProfileView** - User stats and account info

### Enhanced Components
- **AIChat** - Intelligent chatbot with vehicle recommendations
- **ImageGallery** - Lightbox with keyboard navigation
- **Reviews** - Star ratings and customer feedback
- **Toast** - Non-intrusive notifications
- **LoadingSpinner** - Skeleton screens for better UX

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup    - Register new user
POST   /api/auth/login     - Login user
GET    /api/auth/me        - Get current user
POST   /api/auth/logout    - Logout user
```

### Vehicles
```
GET    /api/vehicles              - Get all vehicles
GET    /api/vehicles/:id          - Get vehicle by ID
POST   /api/vehicles              - Create vehicle (Owner/Admin)
PATCH  /api/vehicles/:id          - Update vehicle
PATCH  /api/vehicles/:id/verify   - Verify vehicle (Staff/Admin)
DELETE /api/vehicles/:id          - Delete vehicle
```

### Bookings
```
GET    /api/bookings              - Get bookings (filtered by role)
POST   /api/bookings              - Create booking
PATCH  /api/bookings/:id/status   - Update booking status
```

### File Upload
```
POST   /api/upload                - Upload single file
POST   /api/upload/multiple       - Upload multiple files
```

Full API documentation: [server/README.md](server/README.md)

## 🤖 AI Features

The Gemini AI chatbot can help with:
- **Vehicle Recommendations** - Based on destination and preferences
- **Location Insights** - Best times to visit, route suggestions
- **Pricing Information** - Budget-friendly options
- **Insurance Guidance** - Coverage details and recommendations
- **Document Requirements** - License and permit information
- **Weather & Seasons** - Best time for road trips

## 📊 Current Status

### ✅ Completed (Phases 1-4)
- [x] All 8 core components
- [x] Authentication system
- [x] Booking workflow
- [x] Vehicle management
- [x] AI chatbot integration
- [x] Toast notifications
- [x] Image gallery
- [x] Reviews & ratings
- [x] Backend API
- [x] File upload system

### 🚧 In Progress
- [ ] Calendar-based booking UI
- [ ] Advanced search enhancements
- [ ] Animation improvements
- [ ] JWT token refresh logic

### 📋 Future Enhancements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway (eSewa/Khalti)
- [ ] Email/SMS notifications
- [ ] Real-time updates (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Nepali/English)

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# E2E tests
npm run test:e2e
```

## 📦 Build for Production

### Frontend
```bash
npm run build
```
Output: `dist/` directory

### Backend
```bash
cd server
npm start
```

### Environment Variables (Production)
```env
# Frontend (.env.local)
GEMINI_API_KEY=your_production_key
VITE_API_URL=https://your-api-domain.com/api

# Backend (.env)
PORT=3001
JWT_SECRET=super-secure-random-string
NODE_ENV=production
DATABASE_URL=your_database_url
```

## 🚀 Deployment

### Frontend Options
- **Vercel** - Recommended for React apps
- **Netlify** - Great for static sites
- **Railway** - Full-stack platform
- **AWS S3 + CloudFront** - Scalable

### Backend Options
- **Railway** - Easy Node.js deployment
- **Heroku** - Traditional PaaS
- **Render** - Free tier available
- **AWS EC2** - Full control
- **DigitalOcean** - VPS hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** - AI-powered assistance
- **Lucide Icons** - Beautiful icon set
- **Tailwind CSS** - Utility-first CSS framework
- **Nepal Tourism Board** - Inspiration for destinations

## 📧 Support

For support, email: support@yatrarentals.com
Or join our Discord: [discord.gg/yatrarentals](https://discord.gg/yatrarentals)

## 🌟 Star the Project

If you find this project useful, please consider giving it a star on GitHub!

---

**Made with ❤️ for Nepal's travelers**

View in AI Studio: https://ai.studio/apps/drive/1EOxCIBE-jLWq6tywj1_um17Xtyi0uIwB
