"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
// Public route to get all categories
router.get('/', category_controller_1.CategoryController.getAllCategories);
// Admin only routes for managing categories
router.post('/', (0, auth_1.authMiddleware)('ADMIN'), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createCategoryValidationSchema), category_controller_1.CategoryController.createCategory);
router.put('/:id', (0, auth_1.authMiddleware)('ADMIN'), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.updateCategoryValidationSchema), category_controller_1.CategoryController.updateCategory);
router.delete('/:id', (0, auth_1.authMiddleware)('ADMIN'), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
