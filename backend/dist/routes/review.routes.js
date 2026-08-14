import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = Router();
// Public reviews lookup
router.get('/', ReviewController.getAllReviews);
router.get('/vehicle/:vehicleId/stats', ReviewController.getVehicleStats);
router.get('/:id', ReviewController.getReviewById);
// Submit, edit or delete review
router.post('/', authenticate, ReviewController.createReview);
router.put('/:id', authenticate, ReviewController.updateReview);
router.delete('/:id', authenticate, authorize('ADMIN'), ReviewController.deleteReview);
export default router;
