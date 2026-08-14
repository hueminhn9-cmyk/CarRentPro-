import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Publicly accessible vehicle endpoints
router.get('/', VehicleController.getAllVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Admin-only CRUD endpoints
router.post('/', authenticate, authorize('ADMIN'), VehicleController.createVehicle);
router.put('/:id', authenticate, authorize('ADMIN'), VehicleController.updateVehicle);
router.delete('/:id', authenticate, authorize('ADMIN'), VehicleController.deleteVehicle);

// Categories
router.get('/categories', VehicleController.getCategories);
router.get('/categories/:id', VehicleController.getCategoryById);
router.post('/categories', authenticate, authorize('ADMIN'), VehicleController.createCategory);
router.put('/categories/:id', authenticate, authorize('ADMIN'), VehicleController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('ADMIN'), VehicleController.deleteCategory);

export default router;
