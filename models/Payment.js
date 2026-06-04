import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  transactionId: { type: String }, // razorpay_payment_id or other transaction ID
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
