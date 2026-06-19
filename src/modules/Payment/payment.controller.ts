import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

/**
 * Student calls this to get the SSLCommerz payment URL for their pending booking.
 */
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = String(req.params.bookingId);
  const result = await PaymentService.initiatePayment(bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

/**
 * SSLCommerz redirects here (GET) on successful payment.
 * We update the DB and redirect user to frontend success page.
 */
const paymentSuccess = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.query.bookingId as string;
  const transactionId = req.query.transactionId as string;
  const valId = (req.body?.val_id || req.query?.val_id || '') as string;
  const redirectUrl = await PaymentService.handlePaymentSuccess(bookingId, transactionId, valId);
  res.redirect(redirectUrl);
};

/**
 * SSLCommerz redirects here on payment failure.
 */
const paymentFail = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.query as { bookingId: string };
  const redirectUrl = await PaymentService.handlePaymentFail(bookingId);
  res.redirect(redirectUrl);
};

/**
 * SSLCommerz redirects here if user cancels payment.
 */
const paymentCancel = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = req.query as { bookingId: string };
  const redirectUrl = await PaymentService.handlePaymentCancel(bookingId);
  res.redirect(redirectUrl);
};

/**
 * SSLCommerz IPN (Instant Payment Notification) - background verification webhook.
 */
const paymentIPN = async (req: Request, res: Response): Promise<void> => {
  await PaymentService.handleIPN(req.body);
  res.status(200).send('IPN received');
};

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};
