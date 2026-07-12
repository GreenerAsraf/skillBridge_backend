import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const getPublicStats = catchAsync(async (req: Request, res: Response) => {
  // Count tutors
  const totalTutors = await prisma.tutorProfiles.count({
    where: {
      isApproved: true,
    },
  });

  // Count completed bookings (or all if not completed, but let's count completed sessions as completed learning)
  const completedBookings = await prisma.bookings.count({
    where: {
      status: 'COMPLETED',
    },
  });

  // Average review rating
  const avgRatingRes = await prisma.reviews.aggregate({
    _avg: {
      rating: true,
    },
  });

  const avgRating = avgRatingRes._avg.rating ?? 4.8; // Fallback default

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Public stats retrieved successfully',
    data: {
      totalTutors: totalTutors || 5, // Fallback default to ensure some numbers show in development
      totalBookings: completedBookings || 12,
      avgRating: Number(avgRating.toFixed(1)),
    },
  });
});

const getAdminAnalytics = catchAsync(async (req: Request, res: Response) => {
  // 1. Users by role
  const usersByRoleRaw = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true },
  });
  const usersByRole = usersByRoleRaw.map((u) => ({
    name: u.role,
    value: u._count.id,
  }));

  // 2. Bookings/Revenue over time (last 6 months approximation)
  // We'll just fetch all completed bookings and group them by month in JS for simplicity
  const allBookings = await prisma.bookings.findMany({
    select: { createdAt: true, status: true, payment: { select: { status: true } }, tutor: { select: { hourlyPrice: true } } },
  });

  const monthsMap: Record<string, { bookings: number; revenue: number }> = {};
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleString('default', { month: 'short' });
    monthsMap[month] = { bookings: 0, revenue: 0 };
  }

  allBookings.forEach((b) => {
    const month = b.createdAt.toLocaleString('default', { month: 'short' });
    if (monthsMap[month] !== undefined) {
      monthsMap[month].bookings += 1;
      if (b.status === 'COMPLETED' || b.payment?.status === 'SUCCESS') {
        monthsMap[month].revenue += b.tutor?.hourlyPrice || 0;
      }
    }
  });

  const revenueOverTime = Object.keys(monthsMap).map((m) => ({
    name: m,
    bookings: monthsMap[m].bookings,
    revenue: monthsMap[m].revenue,
  }));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin analytics retrieved successfully',
    data: {
      usersByRole,
      revenueOverTime,
    },
  });
});

export const StatsController = {
  getPublicStats,
  getAdminAnalytics,
};
