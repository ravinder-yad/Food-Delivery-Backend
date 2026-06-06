import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'restaurant_owner', 'delivery_partner'], default: 'customer' },
  profilePicture: { type: String },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  isVerified: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  walletTransactions: [{
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Deposit', 'Expense', 'Refund'], required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
