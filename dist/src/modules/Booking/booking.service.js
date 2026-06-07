"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const prisma_1 = require("../../lib/prisma");
const createBooking = async (studentId, payload) => {
    // Payload should have tutorId, date, startTime, endTime
    return await prisma_1.prisma.bookings.create({
        data: {
            ...payload,
            date: new Date(payload.date), // Convert string to Date
            studentId
        }
    });
};
const getMyBookings = async (userId, role) => {
    // If role is TUTOR, find by their tutorProfile id
    if (role === 'TUTOR') {
        const tutorProfile = await prisma_1.prisma.tutorProfiles.findUnique({
            where: { authorId: userId }
        });
        if (!tutorProfile)
            return [];
        return await prisma_1.prisma.bookings.findMany({
            where: { tutorId: tutorProfile.id },
            include: { student: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    // If role is STUDENT, find by their own user id
    return await prisma_1.prisma.bookings.findMany({
        where: { studentId: userId },
        include: {
            tutor: {
                include: { user: { select: { name: true, email: true } } }
            },
            review: true
        },
        orderBy: { createdAt: 'desc' }
    });
};
const getBookingDetails = async (id) => {
    return await prisma_1.prisma.bookings.findUnique({
        where: { id },
        include: {
            student: { select: { name: true, email: true } },
            tutor: { include: { user: { select: { name: true } } } },
            review: true
        }
    });
};
const updateBookingStatus = async (id, userId, role, status) => {
    const booking = await prisma_1.prisma.bookings.findUnique({
        where: { id },
        include: { tutor: true }
    });
    if (!booking) {
        throw new Error('Booking not found');
    }
    // Business logic based on flow diagram:
    // Student can cancel
    if (role === 'STUDENT' && status === 'CANCELLED') {
        if (booking.studentId !== userId)
            throw new Error('Not authorized to cancel this booking');
    }
    // Tutor can mark complete
    else if (role === 'TUTOR' && status === 'COMPLETED') {
        if (booking.tutor.authorId !== userId)
            throw new Error('Not authorized to complete this booking');
    }
    // Admin can do anything, others fail
    else if (role !== 'ADMIN') {
        throw new Error('Invalid status update operation for your role');
    }
    return await prisma_1.prisma.bookings.update({
        where: { id },
        data: { status }
    });
};
const getAllBookingsForAdmin = async () => {
    return await prisma_1.prisma.bookings.findMany({
        include: {
            student: { select: { name: true, email: true } },
            tutor: { include: { user: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.BookingService = {
    createBooking,
    getMyBookings,
    getBookingDetails,
    updateBookingStatus,
    getAllBookingsForAdmin
};
