"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = void 0;
const prisma_1 = require("../../lib/prisma");
// Create or update tutor profile
const updateTutorProfile = async (userId, payload) => {
    const existingProfile = await prisma_1.prisma.tutorProfiles.findUnique({
        where: { authorId: userId }
    });
    if (existingProfile) {
        return await prisma_1.prisma.tutorProfiles.update({
            where: { authorId: userId },
            data: payload,
        });
    }
    else {
        return await prisma_1.prisma.tutorProfiles.create({
            data: {
                ...payload,
                authorId: userId,
            }
        });
    }
};
// Set availability
const updateAvailability = async (userId, availabilities) => {
    const profile = await prisma_1.prisma.tutorProfiles.findUnique({
        where: { authorId: userId }
    });
    if (!profile) {
        throw new Error('Tutor profile not found! Create a profile first.');
    }
    // Delete old availabilities
    await prisma_1.prisma.tutorAvailability.deleteMany({
        where: { tutorProfileId: profile.id }
    });
    // Insert new ones
    const data = availabilities.map((avail) => ({
        ...avail,
        tutorProfileId: profile.id
    }));
    await prisma_1.prisma.tutorAvailability.createMany({
        data
    });
    return await prisma_1.prisma.tutorAvailability.findMany({
        where: { tutorProfileId: profile.id }
    });
};
// Get all tutors with filters
const getAllTutors = async (query) => {
    const { searchTerm, minPrice, maxPrice } = query;
    const filters = {};
    if (searchTerm) {
        filters.OR = [
            { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
            { subject: { has: searchTerm } }
        ];
    }
    if (minPrice || maxPrice) {
        filters.hourlyPrice = {};
        if (minPrice)
            filters.hourlyPrice.gte = Number(minPrice);
        if (maxPrice)
            filters.hourlyPrice.lte = Number(maxPrice);
    }
    return await prisma_1.prisma.tutorProfiles.findMany({
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
const getTutorById = async (id) => {
    return await prisma_1.prisma.tutorProfiles.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true, image: true } },
            categories: true,
            availability: true,
            reviews: { include: { user: { select: { name: true } } } }
        }
    });
};
exports.TutorService = {
    updateTutorProfile,
    updateAvailability,
    getAllTutors,
    getTutorById
};
