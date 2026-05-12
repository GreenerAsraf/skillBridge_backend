"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: err.message || 'Something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorSources = err.issues.map((issue) => {
            return {
                path: issue.path[issue.path.length - 1],
                message: issue.message,
            };
        });
    }
    else if (err?.name === 'PrismaClientValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errorSources = [{ path: '', message: err.message }];
    }
    else if (err?.name === 'PrismaClientKnownRequestError') {
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
exports.default = globalErrorHandler;
