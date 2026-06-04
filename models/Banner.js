import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  buttonText: { type: String, default: 'Order Now' },
  buttonLink: { type: String, default: '/restaurants' }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
