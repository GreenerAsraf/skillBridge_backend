import { z } from 'zod';

const updateProfileValidationSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    subject: z.array(z.string()).optional(),
    hourlyPrice: z.number().min(0, 'Price must be a positive number').optional(),
  })
});

const updateAvailabilityValidationSchema = z.object({
  body: z.object({
    availabilities: z.array(
      z.object({
        day: z.enum(['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI']),
        startTime: z.string().datetime(),
        endTime: z.string().datetime()
      })
    ).optional()
  })
});

export const TutorValidation = {
  updateProfileValidationSchema,
  updateAvailabilityValidationSchema
};
