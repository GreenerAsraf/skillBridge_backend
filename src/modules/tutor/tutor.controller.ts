import { Request, Response } from 'express';
import { TutorService } from './tutor.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TutorService.updateTutorProfile(userId, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Profile updated successfully', data: result });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const availabilities = req.body.availabilities || req.body;
  const result = await TutorService.updateAvailability(userId, availabilities);
  sendResponse(res, { statusCode: 200, success: true, message: 'Availability updated successfully', data: result });
});

const getAllTutors = catchAsync(async (req: Request, res: Response) => {
  const result = await TutorService.getAllTutors(req.query);
  sendResponse(res, { statusCode: 200, success: true, message: 'Tutors retrieved successfully', data: result });
});

const getTutorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TutorService.getTutorById(id);
  if (!result) throw new AppError(404, 'Tutor not found');
  sendResponse(res, { statusCode: 200, success: true, message: 'Tutor retrieved successfully', data: result });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TutorService.getMyProfile(userId);
  sendResponse(res, { statusCode: 200, success: true, message: 'Profile retrieved successfully', data: result });
});

export const TutorController = {
  updateProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getMyProfile
};