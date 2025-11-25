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

// Public routes
router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createHero);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updateHero);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteHero);

export default router;