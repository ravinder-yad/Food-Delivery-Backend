import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Address from '../models/Address.js';

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
    if (!orderData.user || !mongoose.Types.ObjectId.isValid(orderData.user)) {
      let userObj = await User.findOne();
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

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};
