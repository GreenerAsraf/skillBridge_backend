import { prisma } from '../../lib/prisma';

// Create or update tutor profile
const updateTutorProfile = async (userId: string, payload: any) => {
  const { categoryId, ...restPayload } = payload;
  
  const data: any = { ...restPayload };

  const existingProfile = await prisma.tutorProfiles.findUnique({
    where: { authorId: userId }
  });

  if (existingProfile) {
    if (categoryId) {
      data.categories = {
        set: [{ id: categoryId }]
      };
    }
    return await prisma.tutorProfiles.update({
      where: { authorId: userId },
      data,
    });
  } else {
    if (categoryId) {
      data.categories = {
        connect: [{ id: categoryId }]
      };
    }
    return await prisma.tutorProfiles.create({
      data: {
        ...data,
        authorId: userId,
      }
    });
  }
};

// Set availability
const updateAvailability = async (userId: string, availabilities: any[]) => {
  const profile = await prisma.tutorProfiles.findUnique({
    where: { authorId: userId }
  });

  if (!profile) {
    throw new Error('Tutor profile not found! Create a profile first.');
  }

  // Delete old availabilities
  await prisma.tutorAvailability.deleteMany({
    where: { tutorProfileId: profile.id }
  });

  // Insert new ones
  const data = availabilities.map((avail) => ({
    ...avail,
    tutorProfileId: profile.id
  }));

  await prisma.tutorAvailability.createMany({
    data
  });

  return await prisma.tutorAvailability.findMany({
    where: { tutorProfileId: profile.id }
  });
};

// Get all tutors with filters
const getAllTutors = async (query: any) => {
  const { searchTerm, categoryId, minPrice, maxPrice, rating, sortBy, page, limit, admin } = query;

  const filters: any = {};

  // If not admin, only show approved tutors OR tutors with no explicit rejection
  // (isApproved can be null/true for newly created profiles)
  // Temporarily showing all tutors so they appear on the frontend for testing
  // if (admin !== 'true') {
  //   filters.isApproved = { not: false };
  // }

  if (searchTerm) {
    filters.OR = [
      { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
      { subject: { has: searchTerm } }
    ];
  }

  if (categoryId && categoryId !== 'ALL') {
    filters.categories = {
      some: {
        id: categoryId
      }
    };
  }

  if (rating) {
    filters.rating = {
      gte: Number(rating)
    };
  }

  if (minPrice || maxPrice) {
    filters.hourlyPrice = {};
    if (minPrice) filters.hourlyPrice.gte = Number(minPrice);
    if (maxPrice) filters.hourlyPrice.lte = Number(maxPrice);
  }

  const orderBy: any = {};
  if (sortBy === 'price-asc') {
    orderBy.hourlyPrice = 'asc';
  } else if (sortBy === 'price-desc') {
    orderBy.hourlyPrice = 'desc';
  } else if (sortBy === 'rating-desc') {
    orderBy.rating = 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  const take = limit ? Number(limit) : undefined;
  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;

  const [data, total] = await prisma.$transaction([
    prisma.tutorProfiles.findMany({
      where: filters,
      include: {
        user: { select: { name: true, email: true, image: true } },
        categories: true,
        availability: true,
        reviews: { select: { rating: true, comment: true } }
      },
      orderBy,
      skip,
      take
    }),
    prisma.tutorProfiles.count({ where: filters }),
  ]);

  return {
    data,
    meta: {
      total,
      page: page ? Number(page) : 1,
      limit: take ?? total,
    },
  };
};


// Get single tutor details
const getTutorById = async (id: string) => {
  return await prisma.tutorProfiles.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      categories: true,
      availability: true,
      reviews: { include: { user: { select: { name: true } } } }
    }
  });
};

// Get tutor profile by User ID (authorId)
const getMyProfile = async (userId: string) => {
  return await prisma.tutorProfiles.findUnique({
    where: { authorId: userId },
    include: {
      user: { select: { name: true, email: true, image: true } },
      categories: true,
      availability: true,
      reviews: {
        include: {
          user: { select: { name: true } }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
};

const getRelatedTutors = async (id: string) => {
  const tutor = await prisma.tutorProfiles.findUnique({
    where: { id },
    include: { categories: true }
  });

  if (!tutor) return [];

  const categoryIds = tutor.categories.map((c) => c.id);

  return await prisma.tutorProfiles.findMany({
    where: {
      id: { not: id },
      isApproved: { not: false },
      categories: {
        some: {
          id: { in: categoryIds }
        }
      }
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      categories: true,
      availability: true,
      reviews: { select: { rating: true, comment: true } }
    },
    take: 3
  });
};

export const TutorService = {
  updateTutorProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getMyProfile,
  getRelatedTutors,
};