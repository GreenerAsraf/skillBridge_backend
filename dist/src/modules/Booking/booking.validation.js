"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        tutorId: zod_1.z.string({ message: 'Tutor ID is required' }),
        date: zod_1.z.string({ message: 'Date is required' }),
        startTime: zod_1.z.string({ message: 'Start time is required' }),
        endTime: zod_1.z.string({ message: 'End time is required' })
    })
});
const updateBookingStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED'], { message: 'Status is required' })
    })
});
exports.BookingValidation = {
    createBookingValidationSchema,
    updateBookingStatusValidationSchema
};
