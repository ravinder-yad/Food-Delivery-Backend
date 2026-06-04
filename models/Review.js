import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }, // Optional, if reviewing a specific food item
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
