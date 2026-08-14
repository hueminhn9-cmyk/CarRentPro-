import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Settings are readable by everyone
router.get('/', SettingController.getAllSettings);
router.get('/:key', SettingController.getSettingByKey);

// Admin-only operations
router.post('/', authenticate, authorize('ADMIN'), SettingController.createSetting);
router.put('/:key', authenticate, authorize('ADMIN'), SettingController.updateSetting);
router.delete('/:key', authenticate, authorize('ADMIN'), SettingController.deleteSetting);

export default router;
