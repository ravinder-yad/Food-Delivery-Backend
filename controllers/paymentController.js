import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email phone')
      .populate('order');
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ order: orderId })
      .populate('user', 'name email phone')
      .populate('order');
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found for this order' });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { user, order, paymentMethod, paymentStatus, transactionId, amount, currency } = req.body;

    if (!user || !order || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'User, Order, Payment Method and Amount are required fields' });
    }

    const newPayment = await Payment.create({
      user,
      order,
      paymentMethod,
      paymentStatus: paymentStatus || 'Pending',
      transactionId,
      amount,
      currency: currency || 'INR',
    });

    res.status(201).json(newPayment);
  } catch (error) {
    next(error);
  }
};
