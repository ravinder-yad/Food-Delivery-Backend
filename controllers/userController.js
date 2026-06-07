import User from '../models/User.js';
import mongoose from 'mongoose';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').populate('addresses');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('addresses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, isVerified },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const resolveUser = async (id) => {
  let user;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id);
  }
  
  if (!user) {
    // Search for a seeded customer user or create a fallback
    user = await User.findOne({ email: 'customer@bitedash.com' });
    if (!user) {
      user = await User.create({
        name: 'Jane Doe',
        email: 'customer@bitedash.com',
        phone: '9876543210',
        password: 'hashedpassword123',
        role: 'customer',
        isVerified: true
      });
    }
  }
  return user;
};

export const getWalletDetails = async (req, res, next) => {
  try {
    const user = await resolveUser(req.params.id);
    res.json({
      walletBalance: user.walletBalance || 0,
      walletTransactions: user.walletTransactions || []
    });
  } catch (error) {
    next(error);
  }
};

export const addFundsToWallet = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    const user = await resolveUser(req.params.id);

    user.walletBalance = (user.walletBalance || 0) + depositAmount;
    user.walletTransactions.push({
      amount: depositAmount,
      type: 'Deposit',
      description: description || 'Added funds via Cards'
    });

    await user.save();

    res.json({
      success: true,
      message: 'Funds deposited successfully',
      walletBalance: user.walletBalance,
      walletTransactions: user.walletTransactions
    });
  } catch (error) {
    next(error);
  }
};
