import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Admin & Manager maintenance management endpoints
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), MaintenanceController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), MaintenanceController.getById);
router.post('/schedule', authenticate, authorize('ADMIN', 'MANAGER'), MaintenanceController.schedule);
router.put('/:id/complete', authenticate, authorize('ADMIN', 'MANAGER'), MaintenanceController.complete);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), MaintenanceController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), MaintenanceController.delete);

export default router;
