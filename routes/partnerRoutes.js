import express from 'express';
import { registerRestaurantPartner, registerDeliveryPartner } from '../controllers/partnerController.js';

const router = express.Router();

router.post('/restaurant', registerRestaurantPartner);
router.post('/delivery', registerDeliveryPartner);

export default router;
