const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  numPeople: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  destination: { type: String, required: true },
  insurance: {
    type: {
      type: String,
      default: 'Standard',
    },
    ratePerPerson: { type: Number },
    totalCost: { type: Number },
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.tourId = ret.tourId ? ret.tourId.toString() : ret.tourId;
      ret.customerId = ret.customerId ? ret.customerId.toString() : ret.customerId;
      delete ret._id;
      delete ret.__v;
    },
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
