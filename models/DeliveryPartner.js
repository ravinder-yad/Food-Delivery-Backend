import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleType: { type: String, enum: ['Cycle', 'Bike', 'Scooter'], required: true },
  vehicleNumber: { type: String },
  status: { type: String, enum: ['Offline', 'Active', 'OnDelivery'], default: 'Offline' },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  rating: { type: Number, default: 0 },
  numDeliveries: { type: Number, default: 0 },
}, { timestamps: true });

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
