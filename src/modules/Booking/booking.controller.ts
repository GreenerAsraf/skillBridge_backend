import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const result = await BookingService.createBooking(studentId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created. Redirecting to payment gateway...',
    data: result, // includes { booking, paymentUrl, transactionId }
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const result = await BookingService.getMyBookings(userId, role);
  sendResponse(res, { statusCode: 200, success: true, message: 'Bookings retrieved successfully', data: result });
});

const getBookingDetails = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BookingService.getBookingDetails(id);
  if (!result) throw new AppError(404, 'Booking not found');
  sendResponse(res, { statusCode: 200, success: true, message: 'Booking details retrieved successfully', data: result });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const status = req.body.status as 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  
  const result = await BookingService.updateBookingStatus(id, userId, role, status);
  sendResponse(res, { statusCode: 200, success: true, message: 'Booking status updated successfully', data: result });
});

const getAllBookingsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookingsForAdmin();
  sendResponse(res, { statusCode: 200, success: true, message: 'All bookings retrieved successfully', data: result });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  updateBookingStatus,
  getAllBookingsForAdmin
};
