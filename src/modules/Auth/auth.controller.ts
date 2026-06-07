import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const mapUserStatus = (user: any) => {
  if (!user) return user;
  return {
    ...user,
    status: user.status === 'BLOCKED' ? 'BANNED' : user.status,
  };
};

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: mapUserStatus(result),
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  if (result && result.user) {
    result.user = mapUserStatus(result.user);
  }
  res.cookie('token', result.token, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
};
