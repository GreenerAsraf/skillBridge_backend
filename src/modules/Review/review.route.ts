import express from 'express';
import { ReviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.post('/', authMiddleware('STUDENT'), validateRequest(ReviewValidation.createReviewValidationSchema), ReviewController.createReview);

export const ReviewRoutes = router;

const adminRouter = express.Router();
adminRouter.get('/', authMiddleware('ADMIN'), ReviewController.getAllReviewsForAdmin);

export const AdminReviewRoutes = adminRouter;
