import Banner from '../models/Banner.js';

export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};
