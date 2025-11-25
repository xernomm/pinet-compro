import express from 'express';
const router = express.Router();
import {
  getAllCareers,
  getCareerById,
  getCareerBySlug,
  getOpenPositions,
  createCareer,
  updateCareer,
  deleteCareer,
  updateCareerStatus
} from '../controllers/careerController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getAllCareers);
router.get('/open', getOpenPositions);
router.get('/slug/:slug', getCareerBySlug);
router.get('/:id', getCareerById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createCareer);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updateCareer);
router.put('/:id/status', protect, authorize('super_admin', 'admin'), updateCareerStatus);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteCareer);

export default router;