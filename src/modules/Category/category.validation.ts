import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    description: z.string().optional()
  })
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional()
  })
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema
};
