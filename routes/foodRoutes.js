import express from 'express';
import { getFoods, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getFoods);
router.post('/', upload.single('imageFile'), createFood);
router.put('/:id', upload.single('imageFile'), updateFood);
router.delete('/:id', deleteFood);

export default router;
