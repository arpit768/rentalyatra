
import { UserRole, VehicleType, Vehicle, Booking, VerificationStatus } from './types';

export const APP_NAME = "Yatra Rentals";

export const NEPAL_LOCATIONS = [
  "Kathmandu",
  "Pokhara",
  "Chitwan",
  "Lumbini",
  "Mustang",
  "Nagarkot",
  "Lukla (Base)",
  "Biratnagar"
];

const DEFAULT_IMAGES = {
  front: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
  back: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
  left: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
  right: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
};

// Mock document for verified vehicles
const MOCK_DOCS = {
    billbook: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=300',
    insurance: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300'
};

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    ownerId: 'o1',
    name: 'Mahindra Scorpio 4WD',
    type: VehicleType.SUV,
    pricePerDay: 5000,
    location: 'Kathmandu',
    image: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=800',
    images: {
      front: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
      back: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
      left: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
      right: 'https://images.unsplash.com/photo-1633649647240-3490b4d4512c?auto=format&fit=crop&q=80&w=400',
    },
    documents: MOCK_DOCS,
    available: true,
    verificationStatus: VerificationStatus.VERIFIED,
    features: ['4WD', '7 Seater', 'AC', 'Roof Carrier'],
    description: 'The **undisputed king** of Nepali roads. Perfect for family trips to *Mustang* or navigating the bumpy Prithvi Highway.\n- High Ground Clearance\n- Powerful Diesel Engine\n- Spacious 7-seat configuration',
    plateNumber: 'BA 21 PA 1234',
    conditionReport: [
      { id: 'd1', part: 'bumper_front', severity: 'medium', description: 'Scratch from off-road debris', view: 'front' }
    ]
  },
  {
    id: 'v2',
    ownerId: 'o1',
    name: 'Royal Enfield Classic 350',
    type: VehicleType.BIKE,
    pricePerDay: 1500,
    location: 'Pokhara',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    images: DEFAULT_IMAGES,
    documents: MOCK_DOCS,
    available: true,
    verificationStatus: VerificationStatus.VERIFIED,
    features: ['350cc', 'Helmet Included', 'Leg Guard'],
    description: 'Experience the *Annapurna Circuit* on two wheels. The classic thump echoes through the mountains.\n- **Two Helmets Included**\n- Saddle bags available on request\n- Best for solo or couple riders',
    plateNumber: 'GA 15 PA 5678',
    conditionReport: []
  },
  {
    id: 'v3',
    ownerId: 'o2',
    name: 'Hyundai Creta',
    type: VehicleType.SUV,
    pricePerDay: 4500,
    location: 'Kathmandu',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    images: DEFAULT_IMAGES,
    documents: MOCK_DOCS,
    available: true,
    verificationStatus: VerificationStatus.VERIFIED,
    features: ['Automatic', 'Sunroof', 'Bluetooth', '5 Seater'],
    description: 'A premium compact SUV offering a **smooth city drive** and comfort for highway travel to *Chitwan*.\n- Panoramic Sunroof\n- Automatic Transmission\n- Modern Infotainment System',
    plateNumber: 'BA 10 CHA 9900',
    conditionReport: []
  },
  {
    id: 'v4',
    ownerId: 'o3',
    name: 'Toyota Land Cruiser Prado',
    type: VehicleType.OFFROAD,
    pricePerDay: 15000,
    location: 'Kathmandu',
    image: 'https://images.unsplash.com/photo-1594502184342-28efcb0a5748?auto=format&fit=crop&q=80&w=800',
    images: DEFAULT_IMAGES,
    documents: MOCK_DOCS,
    available: false,
    verificationStatus: VerificationStatus.VERIFIED,
    features: ['Luxury', '4WD', 'Heated Seats', 'GPS'],
    description: 'The ultimate **luxury off-roader** for VIP guests. Conquer any terrain in absolute comfort.\n- Heated Leather Seats\n- Advanced 4x4 System\n- **Chauffeur Service** Available',
    plateNumber: 'BA 01 PA 0001',
    conditionReport: [
        { id: 'd2', part: 'door_left', severity: 'low', description: 'Minor dent', view: 'left' },
        { id: 'd3', part: 'wheel', severity: 'critical', description: 'Worn out treads', view: 'left' }
    ]
  },
  {
    id: 'v5',
    ownerId: 'o2',
    name: 'Maruti Suzuki Swift',
    type: VehicleType.HATCHBACK,
    pricePerDay: 3000,
    location: 'Biratnagar',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    images: DEFAULT_IMAGES,
    documents: MOCK_DOCS,
    available: true,
    verificationStatus: VerificationStatus.PENDING,
    features: ['Economical', 'AC', 'Compact'],
    description: 'Your reliable companion for city errands and flat terrain travel in the *Terai region*.\n- **Fuel Efficient**\n- Easy to Park\n- Budget Friendly',
    plateNumber: 'KO 1 CHA 5555',
    conditionReport: []
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    vehicleId: 'v1',
    customerId: 'c1',
    startDate: '2023-11-01',
    endDate: '2023-11-05',
    totalPrice: 20000,
    status: 'CONFIRMED',
    destination: 'Pokhara'
  },
  {
    id: 'b2',
    vehicleId: 'v3',
    customerId: 'c1',
    startDate: '2023-12-10',
    endDate: '2023-12-12',
    totalPrice: 9000,
    status: 'PENDING',
    destination: 'Nagarkot'
  }
];
