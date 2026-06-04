import Food from '../models/Food.js';

export const getFoods = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const foods = await Food.find(query).populate('category').populate('restaurant');
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req, res, next) => {
  try {
    const foodData = { ...req.body };
    if (req.file) {
      foodData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    // Convert stringified values from FormData if present
    if (foodData.price) foodData.price = Number(foodData.price);
    if (foodData.discount) foodData.discount = Number(foodData.discount);
    if (foodData.isVeg) foodData.isVeg = foodData.isVeg === 'true' || foodData.isVeg === true;
    if (foodData.isAvailable) foodData.isAvailable = foodData.isAvailable === 'true' || foodData.isAvailable === true;

    const food = await Food.create(foodData);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const foodData = { ...req.body };
    if (req.file) {
      foodData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    if (foodData.price) foodData.price = Number(foodData.price);
    if (foodData.discount) foodData.discount = Number(foodData.discount);
    if (foodData.isVeg) foodData.isVeg = foodData.isVeg === 'true' || foodData.isVeg === true;
    if (foodData.isAvailable) foodData.isAvailable = foodData.isAvailable === 'true' || foodData.isAvailable === true;

    const food = await Food.findByIdAndUpdate(req.params.id, foodData, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    next(error);
  }
};
