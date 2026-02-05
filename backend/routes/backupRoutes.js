import express from 'express';
import { createBackup } from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('super_admin', 'admin'), createBackup);

export default router;
