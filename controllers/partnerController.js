import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

export const registerRestaurantPartner = async (req, res, next) => {
  try {
    const { 
      ownerName, 
      email, 
      phone, 
      password, 
      restaurantName, 
      description, 
      bannerImage, 
      cuisine, 
      deliveryPrice, 
      estimatedDeliveryTime 
    } = req.body;

    if (!ownerName || !email || !phone || !password || !restaurantName) {
      return res.status(400).json({ message: 'Owner name, email, phone, password and restaurant name are required.' });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }

    // Create User (restaurant owner)
    const user = await User.create({
      name: ownerName,
      email,
      phone,
      password,
      role: 'restaurant_owner',
      isVerified: true
    });

    // Create Restaurant
    const cuisinesArray = Array.isArray(cuisine) 
      ? cuisine 
      : cuisine ? cuisine.split(',').map(c => c.trim()) : ['General'];

    const restaurant = await Restaurant.create({
      owner: user._id,
      name: restaurantName,
      description: description || 'Authentic dishes prepared by partner chefs.',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      cuisine: cuisinesArray,
      deliveryPrice: Number(deliveryPrice) || 40,
      estimatedDeliveryTime: estimatedDeliveryTime || '30-45 mins',
      rating: 4.5
    });

    res.status(201).json({
      message: 'Restaurant partner registered successfully!',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

export const registerDeliveryPartner = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      vehicleType, 
      licenseNumber, 
      city 
    } = req.body;

    if (!name || !email || !phone || !password || !vehicleType) {
      return res.status(400).json({ message: 'Name, email, phone, password and vehicle type are required.' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }

    // Create User (delivery partner)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'delivery_partner',
      isVerified: true
    });

    // Create DeliveryPartner
    const deliveryPartner = await DeliveryPartner.create({
      user: user._id,
      vehicleType,
      licenseNumber: licenseNumber || 'N/A',
      status: 'Available',
      currentLocation: {
        lat: 19.0760, // Default Mumbai coords
        lng: 72.8777
      }
    });

    res.status(201).json({
      message: 'Delivery partner rider registered successfully!',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      deliveryPartner
    });
  } catch (error) {
    next(error);
  }
};
