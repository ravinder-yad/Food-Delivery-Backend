import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // Percentage discount (e.g. 10 for 10% off)
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
export default Food;
