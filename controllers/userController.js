import User from '../models/User.js';

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

export const getWalletDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
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

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
