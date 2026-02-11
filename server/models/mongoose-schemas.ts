// Alternative: MongoDB with Mongoose
// Use this if you prefer MongoDB over PostgreSQL

import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'GUEST' | 'CUSTOMER' | 'OWNER' | 'STAFF' | 'ADMIN';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['GUEST', 'CUSTOMER', 'OWNER', 'STAFF', 'ADMIN'], default: 'CUSTOMER' },
    avatar: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

// Vehicle Schema
export interface IVehicle extends Document {
  name: string;
  type: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'MOTORCYCLE' | 'OFFROAD_4X4';
  plateNumber: string;
  location: string;
  pricePerDay: number;
  features: string[];
  description?: string;
  available: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  insuranceIncluded: boolean;
  ownerId: mongoose.Types.ObjectId;
  images: Array<{
    url: string;
    angle: string;
    isPrimary: boolean;
  }>;
  documents: Array<{
    type: string;
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['SUV', 'SEDAN', 'HATCHBACK', 'MOTORCYCLE', 'OFFROAD_4X4'], required: true },
    plateNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    features: [{ type: String }],
    description: { type: String },
    available: { type: Boolean, default: true },
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    insuranceIncluded: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    images: [
      {
        url: { type: String, required: true },
        angle: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

VehicleSchema.index({ location: 1, type: 1, available: 1, verificationStatus: 1 });
VehicleSchema.index({ ownerId: 1 });

// Booking Schema
export interface IBooking extends Document {
  startDate: Date;
  endDate: Date;
  destination: string;
  insurance: boolean;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  customerId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    destination: { type: String, required: true },
    insurance: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  },
  { timestamps: true }
);

BookingSchema.index({ customerId: 1, status: 1 });
BookingSchema.index({ vehicleId: 1, startDate: 1 });

// Payment Schema
export interface IPayment extends Document {
  amount: number;
  method: 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  bookingId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    method: { type: String, enum: ['ESEWA', 'KHALTI', 'BANK_TRANSFER'], required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    transactionId: { type: String, unique: true, sparse: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  },
  { timestamps: true }
);

PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ status: 1 });

// Review Schema
export interface IReview extends Document {
  rating: number;
  comment: string;
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ vehicleId: 1 });
ReviewSchema.index({ userId: 1 });

// Damage Report Schema
export interface IDamageReport extends Document {
  reportType: 'PRE_RENTAL' | 'POST_RENTAL';
  damages: Array<{
    id: string;
    view: string;
    x: number;
    y: number;
    part: string;
    severity: string;
    description: string;
  }>;
  totalDamages: number;
  vehicleId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DamageReportSchema = new Schema<IDamageReport>(
  {
    reportType: { type: String, enum: ['PRE_RENTAL', 'POST_RENTAL'], required: true },
    damages: [
      {
        id: String,
        view: String,
        x: Number,
        y: Number,
        part: String,
        severity: String,
        description: String,
      },
    ],
    totalDamages: { type: Number, default: 0 },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  },
  { timestamps: true }
);

DamageReportSchema.index({ vehicleId: 1 });

// Notification Schema
export interface INotification extends Document {
  type: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'SENT' | 'FAILED';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: { type: String, required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ['SENT', 'FAILED'], required: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, status: 1 });

// Export Models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export const Review = mongoose.model<IReview>('Review', ReviewSchema);
export const DamageReport = mongoose.model<IDamageReport>('DamageReport', DamageReportSchema);
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// MongoDB Connection
export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/yatra-rentals');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}
