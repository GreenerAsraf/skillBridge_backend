import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    bookingId: z.string({ message: 'Booking ID is required' }),
    rating: z.number({ message: 'Rating is required' }).min(1).max(5),
    comment: z.string({ message: 'Comment is required' })
  })
});

export const ReviewValidation = {
  createReviewValidationSchema
};
