"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const booking_service_1 = require("./booking.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const studentId = req.user.id;
    const result = await booking_service_1.BookingService.createBooking(studentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Booking created. Redirecting to payment gateway...',
        data: result, // includes { booking, paymentUrl, transactionId }
    });
});
const getMyBookings = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const result = await booking_service_1.BookingService.getMyBookings(userId, role);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Bookings retrieved successfully', data: result });
});
const getBookingDetails = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.getBookingDetails(id);
    if (!result)
        throw new AppError_1.default(404, 'Booking not found');
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Booking details retrieved successfully', data: result });
});
const updateBookingStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
    const status = req.body.status;
    const result = await booking_service_1.BookingService.updateBookingStatus(id, userId, role, status);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Booking status updated successfully', data: result });
});
const getAllBookingsForAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.getAllBookingsForAdmin();
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'All bookings retrieved successfully', data: result });
});
exports.BookingController = {
    createBooking,
    getMyBookings,
    getBookingDetails,
    updateBookingStatus,
    getAllBookingsForAdmin
};
