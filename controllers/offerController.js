import Offer from '../models/Offer.js';

export const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

export const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};
