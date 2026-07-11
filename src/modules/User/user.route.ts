import express from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = express.Router();

// Admin — users
router.get('/users', UserController.getAllUsers);
router.patch('/users/:id', authMiddleware('ADMIN'), UserController.updateUserStatus);

// Admin — tutors management
router.get('/tutors', UserController.getAllAdminTutors);
router.patch('/tutors/:id/approve', authMiddleware('ADMIN'), UserController.approveTutor);

export const AdminRoutes = router;

// User profile & password — mounted on /api/users
const userRouter = express.Router();
userRouter.patch('/profile', authMiddleware('STUDENT', 'TUTOR', 'ADMIN'), UserController.updateProfile);
userRouter.patch('/change-password', authMiddleware('STUDENT', 'TUTOR', 'ADMIN'), UserController.changePassword);

export const UserRoutes = userRouter;
