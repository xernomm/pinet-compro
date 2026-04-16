import express from 'express';
import { createBackup, syncUploads } from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('super_admin', 'admin'), createBackup);
router.post('/uploads', protect, authorize('super_admin', 'admin'), syncUploads);

export default router;
