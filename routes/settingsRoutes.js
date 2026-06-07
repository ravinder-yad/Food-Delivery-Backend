import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getSettings);
router.put('/', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'bannerFile', maxCount: 1 }
]), updateSettings);

export default router;
