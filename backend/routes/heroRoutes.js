import express from 'express';
const router = express.Router();
import {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from '../controllers/heroController.js';
import { protect, authorize } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), createHero);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), updateHero);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteHero);

export default router;