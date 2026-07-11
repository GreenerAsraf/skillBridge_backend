import { prisma } from '../../lib/prisma';

const createReview = async (studentId: string, payload: { bookingId: string; rating: number; comment: string }) => {
  const { bookingId, rating, comment } = payload;

  // 1. Check if booking exists and belongs to the student
  const booking = await prisma.bookings.findUnique({
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

  const existingReview = await prisma.reviews.findFirst({
    where: { bookingId }
  });

  if (existingReview) {
    throw new Error('You have already reviewed this session');
  }

  // 2. Create the review
  const review = await prisma.reviews.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId,
      rating,
      comment
    }
  });

  // 3. Update the tutor's average rating
  const tutorReviews = await prisma.reviews.findMany({
    where: { tutorId: booking.tutorId }
  });
  
  const totalRating = tutorReviews.reduce((sum: number, r: { rating: number; }) => sum + r.rating, 0);
  const averageRating = totalRating / tutorReviews.length;

  await prisma.tutorProfiles.update({
    where: { id: booking.tutorId },
    data: { rating: averageRating }
  });

  return review;
};

const getAllReviewsForAdmin = async () => {
  return await prisma.reviews.findMany({
    include: {
      user: { select: { name: true, email: true } },
      tutor: { include: { user: { select: { name: true } } } },
      booking: { select: { date: true, startTime: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const ReviewService = {
  createReview,
  getAllReviewsForAdmin
};
