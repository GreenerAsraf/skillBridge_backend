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
  const { searchTerm, minPrice, maxPrice } = query;

  const filters: any = {};

  if (searchTerm) {
    filters.OR = [
      { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
      { subject: { has: searchTerm } }
    ];
  }
  if (minPrice || maxPrice) {
    filters.hourlyPrice = {};
    if (minPrice) filters.hourlyPrice.gte = Number(minPrice);
    if (maxPrice) filters.hourlyPrice.lte = Number(maxPrice);
  }

  return await prisma.tutorProfiles.findMany({
    where: filters,
    include: {
      user: { select: { name: true, email: true, image: true } },
      categories: true,
      availability: true,
      reviews: { select: { rating: true, comment: true } }
    }
  });
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

export const TutorService = {
  updateTutorProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getMyProfile
};