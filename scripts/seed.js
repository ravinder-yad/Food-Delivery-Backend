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
        discount: 10,
        description: 'Classic mozzarella, basil, and tomato sauce.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Pizza')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Pepperoni Pizza',
        price: 399,
        discount: 15,
        description: 'Double pepperoni and mozzarella cheese.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Pizza')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Paneer Tikka Pizza',
        price: 320,
        discount: 12,
        description: 'Tandoori paneer cubes, capsicum, onions, and spicy sauce.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Pizza')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Smashed Cheese Burger',
        price: 199,
        discount: 20,
        description: 'Angus beef patty, cheddar, craft sauce.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Burger')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Double Patty Veg Burger',
        price: 149,
        discount: 10,
        description: 'Two crispy potato patties, cheese slice, lettuce, and mayo.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Burger')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Spicy Chicken Crispy Burger',
        price: 179,
        discount: 5,
        description: 'Batter-fried chicken breast, spicy sauce, pickles, and lettuce.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Burger')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Hyderabadi Chicken Biryani',
        price: 349,
        discount: 0,
        description: 'Fragrant basmati rice layered with spiced marinated chicken.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Biryani')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Veg Dum Biryani',
        price: 249,
        discount: 15,
        description: 'Basmati rice cooked with fresh seasonal vegetables and special spices.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Biryani')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Mutton Dum Biryani',
        price: 449,
        discount: 5,
        description: 'Slow-cooked mutton pieces in rich traditional spices and basmati rice.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Biryani')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Wok Tossed Hakka Noodles',
        price: 189,
        discount: 8,
        description: 'Stir-fried noodles loaded with crunchy vegetables and soy sauce.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Chinese')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Chicken Steamed Momos',
        price: 159,
        discount: 12,
        description: 'Juicy chicken mince stuffed inside soft wrapper, served with spicy red chutney.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Chinese')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Chocolate Lava Cake',
        price: 99,
        discount: 20,
        description: 'Decadent warm chocolate cake with a molten chocolate center.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Desserts')
      },
      {
        restaurant: defaultRestaurant._id,
        name: 'Red Velvet Pastry',
        price: 119,
        discount: 15,
        description: 'Rich layers of cocoa pastry with cream cheese frosting.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=300',
        category: getCatId('Desserts')
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
