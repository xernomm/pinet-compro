import express from 'express';
const router = express.Router();
import {
  getAllPartners,
  getPartnerById,
  getPartnerBySlug,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getAllPartners);
router.get('/slug/:slug', getPartnerBySlug);
router.get('/:id', getPartnerById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createPartner);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updatePartner);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deletePartner);

export default router;