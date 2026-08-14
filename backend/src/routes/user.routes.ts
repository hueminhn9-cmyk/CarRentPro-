import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';

const router = Router();

router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.put('/profile/customer', UserController.updateCustomerDetails);

// Admin & Manager endpoints
router.get('/', authorize('ADMIN', 'MANAGER'), UserController.getAllUsers);
router.post('/', authorize('ADMIN'), UserController.createUser);
router.get('/:id', authorize('ADMIN', 'MANAGER'), UserController.getUserById);
router.put('/:id', authorize('ADMIN'), UserController.updateUserAdmin);
router.put('/:id/verify', authorize('ADMIN', 'MANAGER'), UserController.verifyCustomer);
router.delete('/:id', authorize('ADMIN'), UserController.deleteUser);

export default router;
