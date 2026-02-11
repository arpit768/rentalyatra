
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum VehicleType {
  SUV = 'SUV',
  SEDAN = 'Sedan',
  HATCHBACK = 'Hatchback',
  BIKE = 'Motorbike',
  OFFROAD = '4x4 Offroad'
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

export interface VehicleSideImages {
  front: string;
  back: string;
  left: string;
  right: string;
}

export interface VehicleDocuments {
  billbook: string; // Image URL of the Bluebook/Billbook
  insurance: string; // Image URL of the Insurance Paper
}

export interface DamagePoint {
  id: string;
  part: 'bumper_front' | 'bumper_rear' | 'door_left' | 'door_right' | 'hood' | 'trunk' | 'windshield' | 'wheel';
  severity: 'low' | 'medium' | 'critical';
  description: string;
  view: 'front' | 'back' | 'left' | 'right';
}

export interface Vehicle {
  id: string;
  ownerId: string;
  name: string;
  type: VehicleType;
  pricePerDay: number;
  location: string;
  image: string; // Primary thumbnail (usually front-left angle)
  images?: VehicleSideImages; // Detailed 4-side view
  documents?: VehicleDocuments; // Owner uploaded legal docs
  available: boolean;
  verificationStatus: VerificationStatus;
  features: string[];
  description: string;
  plateNumber: string;
  conditionReport?: DamagePoint[]; // Array of detected damages
}

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  destination: string; // Context specific for Nepal (e.g., permits needed?)
  insurance?: {
    type: string;
    dailyRate: number;
    totalCost: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
