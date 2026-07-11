import { prisma } from '../../lib/prisma';
import { initiatePayment } from '../Payment/payment.service';

const createBooking = async (studentId: string, payload: any) => {
  // Payload should have tutorId, date, startTime, endTime
  // Booking starts as PENDING — payment must be completed to become CONFIRMED
  const booking = await prisma.bookings.create({
    data: {
      ...payload,
      date: new Date(payload.date),
      studentId,
      status: 'PENDING',
    },
  });

  // Auto-initiate SSLCommerz payment and return the gateway URL
  const { paymentUrl, transactionId } = await initiatePayment(booking.id);

  return { booking, paymentUrl, transactionId };
};

const getMyBookings = async (userId: string, role: string) => {
  // If role is TUTOR, find by their tutorProfile id
  if (role === 'TUTOR') {
    const tutorProfile = await prisma.tutorProfiles.findUnique({
      where: { authorId: userId }
    });
    if (!tutorProfile) return [];
    
    return await prisma.bookings.findMany({
      where: { tutorId: tutorProfile.id },
      include: { student: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // If role is STUDENT, find by their own user id
  return await prisma.bookings.findMany({
    where: { studentId: userId },
    include: { 
      tutor: { 
        include: { user: { select: { name: true, email: true } } } 
      },
      review: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getBookingDetails = async (id: string) => {
  return await prisma.bookings.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true } },
      tutor: { include: { user: { select: { name: true } } } },
      review: true,
      payment: true,
    }
  });
};

const updateBookingStatus = async (id: string, userId: string, role: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
  const booking = await prisma.bookings.findUnique({ 
    where: { id }, 
    include: { tutor: true } 
  });
  
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Business logic based on flow diagram:
  // Student can cancel
  if (role === 'STUDENT' && status === 'CANCELLED') {
    if (booking.studentId !== userId) throw new Error('Not authorized to cancel this booking');
  } 
  // Tutor can mark complete
  else if (role === 'TUTOR' && status === 'COMPLETED') {
    if (booking.tutor.authorId !== userId) throw new Error('Not authorized to complete this booking');
  } 
  // Admin can do anything, others fail
  else if (role !== 'ADMIN') {
    throw new Error('Invalid status update operation for your role');
  }

  return await prisma.bookings.update({
    where: { id },
    data: { status }
  });
};

const getAllBookingsForAdmin = async () => {
  return await prisma.bookings.findMany({
    include: {
      student: { select: { name: true, email: true } },
      tutor: { include: { user: { select: { name: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getStudentStats = async (studentId: string) => {
  const total = await prisma.bookings.count({
    where: { studentId }
  });

  const pending = await prisma.bookings.count({
    where: { studentId, status: 'PENDING' }
  });

  const upcoming = await prisma.bookings.count({
    where: { studentId, status: 'CONFIRMED' }
  });

  const completed = await prisma.bookings.count({
    where: { studentId, status: 'COMPLETED' }
  });

  const cancelled = await prisma.bookings.count({
    where: { studentId, status: 'CANCELLED' }
  });

  const totalSpentRes = await prisma.payment.aggregate({
    where: {
      booking: { studentId },
      status: 'SUCCESS'
    },
    _sum: {
      amount: true
    }
  });

  const avgRatingRes = await prisma.reviews.aggregate({
    where: { studentId },
    _avg: { rating: true }
  });

  return {
    total,
    pending,
    upcoming,
    completed,
    cancelled,
    totalSpent: totalSpentRes._sum.amount ?? 0,
    avgRatingGiven: avgRatingRes._avg.rating ?? 0
  };
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  updateBookingStatus,
  getAllBookingsForAdmin,
  getStudentStats,
};
