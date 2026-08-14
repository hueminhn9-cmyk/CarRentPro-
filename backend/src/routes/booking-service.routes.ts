import { Router } from 'express';
import { BookingServiceController } from '../controllers/booking-service.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', BookingServiceController.getAll);
router.get('/:id', BookingServiceController.getById);
router.post('/', authorize('ADMIN'), BookingServiceController.create);
router.put('/:id', authorize('ADMIN'), BookingServiceController.update);
router.delete('/:id', authorize('ADMIN'), BookingServiceController.delete);

export default router;
