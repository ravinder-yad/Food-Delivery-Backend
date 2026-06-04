import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Food from '../models/Food.js';
import Banner from '../models/Banner.js';
import Offer from '../models/Offer.js';
import Settings from '../models/Settings.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Category.deleteMany();
    await Food.deleteMany();
    await Banner.deleteMany();
    await Offer.deleteMany();
    await Settings.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data...');

    // Create a default Admin/Owner user
    const defaultUser = await User.create({
      name: 'Chef Mario',
      email: 'restaurant@bitedash.com',
      phone: '9876543211',
      password: 'hashedpassword123',
      role: 'restaurant_owner',
      isVerified: true
    });

    // Create a default restaurant
    const defaultRestaurant = await Restaurant.create({
      owner: defaultUser._id,
      name: 'La Piazza & Pizzeria',
      description: 'Authentic stone-baked Italian pizzas and fresh pastas.',
      bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      rating: 4.8,
      cuisine: ['Italian', 'Pizza', 'Pasta']
    });

    // Seed Categories
    const categories = [
      { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200', description: 'Cheesy stone-baked pizzas' },
      { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200', description: 'Gourmet stuffed burgers' },
      { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=200', description: 'Aromatic Dum Biryani' },
      { name: 'Chinese', image: 'https://images.unsplash.com/photo-1563379971899-660589a0163e?auto=format&fit=crop&q=80&w=200', description: 'Wok tossed noodles and dimsums' },
      { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200', description: 'Sweet cakes and ice creams' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Seeded Categories...');

    const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

    // Seed Foods
    const foods = [
      {
        restaurant: defaultRestaurant._id,
        name: 'Margherita Pizza',
        price: 299,
        description: 'Classic mozzarella, basil, and tomato sauce.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Pizza')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Pepperoni Pizza',
        price: 399,
        description: 'Double pepperoni and mozzarella cheese.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Pizza')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Smashed Cheese Burger',
        price: 199,
        description: 'Angus beef patty, cheddar, craft sauce.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Burger')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Hyderabadi Chicken Biryani',
        price: 349,
        description: 'Fragrant basmati rice layered with spiced marinated chicken.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Biryani')
      }
    ];

    await Food.insertMany(foods);
    console.log('Seeded Foods...');

    // Seed Banners
    const banners = [
      {
        title: 'Delicious food, delivered to your door.',
        description: 'Order from your favorite local restaurants with smart AI-driven recommendations.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
        buttonText: 'Search Food',
        buttonLink: '/restaurants'
      }
    ];
    await Banner.insertMany(banners);
    console.log('Seeded Banners...');

    // Seed Offers
    const offers = [
      { name: 'New User Discount', discount: '50% OFF', couponCode: 'WELCOME50', status: 'Active' },
      { name: 'Super Saver Delivery', discount: 'FREE DEL', couponCode: 'FREEDEL', status: 'Active' }
    ];
    await Offer.insertMany(offers);
    console.log('Seeded Offers...');

    // Seed Settings
    await Settings.create({
      websiteName: 'QuickBite',
      supportEmail: 'support@quickbite.com',
      supportPhone: '+91 98765 43210'
    });
    console.log('Seeded Settings...');

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
