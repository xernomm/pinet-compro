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

// Public routes
router.get('/', getAllValues);
router.get('/:id', getValueById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), createValue);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), updateValue);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteValue);

export default router;