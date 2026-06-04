import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;
    const category = await Category.create({ name, image, description });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
