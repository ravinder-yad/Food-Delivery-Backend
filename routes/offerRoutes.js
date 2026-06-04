import express from 'express';
import { getOffers, createOffer } from '../controllers/offerController.js';

const router = express.Router();
router.get('/', getOffers);
router.post('/', createOffer);

export default router;
