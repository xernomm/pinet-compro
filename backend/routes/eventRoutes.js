import express from 'express';
const router = express.Router();
import {
  getAllEvents,
  getEventById,
  getEventBySlug,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/slug/:slug', getEventBySlug);
router.get('/:id', getEventById);

// Protected routes
router.post('/', protect, authorize('super_admin', 'admin', 'editor'), upload.single('featured_image'), createEvent);
router.put('/:id', protect, authorize('super_admin', 'admin', 'editor'), upload.single('featured_image'), updateEvent);
router.put('/:id/status', protect, authorize('super_admin', 'admin'), updateEventStatus);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteEvent);

export default router;