"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../lib/prisma");
const createReview = async (studentId, payload) => {
    const { bookingId, rating, comment } = payload;
    // 1. Check if booking exists and belongs to the student
    const booking = await prisma_1.prisma.bookings.findUnique({
        where: { id: bookingId }
    });
    if (!booking) {
        throw new Error('Booking not found');
    }
    if (booking.studentId !== studentId) {
        throw new Error('You can only review your own bookings');
    }
    if (booking.status !== 'COMPLETED') {
        throw new Error('You can only review completed sessions');
    }
    // 2. Create the review
    const review = await prisma_1.prisma.reviews.create({
        data: {
            studentId,
            tutorId: booking.tutorId,
            bookingId,
            rating,
            comment
        }
    });
    // 3. Update the tutor's average rating
    const tutorReviews = await prisma_1.prisma.reviews.findMany({
        where: { tutorId: booking.tutorId }
    });
    const totalRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / tutorReviews.length;
    await prisma_1.prisma.tutorProfiles.update({
        where: { id: booking.tutorId },
        data: { rating: averageRating }
    });
    return review;
};
const getAllReviewsForAdmin = async () => {
    return await prisma_1.prisma.reviews.findMany({
        include: {
            user: { select: { name: true, email: true } },
            tutor: { include: { user: { select: { name: true } } } },
            booking: { select: { date: true, startTime: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.ReviewService = {
    createReview,
    getAllReviewsForAdmin
};
