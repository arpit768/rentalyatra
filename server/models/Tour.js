const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Adventure Trek', 'Cultural Tour', 'Wildlife Safari', 'Mountain Expedition', 'Pilgrimage', 'City Tour'],
    required: true,
  },
  pricePerPerson: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  },
  available: { type: Boolean, default: true },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
  features: [{ type: String }],
  description: { type: String, default: '' },
  duration: { type: Number, required: true, min: 1 },
  maxGroupSize: { type: Number, required: true, min: 1 },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
    default: 'Moderate',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.createdBy = ret.createdBy ? ret.createdBy.toString() : ret.createdBy;
      delete ret._id;
      delete ret.__v;
    },
  },
});

module.exports = mongoose.model('Tour', tourSchema);
