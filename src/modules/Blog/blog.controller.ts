import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog posts retrieved',
    data: posts,
  });
});

export const BlogController = { getAllPosts };
