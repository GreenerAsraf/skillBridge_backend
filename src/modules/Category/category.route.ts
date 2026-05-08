import express from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();

// Public route to get all categories
router.get('/', CategoryController.getAllCategories);

// Admin only routes for managing categories
router.post('/', authMiddleware('ADMIN'), validateRequest(CategoryValidation.createCategoryValidationSchema), CategoryController.createCategory);
router.put('/:id', authMiddleware('ADMIN'), validateRequest(CategoryValidation.updateCategoryValidationSchema), CategoryController.updateCategory);
router.delete('/:id', authMiddleware('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
