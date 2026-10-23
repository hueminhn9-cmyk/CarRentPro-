import { Router } from 'express';
import { LocationController } from '../controllers/location.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', LocationController.getAllLocations);
router.get('/:id', LocationController.getLocationById);
router.post('/', authenticate, authorize('ADMIN'), LocationController.createLocation);

export default router;
