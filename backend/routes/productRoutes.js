import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createProduct);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), updateProduct);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteProduct);

export default router;