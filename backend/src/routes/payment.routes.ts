import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Callbacks (accessed from outside payment portal redirect)
router.get('/vnpay-return', PaymentController.callbackVNPay);
router.get('/momo-return', PaymentController.callbackMoMo);

// Authorized endpoints
router.use(authenticate);

router.post('/', PaymentController.createPayment);
router.get('/', PaymentController.getAllPayments);
router.get('/:id', PaymentController.getPaymentById);
router.put('/:id/confirm', authorize('ADMIN'), PaymentController.confirmPayment);
router.put('/:id/refund', authorize('ADMIN'), PaymentController.refundPayment);
router.put('/:id', authorize('ADMIN'), PaymentController.updatePayment);
router.delete('/:id', authorize('ADMIN'), PaymentController.deletePayment);

export default router;
