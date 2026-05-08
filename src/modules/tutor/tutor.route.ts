import express from 'express';
import { TutorController } from './tutor.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TutorValidation } from './tutor.validation';

// Public routes (mount on /api/tutors)
const publicRouter = express.Router();
publicRouter.get('/', TutorController.getAllTutors);
publicRouter.get('/:id', TutorController.getTutorById);

export const PublicTutorRoutes = publicRouter;

// Private management routes (mount on /api/tutor)
const managementRouter = express.Router();
managementRouter.put('/profile', authMiddleware('TUTOR'), validateRequest(TutorValidation.updateProfileValidationSchema), TutorController.updateProfile);
managementRouter.put('/availability', authMiddleware('TUTOR'), validateRequest(TutorValidation.updateAvailabilityValidationSchema), TutorController.updateAvailability);

export const TutorManagementRoutes = managementRouter;
