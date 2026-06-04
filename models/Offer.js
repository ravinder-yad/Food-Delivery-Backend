import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discount: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
