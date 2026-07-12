import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { prisma } from '../../lib/prisma';

const mapUserStatus = (user: any) => {
  if (!user) return user;
  return {
    ...user,
    status: user.status === 'BLOCKED' ? 'BANNED' : user.status,
  };
};

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await UserService.getMe(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully',
    data: mapUserStatus(result),
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result ? result.map(mapUserStatus) : [],
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await UserService.updateUserStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User status updated successfully',
    data: mapUserStatus(result),
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await UserService.updateProfile(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { currentPassword, newPassword } = req.body;
  const result = await UserService.changePassword(userId, currentPassword, newPassword);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

const getAllAdminTutors = catchAsync(async (req: Request, res: Response) => {
  const tutors = await prisma.tutorProfiles.findMany({
    include: {
      user: { select: { name: true, email: true } },
      categories: { select: { name: true } },
    },
  });
  sendResponse(res, { statusCode: 200, success: true, message: 'Tutors retrieved', data: tutors });
});

const approveTutor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isApproved } = req.body;
  const tutor = await prisma.tutorProfiles.update({
    where: { id },
    data: { isApproved: Boolean(isApproved) },
  });
  sendResponse(res, { statusCode: 200, success: true, message: 'Tutor approval updated', data: tutor });
});

export const UserController = {
  getMe,
  getAllUsers,
  updateUserStatus,
  updateProfile,
  changePassword,
  getAllAdminTutors,
  approveTutor,
};