import express from 'express';
const router = express.Router();
import {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getAllServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createService);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updateService);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteService);

export default router;