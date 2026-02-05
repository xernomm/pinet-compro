import express from 'express';
import { createBackup } from '../controllers/backupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createBackup);

export default router;
