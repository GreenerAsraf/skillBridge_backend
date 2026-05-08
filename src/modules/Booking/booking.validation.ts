import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    tutorId: z.string({ message: 'Tutor ID is required' }),
    date: z.string({ message: 'Date is required' }),
    startTime: z.string({ message: 'Start time is required' }),
    endTime: z.string({ message: 'End time is required' })
  })
});

const updateBookingStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED'], { message: 'Status is required' })
  })
});

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema
};
