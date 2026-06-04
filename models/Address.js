import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  latitude: { type: Number },
  longitude: { type: Number },
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
export default Address;
