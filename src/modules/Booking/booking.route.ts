import express from 'express';
import { BookingController } from './booking.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post('/', authMiddleware('STUDENT'), validateRequest(BookingValidation.createBookingValidationSchema), BookingController.createBooking);
router.get('/', authMiddleware('STUDENT', 'TUTOR'), BookingController.getMyBookings);
router.get('/stats', authMiddleware('STUDENT'), BookingController.getStudentStats);
router.get('/:id', authMiddleware('STUDENT', 'TUTOR', 'ADMIN'), BookingController.getBookingDetails);
router.patch('/:id/status', authMiddleware('STUDENT', 'TUTOR', 'ADMIN'), validateRequest(BookingValidation.updateBookingStatusValidationSchema), BookingController.updateBookingStatus);

export const BookingRoutes = router;

const adminRouter = express.Router();
adminRouter.get('/', authMiddleware('ADMIN'), BookingController.getAllBookingsForAdmin);

export const AdminBookingRoutes = adminRouter;
