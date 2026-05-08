import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources = [
    {
      path: '',
      message: err.message || 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSources = err.issues.map((issue) => {
      return {
        path: issue.path[issue.path.length - 1] as string,
        message: issue.message,
      };
    });
  } else if (err?.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorSources = [{ path: '', message: err.message }];
  } else if (err?.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate Entry';
      errorSources = [{ path: '', message: err.message }];
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
