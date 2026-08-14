import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', ContractController.getAllContracts);
router.get('/:id/preview', ContractController.previewContract);
router.get('/:id/download', ContractController.downloadContract);
router.get('/:id', ContractController.getContractById);
router.get('/booking/:bookingId', ContractController.getContractByBookingId);
router.post('/sign', ContractController.signContract);
// Admin & Manager updates & CRUD
router.post('/', authorize('ADMIN', 'MANAGER'), ContractController.createContract);
router.put('/:id', authorize('ADMIN', 'MANAGER'), ContractController.updateContract);
router.delete('/:id', authorize('ADMIN'), ContractController.deleteContract);
export default router;
