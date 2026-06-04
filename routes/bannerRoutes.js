import express from 'express';
import { getBanners, createBanner } from '../controllers/bannerController.js';

const router = express.Router();
router.get('/', getBanners);
router.post('/', createBanner);

export default router;
