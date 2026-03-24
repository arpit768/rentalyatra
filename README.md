# Community Tours and Travels

Nepal's tour and travel booking platform. Browse verified tour packages, book with expert guides, and explore the Himalayas.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js (Node.js)
- **Auth:** JWT + localStorage

## Quick Start

### Frontend

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

### Backend

```bash
cd server
npm install
node server.js
```

Runs at `http://localhost:3001`

## Default Accounts

| Role  | Email                        | Password |
|-------|------------------------------|----------|
| Admin | admin@communitytours.com     | admin123 |
| Staff | staff@communitytours.com     | staff123 |

Sign up from the app to create a Traveler account.

## User Roles

- **Traveler** - Browse tours, book packages, manage bookings
- **Tour Operator** - List packages, manage bookings, track earnings
- **Staff** - Verify tour packages, manage bookings, add tours (auto-verified)
- **Admin** - Platform analytics, staff management, full tour control

## Project Structure

```
├── App.tsx              # Main app with routing and state
├── components/
│   ├── Navbar.tsx       # Navigation with notifications
│   ├── Auth.tsx         # Login / Sign up
│   ├── LandingPage.tsx  # Public landing page
│   ├── CustomerView.tsx # Traveler dashboard
│   ├── OwnerView.tsx    # Tour operator dashboard
│   ├── StaffView.tsx    # Staff dashboard
│   ├── AdminView.tsx    # Admin dashboard
│   └── ProfileView.tsx  # User profile
├── services/
│   └── initUsers.ts     # Default account seeding
├── types.ts             # TypeScript types & enums
├── constants.ts         # Mock data & config
├── server/
│   └── server.js        # Express API server
└── vercel.json          # Vercel deployment config
```

## Deployment

- **Frontend** -> Vercel (see `DEPLOYMENT_GUIDE.md`)
- **Backend** -> Railway

See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.
