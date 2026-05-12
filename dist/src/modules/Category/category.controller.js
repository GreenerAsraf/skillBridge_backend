"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.createCategory(req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: 'Category created successfully', data: result });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.getAllCategories();
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Categories retrieved successfully', data: result });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await category_service_1.CategoryService.updateCategory(id, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Category updated successfully', data: result });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await category_service_1.CategoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Category deleted successfully', data: result });
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
