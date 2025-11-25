import express from 'express';
const router = express.Router();
import {
  getAllNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  publishNews
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getAllNews);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id', getNewsById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createNews);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updateNews);
router.put('/:id/publish', protect, authorize('super_admin', 'admin'), publishNews);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteNews);

export default router;