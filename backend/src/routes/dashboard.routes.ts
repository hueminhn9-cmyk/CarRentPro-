import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/stats', authenticate, authorize('ADMIN'), DashboardController.getStats);

export default router;
