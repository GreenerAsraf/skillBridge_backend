"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const studentId = req.user.id;
    const result = await review_service_1.ReviewService.createReview(studentId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: 'Review created successfully', data: result });
});
const getAllReviewsForAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getAllReviewsForAdmin();
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'All reviews retrieved successfully', data: result });
});
exports.ReviewController = {
    createReview,
    getAllReviewsForAdmin
};
