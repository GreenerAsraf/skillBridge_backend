import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    role: z.enum(['STUDENT', 'TUTOR', 'ADMIN', 'USER']).optional(),
    image: z.string().url().optional().or(z.literal('')),
  })
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z.string({ message: 'Password is required' })
  })
});

export const AuthValidation = {
  createUserValidationSchema,
  loginUserValidationSchema
};
