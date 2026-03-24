
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum TourType {
  ADVENTURE_TREK = 'Adventure Trek',
  CULTURAL_TOUR = 'Cultural Tour',
  WILDLIFE_SAFARI = 'Wildlife Safari',
  MOUNTAIN_EXPEDITION = 'Mountain Expedition',
  PILGRIMAGE = 'Pilgrimage',
  CITY_TOUR = 'City Tour',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Tour {
  id: string;
  ownerId: string;
  name: string;
  type: TourType;
  pricePerPerson: number;
  location: string;
  image: string;
  available: boolean;
  verificationStatus: VerificationStatus;
  features: string[];
  description: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
}

export interface Booking {
  id: string;
  tourId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  numPeople: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  destination: string;
  insurance?: {
    type: string;
    ratePerPerson: number;
    totalCost: number;
  };
}

export interface AppNotification {
  id: string;
  message: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  read: boolean;
  forRole: UserRole | 'ALL';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
