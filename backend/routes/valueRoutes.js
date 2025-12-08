import express from 'express';
const router = express.Router();
import {
  getAllValues,
  getValueById,
  createValue,
  updateValue,
  deleteValue
} from '../controllers/valueController.js';
import { protect, authorize } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllValues);
router.get('/:id', getValueById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), createValue);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.single('image'), updateValue);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteValue);

export default router;