import { Router } from 'express';
import { AuditLogController } from '../controllers/audit-log.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', AuditLogController.getAll);
router.get('/:id', AuditLogController.getById);
router.post('/', AuditLogController.create);
router.put('/:id', AuditLogController.update);
router.delete('/:id', AuditLogController.delete);

export default router;
