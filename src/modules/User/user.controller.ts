import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

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
  const status = req.body.status === 'BANNED' ? 'BLOCKED' : req.body.status;
  const result = await UserService.updateUserStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User status updated successfully',
    data: mapUserStatus(result),
  });
});

export const UserController = {
  getMe,
  getAllUsers,
  updateUserStatus
};