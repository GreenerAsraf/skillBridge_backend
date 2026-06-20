import { prisma } from '../../lib/prisma';
import SSLCommerzPayment from 'sslcommerz-lts';

const isLive = process.env.SSLCOMMERZ_LIVE === 'true';

export const initiatePayment = async (bookingId: string) => {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: {
      student: { select: { name: true, email: true } },
      tutor: { select: { hourlyPrice: true } },
    },
  });

  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'PENDING') throw new Error('Booking is not in a payable state');

  const transactionId = `TXN-${bookingId}-${Date.now()}`;
  const amount = booking.tutor.hourlyPrice ?? 0;
  if (!amount || amount <= 0) {
    throw new Error('Tutor has not set a valid hourly price. Cannot initiate payment.');
  }
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:5000';
  const cleanBackendUrl = backendUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${cleanBackendUrl}/api/payment/success?bookingId=${bookingId}&transactionId=${transactionId}`,
    fail_url: `${cleanBackendUrl}/api/payment/fail?bookingId=${bookingId}`,
    cancel_url: `${cleanBackendUrl}/api/payment/cancel?bookingId=${bookingId}`,
    ipn_url: `${cleanBackendUrl}/api/payment/ipn`,
    shipping_method: 'NO',
    product_name: 'Tutoring Session',
    product_category: 'Education',
    product_profile: 'service',
    cus_name: booking.student.name,
    cus_email: booking.student.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    cus_postcode: '1000',
    ship_name: booking.student.name,
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh',
    ship_postcode: '1000',
    multi_card_name: 'mastercard,visa,bkash,nagad',
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID!,
    process.env.SSLCOMMERZ_STORE_PASSWORD!,
    isLive,
  );

  const apiResponse = await sslcz.init(data);

  if (!apiResponse?.GatewayPageURL) {
    console.error('[SSLCommerz] Failed to get GatewayPageURL. Full response:', JSON.stringify(apiResponse, null, 2));
    console.error('[SSLCommerz] Request data used:', JSON.stringify({ ...data, total_amount: amount, store_id: process.env.SSLCOMMERZ_STORE_ID }, null, 2));
    throw new Error(
      apiResponse?.failedreason ||
      apiResponse?.status ||
      'Could not initiate payment. Please try again.'
    );
  }

  // Create or update a pending payment record
  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      amount,
      transactionId,
      status: 'PENDING',
    },
    update: {
      amount,
      transactionId,
      status: 'PENDING',
    },
  });

  return { paymentUrl: apiResponse.GatewayPageURL, transactionId };
};

export const handlePaymentSuccess = async (bookingId: string, transactionId: string, valId: string) => {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  try {
    // Update payment and booking atomically in a transaction
    await prisma.$transaction([
      prisma.payment.update({
        where: { transactionId },
        data: { status: 'SUCCESS', valId },
      }),
      prisma.bookings.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      }),
    ]);
    return `${frontendUrl}/payment/success?bookingId=${bookingId}`;
  } catch {
    return `${frontendUrl}/payment/fail?bookingId=${bookingId}&reason=db_error`;
  }
};

export const handlePaymentFail = async (bookingId: string) => {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  try {
    await prisma.payment.updateMany({
      where: { bookingId, status: 'PENDING' },
      data: { status: 'FAILED' },
    });
    // Booking remains PENDING so user can retry
  } catch { /* ignore */ }
  return `${frontendUrl}/payment/fail?bookingId=${bookingId}`;
};

export const handlePaymentCancel = async (bookingId: string) => {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  try {
    await prisma.payment.updateMany({
      where: { bookingId, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });
  } catch { /* ignore */ }
  return `${frontendUrl}/payment/cancel?bookingId=${bookingId}`;
};

export const handleIPN = async (body: any) => {
  const { tran_id, val_id, status } = body;
  if (!tran_id) return;

  const payment = await prisma.payment.findUnique({ where: { transactionId: tran_id } });
  if (!payment) return;

  if (status === 'VALID' || status === 'VALIDATED') {
    await prisma.$transaction([
      prisma.payment.update({
        where: { transactionId: tran_id },
        data: { status: 'SUCCESS', valId: val_id, gatewayResponse: body },
      }),
      prisma.bookings.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      }),
    ]);
  } else if (status === 'FAILED') {
    await prisma.payment.update({
      where: { transactionId: tran_id },
      data: { status: 'FAILED', gatewayResponse: body },
    });
  }
};

export const PaymentService = {
  initiatePayment,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handleIPN,
};
