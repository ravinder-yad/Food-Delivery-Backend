import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Address from '../models/Address.js';
import Payment from '../models/Payment.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user').populate('restaurant').populate('deliveryAddress');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const orderData = { ...req.body };

    // 1. Resolve User
    let userObj;
    if (orderData.user && mongoose.Types.ObjectId.isValid(orderData.user)) {
      userObj = await User.findById(orderData.user);
    }
    
    if (!userObj) {
      userObj = await User.findOne();
      if (!userObj) {
        userObj = await User.create({
          name: 'Jane Doe',
          email: 'customer@bitedash.com',
          phone: '9876543210',
          password: 'hashedpassword123',
          role: 'customer',
          isVerified: true
        });
      }
      orderData.user = userObj._id;
    }

    // 2. Resolve Restaurant
    if (!orderData.restaurant || !mongoose.Types.ObjectId.isValid(orderData.restaurant)) {
      let resObj = await Restaurant.findOne();
      if (!resObj) {
        resObj = await Restaurant.create({
          name: 'La Piazza & Pizzeria',
          description: 'Authentic stone-baked Italian pizzas and fresh pastas.',
          bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
          rating: 4.8,
          cuisine: ['Italian']
        });
      }
      orderData.restaurant = resObj._id;
    }

    // 3. Resolve Address
    if (!orderData.deliveryAddress || !mongoose.Types.ObjectId.isValid(orderData.deliveryAddress)) {
      let addrObj = await Address.findOne({ user: orderData.user });
      if (!addrObj) {
        addrObj = await Address.create({
          user: orderData.user,
          addressLine1: '123, Green Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
          addressType: 'Home'
        });
      }
      orderData.deliveryAddress = addrObj._id;
    }

    // 4. Generate OTP
    orderData.otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 5. Handle Wallet Payment Deductions
    if (orderData.paymentMethod === 'Wallet') {
      const grandTotal = parseFloat(orderData.totalAmount);
      if (isNaN(grandTotal) || grandTotal <= 0) {
        return res.status(400).json({ message: 'Invalid order amount' });
      }
      if ((userObj.walletBalance || 0) < grandTotal) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      userObj.walletBalance = (userObj.walletBalance || 0) - grandTotal;
      userObj.walletTransactions.push({
        amount: grandTotal,
        type: 'Expense',
        description: `Order payment`
      });
      await userObj.save();
      orderData.paymentStatus = 'Completed';
    } else {
      orderData.paymentStatus = orderData.paymentStatus || (orderData.paymentMethod === 'Online' ? 'Completed' : 'Pending');
    }

    const order = await Order.create(orderData);

    // Create associated Payment record in DB
    const transactionId = (order.paymentMethod === 'Online' || order.paymentMethod === 'Wallet')
      ? (orderData.transactionId || (order.paymentMethod === 'Wallet' ? 'wlt_' : 'pay_') + Math.random().toString(36).substring(2, 11).toUpperCase())
      : null;

    await Payment.create({
      user: order.user,
      order: order._id,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      amount: order.totalAmount,
      transactionId: transactionId
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    
    // Fetch order first to check properties
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.orderStatus = orderStatus;
    
    // If order status is set to Delivered, mark payment as Completed (mainly for COD)
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Completed';
      
      // Sync Payment model
      await Payment.findOneAndUpdate(
        { order: order._id },
        { paymentStatus: 'Completed' }
      );
    }
    
    await order.save();
    
    // Populate and return updated order
    const updatedOrder = await Order.findById(order._id)
      .populate('user')
      .populate('restaurant')
      .populate('deliveryAddress');
      
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
