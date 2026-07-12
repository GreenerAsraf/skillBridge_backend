import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const submitContact = catchAsync(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: contact,
  });
});

export const ContactController = {
  submitContact,
};
