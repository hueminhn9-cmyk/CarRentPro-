import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

// Create, get detailed booking, and get all bookings (customer or admin filter)
router.post('/', BookingController.createBooking);
router.get('/', BookingController.getAllBookings);
router.get('/:id', BookingController.getBookingById);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', authorize('ADMIN'), BookingController.deleteBooking);

// Admin & Manager: status change and handover creation
router.put('/:id/status', authorize('ADMIN', 'MANAGER'), BookingController.updateStatus);
router.post('/:id/handover', authorize('ADMIN', 'MANAGER'), BookingController.createHandover);

export default router;
