import express from 'express';
const router = express.Router();
import {
  getCompanyInfo,
  updateCompanyInfo,
  uploadLogo
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Public routes
router.get('/', getCompanyInfo);

// Protected routes
router.put('/', protect, authorize('super_admin', 'admin'), updateCompanyInfo);
router.post('/logo', protect, authorize('super_admin', 'admin'), upload.single('logo'), uploadLogo);

export default router;