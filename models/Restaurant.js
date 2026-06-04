import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  bannerImage: { type: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  cuisine: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  estimatedDeliveryTime: { type: String, default: '30-40 mins' },
  deliveryPrice: { type: Number, default: 0 },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
