import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const result = await ReviewService.createReview(studentId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Review created successfully', data: result });
});

const getAllReviewsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewsForAdmin();
  sendResponse(res, { statusCode: 200, success: true, message: 'All reviews retrieved successfully', data: result });
});

export const ReviewController = {
  createReview,
  getAllReviewsForAdmin
};
