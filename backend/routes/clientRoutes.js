import express from 'express';
const router = express.Router();
import {
  getAllClients,
  getClientById,
  getClientBySlug,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';
import { protect, authorize } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllClients);
router.get('/slug/:slug', getClientBySlug);
router.get('/:id', getClientById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.single('logo'), createClient);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.single('logo'), updateClient);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteClient);

export default router;