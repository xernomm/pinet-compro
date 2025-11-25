import express from 'express';
const router = express.Router();
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.post('/', createContact);

// Protected routes
router.get('/', protect, authorize('super_admin', 'admin', 'editor'), getAllContacts);
router.get('/:id', protect, authorize('super_admin', 'admin', 'editor'), getContactById);
router.put('/:id/status', protect, authorize('super_admin', 'admin', 'editor'), updateContactStatus);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteContact);

export default router;