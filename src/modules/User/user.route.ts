import express from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = express.Router();

router.get('/users', UserController.getAllUsers);
// router.get('/users', authMiddleware('ADMIN'), UserController.getAllUsers);
router.patch('/users/:id', authMiddleware('ADMIN'), UserController.updateUserStatus);

export const AdminRoutes = router;
