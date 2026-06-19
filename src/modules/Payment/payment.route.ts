import express from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = express.Router();

// Student initiates payment for a booking
router.post('/initiate/:bookingId', authMiddleware('STUDENT'), PaymentController.initiatePayment);

// SSLCommerz callback endpoints (no auth — called by gateway)
router.post('/success', PaymentController.paymentSuccess);
router.get('/success', PaymentController.paymentSuccess);
router.post('/fail', PaymentController.paymentFail);
router.get('/fail', PaymentController.paymentFail);
router.post('/cancel', PaymentController.paymentCancel);
router.get('/cancel', PaymentController.paymentCancel);
router.post('/ipn', PaymentController.paymentIPN);

export const PaymentRoutes = router;
